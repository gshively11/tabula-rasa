import express from 'express'

import { login } from '../authentication.js'
import { ExistingUserError } from '../../errors.js'
import User from '../../models/User.js'

const signupRouter = express.Router()

/**
 * @swagger
 * components:
 *  schemas:
 *    NewUser:
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
 *      example:
 *        username: foobar
 *        password: hunter2
 *    NewUserWithLogin:
 *      type: object
 *      required:
 *        - username
 *        - password
 *        - redirect
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
 *    User:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          format: uuidv4
 *          description: UUIDv4 of the user
 *        username:
 *          type: string
 *          description: Username of the user
 *        createdAt:
 *          type: string
 *          format: date-time
 * tags:
 *  name: signup
 *  description: The signup API
 * /api/v1/signup:
 *  post:
 *    summary: Sign up a new user
 *    tags: [signup]
 *    requestBody:
 *      description: Provide the desired username and password for the new user
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#/components/schemas/NewUser"
 *        application/x-www-form-urlencoded:
 *          schema:
 *            $ref: "#/components/schemas/NewUserWithLogin"
 *    responses:
 *      200:
 *        description: The newly created user
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                user:
 *                  $ref: "#/components/schemas/User"
 *      303:
 *        description: Redirect to chosen location, logged in as the new user.
 *        content:
 *          text/html:
 *            schema:
 *              type: string
 *      403:
 *        description: The username is already taken
 *      500:
 *        description: Unexpected server error
 */
signupRouter.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body.username, req.body.password)
    // destructure user to the subset we want in the response
    const response = (({ id, username, createdAt }) => ({ id, username, createdAt }))(user.model)

    // if content type is json, just return the new user as json
    if (req.is('application/json')) {
      return res.json(response)
    }

    // if this req is coming from the signup form, attempt to login,
    // and then redirect to the provided url, or the home page if
    // one is not provided. the login method mutates the response.
    const loggedIn = await login(res, user, req.body.password)

    if (!loggedIn) {
      return res.sendStatus(403)
    }

    return res.redirect(303, req.body.redirect || '/')
  } catch (err) {
    if (err instanceof ExistingUserError) {
      return res.sendStatus(403)
    }
    throw err
  }
})

export default signupRouter
