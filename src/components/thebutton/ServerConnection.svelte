<script>
  import { onMount } from 'svelte'
  import { io } from 'socket.io-client'

  import { clicks, userScore, isAdmin, leaders } from '../../nanostores/the-button.ts'

  let clickPushInterval
  let clickToken = ''
  let submittingClicks = false

  const socket = io()

  socket.on('v1:the-button:connected', (nextToken, clickCount, admin, currentLeaders) => {
    clickToken = nextToken
    userScore.set(clickCount)
    isAdmin.set(admin)
    leaders.set(currentLeaders)
    clickPushInterval = setInterval(() => {
      let currentClicks = clicks.get()
      if (currentClicks.length > 0) {
        submittingClicks = true
        clicks.set([])
        socket.emit('v1:the-button:clicks', currentClicks, clickToken)
      }
    }, 2000)
  })

  socket.on('v1:the-button:invalid-clicks', () => {
    alert('nope')
  })

  socket.on('v1:the-button:next-token', (nextToken, clickCount) => {
    clickToken = nextToken
    userScore.set(clickCount)
    submittingClicks = false
  })

  socket.on('v1:the-button:leaders-change', (newLeaders) => {
    leaders.set(newLeaders)
  })

  socket.on('disconnect', (reason) => {
    clearInterval(clickPushInterval)

    if (reason === 'io server disconnect') {
      socket.connect()
    }
  })

  onMount(() => {
    window.theButton = {
      deleteUser: (username) => {
        if (!isAdmin) {
          return
        }
        socket.emit('v1:the-button:delete-user', username)
      },
    }
  })
</script>
