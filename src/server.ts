/**
 * expected environment variables:
 *  JWT_SECRET
 *  OPENAI_API_KEY
 *  NODE_ENV
 */
import './env.js'

// in dev we don't care about graceful shutdowns

import express, { Application } from 'express'
import bodyParser from 'body-parser'
import swaggerUi from 'swagger-ui-express'
import cookieParser from 'cookie-parser'

import { authentication, userContext } from './api/authentication.js'
import { handler as ssrHandler } from '../dist/server/entry.mjs'
import routes from './api/routes.js'
import specs from './api/specs.js'
import setupIo from './api/io.js'

const PORT: string = process.env.PORT || '3000'
const app: Application = express()

// astro static assets are built to dist/client
app.use(express.static('dist/client/'))
// ssrHandler handles requests for astro pages/assets
app.use(ssrHandler)
// setup swagger UI and wire up the api specs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }))

/**
 * @swagger
 *
 * components:
 *  securitySchemes:
 *    cookieAuth:
 *      type: apiKey
 *      in: cookie
 *      name: tr_jwt
 */
app.use(
  '/api',
  bodyParser.json(),
  bodyParser.urlencoded({ extended: true }),
  cookieParser(),
  authentication.unless({
    path: [/(signup|login)\/?$/, /username\/.+$/],
  }),
  userContext,
  routes
)

console.log(`tabula-rasa is listening on :${PORT}`)

const server = app.listen(PORT)
setupIo(server)
