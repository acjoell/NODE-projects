import express, { urlencoded, json } from 'express'
import session from 'express-session'
import passport from 'passport'
import dotenv from 'dotenv'
import cors from 'cors'

import dbConnect from './config/dbConnect.js'
import authRouter from './routes/authRoutes.js'
import './config/passportConfig.js' // This is for apply the passport settings for login

dotenv.config()
dbConnect() // conexcion DB

const app = express()

// Middleware
const corsOptions = {
  origin: ['http://localhost:8000'],
  credentials: true // nos envia las cookies que hacen parte de las credenciales
}
app.use(cors(corsOptions))
app.use(json({ limit: '100mb' }))
app.use(urlencoded({ limit: '100mb', extended: true }))
app.use(session({
  secret: process.env.SESSION_SECRET ?? 'SECRET_ONE',
  /*
  Por defecto, `express-session` intenta guardar la sesión en cada solicitud, incluso si no ha cambiado nada.
  `resave: false`  desactiva este comportamiento, lo que significa que la sesión solo se guarda si ha cambiado
  desde la última vez que se guardó.  Esto reduce el tráfico de red y el uso de recursos del servidor.
  */
  resave: false,
  /*
  Por defecto,  `express-session` guarda la sesión en el servidor incluso si el usuario no ha enviado aún ningún dato al servidor.
  `saveUninitialized: false` desactiva este comportamiento, lo que significa que la sesión solo se guarda si ha sido
  inicializada (es decir, el usuario ha enviado algunos datos).
  Esto reduce el uso de recursos del servidor.
  */
  saveUninitialized: false,
  cookie: {
    maxAge: 60000 * 60 // la sesion expira cada hora
  }
}))
app.use(passport.initialize())
app.use(passport.session())

// Routes
app.use('/api/auth/', authRouter)

// Listen APP
const PORT = process.env.PORT ?? 8001
app.listen(PORT, () => {
  console.log(`Server running in http://localhost:${PORT}`)
})
