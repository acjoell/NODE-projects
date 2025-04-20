const express = require('express')
const ditto = require('./pokemon/ditto.json')
const PORT = process.env.PORT ?? 3000

// Se desactiva la cabecera para no mencionar que utilizamos Express
const app = express()
app.disable('x-powered-by')

// middleware
// Puede afectar las peticiones a las que quieres afectar
app.use(express.json()) // ya express incorpora esta herramienta para no tener que hacer tanto codigo
/*
app.use((req, res, next) => {
  if (req.method !== 'POST') return next()
  if (req.headers['content-type'] !== 'application/json') return next()

  console.log('Middleware')

  // solo llegan request que son post y
  // tienen el header content-type en aplication/json
  let body = ''

  // escuchar el evento data
  req.on('data', chunk => {
    body += chunk.toString()
  })

  req.on('end', () => {
    const data = JSON.parse(body)
    data.timestamp = Date.now()
    // mutar la request y meter la info en el body
    req.body = data
    next()
  })
  // trackear la request a la BD
  // revisar cookies
})
*/

app.get('/', (req, res) => {
  res
    .status(200)
    .send('Página de inicio')
})

app.get('/pokemon', (req, res) => {
  res
    .status(200)
    .json(ditto)
})

app.post('/pokemon', (req, res) => {
  res.status(201).json(req.body)
})

// sirve como un app * (app.get, app,post, ,,,)
app.use((req, res) => {
  res.status(404).send('Página no encontrada')
})

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`)
  console.log(`http://localhost:${PORT}`)
  console.log('-------------------------------------')
})
