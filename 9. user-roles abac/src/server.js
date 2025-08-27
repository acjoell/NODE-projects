import e from 'express'

import { PORT } from './config/env.js'
import projectRoutes from './routes/projectRoutes.js'
import errorHandler from './middlewares/errorHandler.js'

const APP = e()
APP.use(e.json())

// Routes
APP.use('/api/projects/', projectRoutes)

// Error handling
APP.use(errorHandler)

// App Listen
APP.listen(PORT, () => {
  console.log(`Listening at ${PORT} port`)
})
