import { Router } from 'express'
import passport from 'passport'
import * as authController from '../controllers/authController.js'

const authRouter = Router()

// Register
authRouter.post('/register', authController.register)

// LogIn
authRouter.post('/login', passport.authenticate('local'), authController.logIn)

// Auth Status (if user is authenticated or not)
authRouter.get('/status', authController.authStatus)

// LogOut
authRouter.post('/logout', authController.logOut)

// 2FA Setup
authRouter.post('/2fa/setup', (req, res, next) => {
  if (req.isAuthenticated()) return next()
  res.status(401).json({ message: 'User not authorized' })
}, authController.setup2FA)

// Verify Route
authRouter.post('/2fa/verify', (req, res, next) => {
  if (req.isAuthenticated()) return next()
  res.status(401).json({ message: 'User not authorized' })
}, authController.verify2FA)

// 2FA Reset
authRouter.post('/2fa/reset', (req, res, next) => {
  if (req.isAuthenticated()) return next()
  res.status(401).json({ message: 'User not authorized' })
}, authController.reset2FA)

export default authRouter
