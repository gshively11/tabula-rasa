import { Server } from 'socket.io'
import type { Socket } from 'socket.io'

import theButton from './v1/the-button.js'
import type { Click } from '../models/UserClicks.js'
import { ioAuthentication } from './authentication.js'
import { UserClicks } from '../models/UserClicks.js'
import type { ClickLeader } from '../models/UserClicks.js'

const shutdownTimeout = process.env.NODE_ENV === 'production' ? 5000 : 1

interface ClientToServerEvents {
  'v1:the-button:clicks': (clicks: Click[], code: string) => void
  'v1:the-button:delete-user': (username: string) => void
}

interface ServerToClientEvents {
  'v1:the-button:connected': () => void
  'v1:the-button:leaders-change': (leaders: ClickLeader[]) => void
}

function handleSignals(io: Server) {
  for (const signal of ['SIGTERM', 'SIGINT']) {
    process.on(signal, () => {
      console.log(`Received ${signal}, closing tabula-rasa`)
      io.close((err: Error | undefined) => {
        if (err) {
          console.log('An error was encountered while closing tabula-rasa')
          console.log(err)
        }
        process.exit(err ? 1 : 0)
      })
      setTimeout(() => {
        console.error('Graceful shutdown timed out after 5 seconds, forcefully shutting down')
        process.exit(1)
      }, shutdownTimeout)
    })
  }
}

export default function setupIo(server: Express.Application) {
  // create the socket.io server and attach it to the express server
  const io = new Server<ClientToServerEvents, ServerToClientEvents>(server)

  io.use(ioAuthentication)

  // when a connection is established, wire up the handlers
  io.on('connection', async (socket: Socket) => {
    try {
      await theButton(io, socket)
    } catch (err) {
      console.error(err)
      try {
        socket.emit('v1:the-button:server-error', 'server error')
      } catch (innerErr) {
        console.error(innerErr)
      }
    }
  })

  // send out leaderboard updates
  UserClicks.registerLeaderChangeListener((leaders: ClickLeader[]) => {
    io.to('the-button').emit('v1:the-button:leaders-change', leaders)
  })

  // handle sigint/sigterm for closing the server
  handleSignals(io)
}
