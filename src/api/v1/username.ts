import express from 'express'

import User from '../../models/User.js'

const usernameRouter = express.Router()

/**
 * @swagger
 * components:
 *  schemas:
 *    UserCheck:
 *      type: object
 *      properties:
 *        available:
 *          type: boolean
 *          description: Flag indicating whether or not the username is available
 * tags:
 *  name: username
 *  description: The username API
 * /api/v1/username/{username}:
 *  get:
 *    summary: Check if a username is available
 *    tags: [username]
 *    paramters:
 *      - name: username
 *        in: path
 *        description: The username to check
 *        schema:
 *          type: string
 *        required: true
 *    responses:
 *      200:
 *        description: Object indicating whether or not the username is available
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                available:
 *                  type: boolean
 *      500:
 *        description: Unexpected server error
 */
usernameRouter.get('/:username', async (req, res) => {
  const username = req.params.username
  if (!username) {
    return res.sendStatus(500)
  }
  const exists = await User.exists(username)
  return res.json({ available: !exists })
})

export default usernameRouter
