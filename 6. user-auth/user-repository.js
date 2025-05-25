import crypto from 'node:crypto'

import DBLocal from 'db-local'
import bcrypt from 'bcrypt'
import { SALT_ROUNDS } from './config.js'

const { Schema } = new DBLocal({ path: './db' })

/* const Session = Schema('User', {
  _id: { type: String, required: true },
  user: { type: String, required: true },
  expires: { type: Date, required: true }
}) */

const User = Schema('User', {
  _id: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true }
})

// Se puede hacer: // inyeccion de dependencias // Que no sea estatico // Que tenga constructor ...
export class UserRepository {
  static async create ({ username, password }) {
    // 1. Validaciones (preferiblemente usar Zod)
    Validation.username(username)
    Validation.password(password)

    // 2. Asegurarse que el username no existe
    const user = User.findOne({ username })
    if (user) throw new Error('username already exists')

    const id = crypto.randomUUID()

    // 3. hash password
    // const hashedPassword = bcrypt.hashSync(password, SALT_ROUNDS) // hashSync -> bloquea el thread principal
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

    User.create({
      _id: id,
      username,
      password: hashedPassword
    }).save()

    return id
  }

  static async login ({ username, password }) {
    Validation.username(username)
    Validation.password(password)

    const user = User.findOne({ username })
    if (!user) throw new Error('username does not exist')

    const isValid = await bcrypt.compare(password, user.password)

    if (!isValid) throw new Error('password is invalid')
    // const { password: _, ...publicUser } = user // esto daria problemas si se agregan mas campos y se te pueden colar datos sensibles

    return {
      username: user.username
    }
  }
}

class Validation {
  static username (username) {
    if (typeof username !== 'string') throw new Error('username must be a string')
    if (username.length < 3) throw new Error('username must be at least 3 characters long')
  }

  static password (password) {
    if (typeof password !== 'string') throw new Error('username must be a string')
    if (password.length < 6) throw new Error('username must be at least 6 characters long')
  }
}
