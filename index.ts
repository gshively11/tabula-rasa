import express, { Express } from 'express'
import { handler as ssrHandler } from './dist/server/entry.mjs'

const PORT: string = process.env.PORT || '3000'
const app: Express = express()

// astro static assets are built to dist/client
app.use(express.static('dist/client/'))
// ssrHandler handles requests for astro pages/assets
app.use(ssrHandler)

console.log(`tabula-rasa is listening on :${PORT}`)

const server = app.listen(PORT)

for (const signal of ['SIGTERM', 'SIGINT']) {
  process.on(signal, () => {
    console.log(`Received ${signal}, closing tabula-rasa`)
    server.close((err: Error | undefined) => {
      if (err) {
        console.log('An error was encountered while closing tabula-rasa')
        console.log(err)
      }
      process.exit(err ? 1 : 0)
    })
  })
}
