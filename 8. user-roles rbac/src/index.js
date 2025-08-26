import e from 'express'
import dotenv from 'dotenv'

import dbConnect from './config/dbConnect.js'
import authRoutes from './routes/authRoutes.js'
import userRouter from './routes/userRoutes.js'

const APP = e()
dotenv.config()
dbConnect()

// Middlewares
APP.use(e.json())

// Routes
APP.use('/api/auth', authRoutes)
APP.use('/api/users', userRouter)

// Start
const PORT = process.env.PORT ?? 8001

APP.listen(PORT, () => {
  console.log(`Listening at port ${PORT}`)
})
