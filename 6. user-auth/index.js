import express from 'express'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'

import { PORT, SECRETE_JWT_KEY } from './config.js'
import { UserRepository } from './user-repository.js'

const app = express()
// para tramitar el cuerpo del form en formato json
app.set('view engine', 'ejs') // decimos que sistema de plantilla utilizamos

app.use(express.json())
app.use(cookieParser()) // Nos permite modificar las cookies

// Middleware para verificar cookies
// Permite olvidarnos de validar por cada ruta unicamente al acceder a la session creada
app.use((req, res, next) => {
  const token = req.cookies.access_token
  req.session = { user: null }

  try {
    const data = jwt.verify(token, SECRETE_JWT_KEY)
    req.session.user = data
  } catch { }
  next() // -> seguir a la siguiente rut o middleware
})

app.get('/', (req, res) => {
  const { user } = req.session
  res.render('index', user)
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body

  try {
    const user = await UserRepository.login({ username, password })
    const token = jwt.sign(
      { id: user._id, username: user.username },
      SECRETE_JWT_KEY,
      {
        expiresIn: '1h'
      })
    // Guardarlo en la cookie
    res
      .cookie('access_token', token, {
        httpOnly: true, // La cookie solo se puede acceder en el servidor
        secure: process.env.NODE_ENV === 'production', // La cookie solo se puede acceder con https
        sameSite: 'strict', // La cookie solo se puede acceder desde el mismo sitio
        maxAge: 1000 * 60 * 60 // La cookie solo tiene un tiempo de validez de una hora
      })
      .send({ user, token })
  } catch (e) {
    // Evitar mandar los errores message por el response...
    res.status(401).send({ error: e.message })
  }
})

app.post('/register', async (req, res) => {
  const { username, password } = req.body

  try {
    const id = await UserRepository.create({ username, password })
    res.send({ id })
  } catch (e) {
    // Evitar mandar los errores message por el response...
    res.status(400).send({ error: e.message })
  }
})
app.post('/logout', (req, res) => {
  res
    .clearCookie('access_token')
    .json({ message: 'Logout successful' })
})

app.get('/protected', (req, res) => {
  // If sesion del usuario
  // Con middleware
  const { user } = req.session
  if (!user) return res.status(403).send('Access not authorized')
  res.render('protected', user)

  /* Sin middleware (manual)
  const token = req.cookies.access_token
  if (!token) return res.status(403).send('Access not authorized')

  try {
    const data = jwt.verify(token, SECRETE_JWT_KEY)
    res.render('protected', data) // { _id, username }
  } catch (e) {
    res.status(401).send('Access not authorized')
  } */
})

app.listen(PORT, () => {
  console.log('Corriendo servidor en el puerto', PORT)
})
