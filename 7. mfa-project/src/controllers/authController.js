import bcrypt from 'bcryptjs'
import UserModel from '../models/userModel.js'
// import speakeasy from 'speakeasy'
import otplib from 'otplib'
import qrCode from 'qrcode'
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
  try {
    const { username, password } = req.body

    // Validate required fields
    if (!username || !password) {
      return res.status(400).json({
        error: 'Mising required fields',
        message: 'Username and password are required'
      })
    }

    const hashPW = await bcrypt.hash(password, 10)
    const newUser = new UserModel({
      username,
      password: hashPW,
      isMfaActive: false
    })
    console.log(`newUser: ${newUser.username}`)
    await newUser.save()
    res.status(201).json({ message: 'User registered successfully', user: username })
  } catch (e) {
    res.status(500).json({ error: 'Error at register user.', message: e.message })
  }
}

export const logIn = async (req, res) => {
  console.log(`The authenticated user is: ${req.user}`)
  res.status(200).json({
    message: 'User logged in successfully',
    username: req.user.username,
    isMfaActive: req.user.isMfaActive
  })
}

export const authStatus = async (req, res) => {
  if (req.user) {
    res.status(200).json({
      message: 'User is authorized.',
      username: req.user.username,
      isMfaActive: req.user.isMfaActive
    })
  } else {
    res.status(401).json({ message: 'Unauthorized user.' })
  }
}

export const logOut = async (req, res) => {
  if (!req.user) res.status(401).json({ message: 'Unauthorized user.' })
  req.logOut((error) => {
    if (error) res.status(400).json({ message: 'User not logged in.' })
    res.status(200).json({ message: 'User Logged out successfully.' })
  })
}

export const setup2FA = async (req, res) => {
  try {
    const user = req.user

    // not mantained
    // const secret = speakeasy.generateSecret()
    // console.log('1 Secret object is: ', secret) // 'H5FDEJDJKFZSI6L5K5YHQQ2JH44USUDCNMVHS33WOJZFMRCDFJLA'

    const secret = otplib.authenticator.generateSecret() // J4MR4VIANA5CUZT5
    const otpauth = otplib.authenticator.keyuri(user.username, 'MFA-Project', secret) // otpauth://totp/MFA-Project:testUser?secret=MFTVUFS6IJCH2SYG&period=30&digits=6&algorithm=SHA1&issuer=MFA-Project
    const imageUrl = await qrCode.toDataURL(otpauth) // 👈 promesa

    // para mejores practicas encriptar el secreto
    user.twoFactorSecret = secret
    user.isMfaActive = true
    await user.save()

    res.status(200).json({ qrCode: imageUrl, secret })
  } catch (e) {
    res.status(401).json({ message: 'Unauthorized user.' })
  }
}

export const verify2FA = async (req, res) => {
  try {
    const { token } = req.body
    const user = req.user

    const isValid = otplib.authenticator.verify({
      token,
      secret: user.twoFactorSecret
    })

    if (isValid) {
      const jwtToken = jwt.sign(
        { username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '1hr' }
      )
      res.status(200).json({ message: '2FA Successful', token: jwtToken })
    } else {
      res.status(400).json({ message: 'Invalid 2FA Token' })
    }
  } catch (e) {
    // Possible errors
    // - options validation
    // - "Invalid input - it is not base32 encoded string" (if thiry-two is used)
    res.status(500).json({ error: 'Error Validating Token', message: e })
  }
}

export const reset2FA = async (req, res) => {
  try {
    const user = req.user
    user.twoFactorSecret = ''
    user.isMfaActive = false
    await user.save()

    res.status(200).json({ message: 'Reset 2FA Successful' })
  } catch (e) {
    res.status(501).json({ error: 'Error Reseting 2FA.', message: e })
  }
}
