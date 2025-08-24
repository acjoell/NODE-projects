import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import bcrypt from 'bcryptjs'

import UserModel from '../models/userModel.js'

passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const user = await UserModel.findOne({ username })
    if (!user) return done(null, false, { message: 'User not found' })

    const isMatch = await bcrypt.compare(password, user.password)
    if (isMatch) return done(null, user)
    else return done(null, false, { message: 'Incorrect Password' })
  } catch (e) {
    return done(e.message)
  }
}))

passport.serializeUser((user, done) => {
  console.log(`We are inside serializeUser. ${user._id}`)
  done(null, user._id)
})

passport.deserializeUser(async (_id, done) => {
  try {
    console.log(`We are inside deserializeUser. ${_id}`)
    const user = await UserModel.findById(_id)
    done(null, user)
  } catch (e) {
    done(e.message)
  }
})
