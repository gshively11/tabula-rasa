import express from 'express'

import login from './login.js'
import signup from './signup.js'

const router = express.Router()

router.use('/login', login)
router.use('/signup', signup)

export default router
