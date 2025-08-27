import e from 'express'

import { verifyToken } from '../middlewares/authentication.js'
import { updateProject, viewProject } from '../controllers/projectController.js'

const router = e.Router()

router.use(verifyToken)

// Route to view a project
router.get('/:id', viewProject)

// Route to update a project
router.patch('/:id', updateProject)

export default router
