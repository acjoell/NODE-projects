import { projects } from '../data/projectData.js'
import { authorize } from '../middlewares/authorize.js'
import { canViewProject, canUpdateProject } from '../policies/projectPolicy.js'

// Standarized response function
const handleResponse = (res, status, message, project = null) => {
  res.status(status).json({ status, message, project })
}

// Find project
const getProjectById = (id, res) => {
  const project = projects.find((project) => project.id === id)
  if (!project) handleResponse(res, 404, 'Project not found')
  return project
}

export const viewProject = (req, res) => {
  console.log('Authenticated')
  const projectId = parseInt(req.params.id)
  const project = getProjectById(projectId, res)
  console.log('Project is: ', project)
  authorize(canViewProject, project)(req, res, () => {
    handleResponse(res, 200, 'Project retrieved successfully', project)
  })
}

export const updateProject = (req, res) => {
  const { name } = req.body
  console.log('Authenticated')
  const projectId = parseInt(req.params.id)
  const project = getProjectById(projectId, res)
  console.log('Project is: ', project)
  authorize(canUpdateProject, project)((req, res), () => {
    const projectId = projects.findIndex((obj) => obj.id === projectId)
    projects[projectId].name = name
    handleResponse(res, 200, 'Project updated successfully', project)
  })
}
