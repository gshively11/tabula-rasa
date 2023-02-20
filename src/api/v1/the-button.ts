import type { Server, Socket } from 'socket.io'

import User from '../../models/User.js'
import UserClicks from '../../models/UserClicks.js'
import type { Click } from '../../models/UserClicks.js'

export default async function theButton(io: Server, socket: Socket) {
  socket.join('the-button')

  let nextToken = ''
  let clickCount = 0
  let isAdmin = false

  // if the client is logged in as a user
  if (socket.data.userId) {
    // get the current user
    const user = await User.findById(socket.data.userId)
    if (!user) {
      throw new Error('unauthorized')
    }
    // get the current user click count and token
    const userClicks = await UserClicks.findByUserId(socket.data.userId)

    if (userClicks) {
      nextToken = userClicks.model.nextToken
      clickCount = userClicks.model.clickCount
    }

    // login/logout notifications
    io.to('the-button').emit('v1:the-button:user-login', user.model.username)
    socket.on('disconnect', () => {
      io.to('the-button').emit('v1:the-button:user-logoff', user.model.username)
    })

    // hacky method that gives me a way to delete offensive users
    isAdmin = user.model.username === 'grant'

    // handler for clicks coming from the client
    socket.on('v1:the-button:clicks', async (clicks: Click[], token: string) => {
      const userClicks = await UserClicks.getOrCreate(socket.data.userId)
      const result = await userClicks.addClicks(clicks, token)
      if (!result.valid) {
        socket.emit('v1:the-button:invalid-clicks', result.reason)
      } else {
        socket.emit(
          'v1:the-button:next-token',
          userClicks.model.nextToken,
          userClicks.model.clickCount
        )
      }
    })

    socket.on('v1:the-button:delete-user', async (username: string) => {
      if (!isAdmin) {
        return
      }
      await User.deleteByUsername(username)
    })
  }

  // get the current leaders
  const leaders = await UserClicks.getLeaders()

  // tell the client we're ready to handle events
  // from The Button
  socket.emit('v1:the-button:connected', nextToken, clickCount, isAdmin, leaders)
}
