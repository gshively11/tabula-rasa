import express from 'express'

import signup from './signup.js'

const router = express.Router()

router.use('/signup', signup)

export default router
