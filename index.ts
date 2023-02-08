import express, { Express } from 'express'
import { handler as ssrHandler } from './dist/server/entry.mjs'

const app: Express = express()

app.use(express.static('dist/client/'))
app.use(ssrHandler)

app.listen(3000)
