import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isMfaActive: {
    type: Boolean,
    required: false
  },
  twoFactorSecret: {
    type: String,
    required: false
  }
}, { timestamps: true })

const UserModel = mongoose.model('User', userSchema)

export default UserModel
