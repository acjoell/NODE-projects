const http = require('node:http')
const fs = require('node:fs')

const desiredPort = process.env.PORT ?? 3000

const processRequest = (req, res) => {
  // Se pasa un solo setHeader para no repetirlo por cada ruta
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  if (req.url === '/') {
    res.end('Página de inicio')
  } else if (req.url === '/contacto') {
    res.end('Página de contacto')
  } else if (req.url === '/imagen') {
    fs.readFile('./picture.png', (err, data) => {
      if (err) {
        res.statusCode = 500
        res.end('500 internal server error')
      } else {
        res.setHeader('Content-Type', 'image/png')
        res.end(data)
      }
    })
  } else {
    res.statusCode = 404
    res.end('Página no encontrada')
  }
}

const server = http.createServer(processRequest)

server.listen(desiredPort, () => {
  console.log(`Servidor escuchando en el puerto ${desiredPort}`)
  console.log(`http://localhost:${desiredPort}`)
  console.log('-------------------------------------')
  console.log('Presiona Ctrl + C para detener el servidor')
  console.log('-------------------------------------')
})
