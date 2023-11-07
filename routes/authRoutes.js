const express = require('express')
const cookieParser = require('cookie-parser')
const router = express.Router()
const authController = require('../controllers/authController')
const middleware = require('../utilities/middleware')

router.use(cookieParser())

router.post('/signup',authController.signup)
router.post('/login',authController.login)
router.get('/verify',authController.verify)
router.post('/resend',authController.resend)
router.post('/logout',middleware,authController.logout)
router.post('/validate',middleware,authController.validate)
module.exports = router
