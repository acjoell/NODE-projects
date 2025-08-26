import e from 'express'
import verifyToken from '../middlewares/authMiddleware.js'
import authorizeRoles from '../middlewares/roleMiddleware.js'

const router = e.Router()

// aplica verifyToken a todas las rutas de este router en vez de pasarlo uno por uno
router.use(verifyToken)

// Only ADMIN can access to this routes
router.get('/admin', authorizeRoles('admin'), (req, res) => {
  res.json({
    message: 'Welcome Admin'
  })
})

// Both ADMIN & MANAGER can access to this routes
router.get('/manager', authorizeRoles('admin', 'manager'), (req, res) => {
  res.json({
    message: 'Welcome Manager'
  })
})

// All of them can access to this routes
router.get('/user', authorizeRoles('admin', 'manager', 'user'), (req, res) => {
  res.json({
    message: 'Welcome User'
  })
})

export default router
