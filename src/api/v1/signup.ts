import express from 'express'

import { ExistingUserError } from '../../errors.js'
import User from '../../models/User.js'

const signup = express.Router()

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
 *            $ref: '#/components/schemas/NewUser'
 *    responses:
 *      200:
 *        description: The newly created user
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                user:
 *                  $ref: '#/components/schemas/User'
 *      403:
 *        description: The username is already taken
 *      500:
 *        description: Unexpected server error
 */
signup.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body.username, req.body.password)
    // destructure user to the subset we want in the response
    const response = (({ id, username, createdAt }) => ({ id, username, createdAt }))(user.model)
    return res.json(response)
  } catch (err) {
    if (err instanceof ExistingUserError) {
      return res.sendStatus(403)
    }
  }
})

export default signup
