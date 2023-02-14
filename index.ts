import express, { Express } from 'express'
import { handler as ssrHandler } from './dist/server/entry.mjs'

const app: Express = express()

app.use(express.static('dist/client/'))
app.use(ssrHandler)

const server = app.listen(3000)

for (const signal of ['SIGTERM', 'SIGINT']) {
  process.on(signal, () => {
    server.close((err) => {
      process.exit(err ? 1 : 0)
    })
  })
}
