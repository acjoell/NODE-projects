const express = require('express')
const cors = require('cors')
const crypto = require('node:crypto')
const movies = require('./movies.json')
const { validateMovie, validatePartialMovie } = require('./schemas/movies.schema.js')

// Configuracion inicial
const PORT = process.env.PORT ?? 3000
const app = express()
// Desactivar cabecera
app.disable('x-powered-by')
// Detectamos si hay que hacer una transformacion para los JSON y acceder al req.body directamente
app.use(express.json())
app.use(cors({
  origin: (origin, callback) => {
    const ACCEPTED_ORIGINS = [
      'http://localhost:8080',
      'http://localhost:8081',
      'http://localhost:3000',
      'http://localhost:1234'
    ]
    if (ACCEPTED_ORIGINS.includes(origin)) {
      return callback(null, true)
    }

    if (!origin) {
      return callback(null, true)
    }
  }
}))

// PARA CORS tenemos
// métodos normales: GET/HEAD/POST
// métodos complejos: PUT/PATCH/DELETE

// en los metodos complejos tenemos los CORS PRE-Flight
// requerimos una peticion especial llamada OPTIONS

// Rutas
app.get('/', (req, res) => {
  res
    .status(200)
    .send('Página principal')
})

app.get('/movies', (req, res) => {
  const { genre } = req.query

  if (genre) {
    const filteredMovies = movies.filter(
      // movie => movie.genre.includes(genre)
      movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
    )
    return res.json(filteredMovies)
  }

  res
    .status(200)
    .json(movies)
})

// Segmentacion dinamica
app.get('/movies/:id', (req, res) => {
  const { id } = req.params
  const movie = movies.find(movie => movie.id === id)
  if (movie) {
    res
      .status(200)
      .json(movie)
  } else {
    res
      .status(404)
      .json({ message: 'Movie not found' })
  }
})

app.post('/movies', (req, res) => {
  const result = validateMovie(req.body)

  /* Ya no nos preocupamos del body
  const {
    title,
    genre,
    year,
    director,
    duration,
    rate,
    poster
  } = req.body
  */

  if (result.error) {
    return res
      .status(400)
      .json({ message: JSON.parse(result.error.message) })
  }

  /* Ya no es necesario pasar todos estos datos
  const newMovie = {
    id: crypto.randomUUID(), // uuid v4
    title,
    genre,
    year,
    director,
    duration,
    rate: rate ?? 0,
    poster: poster ?? ''
  } */

  const newMovie = {
    id: crypto.randomUUID(), // uuid v4
    ...result.data // aqui tendremos todos los datos ya validados
    // no es lo mismo result.data a req.body ya que ya hemos validado todo
  }

  // Esto no seria REST, porque gurdamos el estado
  // de la aplicación en memoria
  movies.push(newMovie)

  res
    .status(201)
    .json(newMovie)
})

app.patch('/movies/:id', (req, res) => {
  const result = validatePartialMovie(req.body)
  if (!result.success) {
    return res.status(400).json({ message: JSON.parse(result.error.message) })
  }

  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)
  if (movieIndex < 0) {
    return res.status(404).json({ message: 'Movie not found' })
  }

  const updateMovie = {
    ...movies[movieIndex],
    ...result.data
  }

  movies[movieIndex] = updateMovie

  return res
    .status(201)
    .json(updateMovie)
})

app.delete('/movies/:id', (req, res) => {
  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' })
  }

  movies.splice(movieIndex, 1)

  return res.json({ message: 'Movie deleted' })
})

// Escuchando puerto
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`)
  console.log(`http://localhost:${PORT}`)
  console.log('-------------------------------------')
})

// REST Representational State Transfer
// REST es una Arquitectura de Software
/* Sus principios son:
  - Escalabilidad
  - Simplicidad
  - Visibilidad
  - Portabilidad
  - Fiabilidad
  - Facid de modificar
  Sus fundaentos:
  - Recursos: Todo es considerado un recurso (listas, entidades, colecciones)
    - Cada recurso se identifica con una URL
  - metodos: Verbos HTTP (GET; PUT, PATCH, DELETE, ...)
    - Se utilizan para definir las opreaciones que se puede realizar con los recursos
  - Representaciones: Pueden ser multiples representaciones (json, xml, html, ...)
    - El cliente decide la representacion del recurso
  - Stateless: Cada solicitud que se haga debe contener toda la info necesaria para entender la solicitud
    - El servidor no debe mantener ningun estado sobre el cliente entre solicitudes
    - es decir, no puede guardar info sino que debe ir en la url para que el servidor sepa que tiene que hacer, no tiene que tener un estado
    - El cliente debe enviar toda la info necesaria para procesar la request
  - Interfaz uniforme: Tiene que ser consistente y uniforme entre todas las interacciones
  - Separacion de conceptos: Los componenetes del cliente y el servidor estan separados entre si
    - Asi mismo el cliente y el servidor evolucionan de forma separada
  */
