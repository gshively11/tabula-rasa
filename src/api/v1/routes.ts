import express from 'express'

import login from './login.js'
import signup from './signup.js'
import username from './username.js'

const router = express.Router()

router.use('/login', login)
router.use('/signup', signup)
router.use('/username', username)

export default router
