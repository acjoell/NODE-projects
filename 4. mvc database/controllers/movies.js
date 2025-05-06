// import { MovieModel } from '../models/mongodb/movie.js'
// import { MovieModel } from '../models/mysql/movie.js'
// import { MovieModel } from '../models/local-file-system/movie.js'
import { validateMovie, validatePartialMovie } from '../schemas/movies.schema.js'

// Quitamos los metodos estaticos, ya que se podian utilizar sin crear una instancia de la clase
export class MovieController {
  constructor ({ movieModel }) {
    this.movieModel = movieModel
  }

  // Utilizamos this con las arrow functions
  getAll = async (req, res) => {
    const { genre } = req.query
    const movies = await this.movieModel.getAll({ genre })
    return res.status(200).json(movies)
  }

  getById = async (req, res) => {
    const { id } = req.params
    const movie = await this.movieModel.getById({ id })

    if (movie) {
      return res.status(200).json(movie)
    } else {
      return res.status(404).json({ message: 'Movie not found' })
    }
  }

  create = async (req, res) => {
    const result = validateMovie(req.body)

    if (!result.success) {
      return res.status(400).json({ message: JSON.parse(result.error.message) })
    }

    // pasamos datos ya validados
    const newMovie = await this.movieModel.create({ input: result.data })
    return res.status(201).json(newMovie)
  }

  update = async (req, res) => {
    const result = validatePartialMovie(req.body)

    if (!result.success) {
      return res.status(400).json({ message: JSON.parse(result.error.message) })
    }

    const { id } = req.params
    const updatedMovie = await this.movieModel.update({ id, input: result.data })

    if (updatedMovie === false) {
      return res.status(404).json({ message: 'Movie not found' })
    } else {
      return res.json(updatedMovie)
    }
  }

  delete = async (req, res) => {
    const { id } = req.params
    const result = await this.movieModel.delete({ id })

    if (result === false) {
      return res.status(404).json({ message: 'Movie not found' })
    } else {
      return res.json({ message: 'Movie deleted' })
    }
  }
}
// Ahora el controlador no conoce el modelo con el que estamos trabajando
