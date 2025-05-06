import mysql from 'mysql2/promise'

const defaultConfig = {
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: '', // use the password assigned for you
  database: 'movies'
}

const connection = await mysql.createConnection(defaultConfig)

export class MovieModel {
  static async getAll ({ genre }) {
    if (genre) {
      const lowerCaseGenre = genre.toLowerCase()
      // get genre ids from database table using genre names
      const [genres] = await connection.query(
        'SELECT id, name FROM genre WHERE LOWER(name) = ?', [lowerCaseGenre]
      )

      // no genre found
      if (genres.length === 0) return []

      // get the id from the first genre result
      const [{ id }] = genres

      // get all movies ids from database table
      const [moviesByGenre] = await connection.query(
        'SELECT BIN_TO_UUID(m.id) AS id, m.title, m.year, m.director, m.duration, m.poster, m.rate FROM movie AS m INNER JOIN movie_genres AS mg ON m.id = mg.movie_id WHERE mg.genre_id = ?;',
        [id]
      )
      return moviesByGenre
    }

    const [movies] = await connection.query(
      'SELECT BIN_TO_UUID(id) AS id, title, year, director, duration, poster, rate FROM movie;'
    )
    return movies
  }

  static async getById ({ id }) {
    const [movies] = await connection.query(
      `SELECT BIN_TO_UUID(id) AS id, title, year, director, duration, poster, rate
        FROM movie WHERE id = UUID_TO_BIN(?);`,
      [id]
    )

    if (movies.length === 0) return null

    return movies[0]
  }

  static async create ({ input }) {
    const {
      genre: genreInput, // genre is an array
      title,
      year,
      duration,
      director,
      rate,
      poster
    } = input

    // todo: crear la conexión de genre

    // crypto.randomUUID()
    const [uuidResult] = await connection.query('SELECT UUID() uuid;')
    const [{ uuid }] = uuidResult

    // pasamos uuid de esta manera ya que nosotros mismos somos los que lo generamos y no el usuario
    try {
      await connection.query(
        `INSERT INTO movie (id, title, year, director, duration, poster, rate)
          VALUES (UUID_TO_BIN("${uuid}"), ?, ?, ?, ?, ?, ?);`,
        [title, year, director, duration, poster, rate]
      )
    } catch (e) {
      // puede enviarle información sensible
      throw new Error('Error creating movie')
      // enviar la traza a un servicio interno
      // sendLog(e)
    }

    const [movies] = await connection.query(
      `SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id
        FROM movie WHERE id = UUID_TO_BIN(?);`,
      [uuid]
    )

    return movies[0]
  }

  static async update ({ id, input }) {
    return 0
  }

  static async delete ({ id }) {
    try {
      await connection.query(
        'DELETE FROM movie WHERE id = UUID_TO_BIN(?);', [id]
      )
    } catch (e) {
      throw new Error('Error deleting movie')
    }

    return { message: 'Movie Deleted' }
  }
}
