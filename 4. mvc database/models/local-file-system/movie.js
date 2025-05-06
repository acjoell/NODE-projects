import { randomUUID } from 'node:crypto'
import movies from '../../movies.json' with { type: 'json' }

// Aqui tendriamos nuestra logica de negocio
// Sabemos como se filtran las cosas, como se ordenan, como se paginan

// Por que una clase? por contratos, ya que vamos a poder tipar los modelos para que sean intercambiables

export class MovieModel {
  static async getAll({ genre }) {
    if (genre) {
      return movies.filter(
        movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
      )
    }

    return movies
  }

  static async getById({ id }) {
    const movie = movies.find(movie => movie.id === id)
    if (movie) return movie
  }

  static async create({ input }) {
    const newMovie = {
      id: randomUUID(),
      ...input // aqui tendremos todos los datos ya validados
    }
    // Esto no seria REST, porque gurdamos el estado
    // de la aplicación en memoria
    movies.push(newMovie)

    return newMovie
  }

  static async update({ id , input }) {
    const movieIndex = movies.findIndex(movie => movie.id === id)
    if (movieIndex === -1) return false
  
    const updateMovie = {
      ...movies[movieIndex],
      ...input
    }
    
    movies[movieIndex] = updateMovie
    return movies[movieIndex]
  }

  static async delete({ id }) {
    const movieIndex = movies.findIndex(movie => movie.id === id)
    if (movieIndex === -1) return false
    movies.splice(movieIndex, 1)
    return true
  }
}

// se hacen los metodos asincronos para saber que el modelo va
