import { Router } from 'express'

import { MovieController } from '../controllers/movies.js'

/*
Otra manera de importar un json seria con require creandolo de la sig manera:
import {createRequire} from 'node:module'
const require = createRequire(import.meta.url)
const movies = require('./movies.json)
*/

export const moviesRouter = Router()

moviesRouter.get('/', MovieController.getAll)
// Segmentacion dinamica
moviesRouter.get('/:id', MovieController.getById)
moviesRouter.post('/', MovieController.create)
moviesRouter.patch('/:id', MovieController.update)
moviesRouter.delete('/:id', MovieController.delete)
