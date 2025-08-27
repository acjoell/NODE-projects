import jwt from 'jsonwebtoken'
import { jwtSecret } from '../config/env.js'

const user = {
  id: 3,
  name: 'Carlos',
  role: 'manager',
  department: 'IT',
  accessLevel: 2
}

const token = jwt.sign(user, jwtSecret, { expiresIn: '1h' })
console.log(`JWT token for ${user.role}: ${token}`)
