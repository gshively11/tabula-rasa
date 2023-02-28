import express from 'express'

import { login } from '../authentication.js'
import User from '../../models/User.js'

const loginRouter = express.Router()

/**
 * @swagger
 * components:
 *  schemas:
 *    UserLogin:
 *      type: object
 *      required:
 *        - username
 *        - password
 *      properties:
 *        username:
 *          type: string
 *          description: Desired username for the user
 *        password:
 *          type: string
 *          description: Desired password for the user
 *        redirect:
 *          type: string
 *          description: URL to redirect to after login
 *      example:
 *        username: foobar
 *        password: hunter2
 *        redirect: https://ihopethis.works/projects/thebutton/
 * tags:
 *  name: login
 *  description: Login as a user
 * /api/v1/login:
 *  post:
 *    summary: Login as a user
 *    tags: [login]
 *    requestBody:
 *      description: Provide the username and password for the user
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            $ref: "#/components/schemas/UserLogin"
 *    responses:
 *      303:
 *        description: Redirect to chosen location, logged in as the user.
 *        content:
 *          text/html:
 *            schema:
 *              type: string
 *      401:
 *        description: Failed to login
 *      500:
 *        description: Unexpected server error
 */
loginRouter.post('/', async (req, res) => {
  const user = await User.findByUsername(req.body.username)

  if (!user) {
    return res.sendStatus(401)
  }

  // attempt to login and then redirect to the provided url,
  // or the home page if one is not provided.
  // the login method mutates the response.
  const loggedIn = await login(res, user, req.body.password)

  if (!loggedIn) {
    return res.sendStatus(401)
  }

  return res.redirect(303, req.body.redirect || '/')
})

export default loginRouter
