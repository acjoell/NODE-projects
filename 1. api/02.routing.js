const http = require('node:http')
const ditto = require('./pokemon/ditto.json')

const desiredPort = process.env.PORT ?? 3000

const processRequest = (req, res) => {
  const { method, url } = req
  res.setHeader('ContentType', 'text/html; charset=utf-8')

  switch (method) {
    case 'GET':
      switch (url) {
        case '/':
          return res.end('Página de inicio')
        case '/about':
          return res.end('Página de información')
        case '/pokemon/ditto':
          res.setHeader('ContentType', 'application/json; charset=utf-8')
          return res.end(JSON.stringify(ditto))
        default:
          res.statudCode = 404
          return res.end('Página no encontrada')
      }
    case 'POST':
      switch (url) {
        case '/pokemon': {
          let body = ''

          // escuchar el evento data
          req.on('data', chunk => {
            body += chunk.toString()
          })

          req.on('end', () => {
            const data = JSON.parse(body)
            // llamar a una base de datos para guardar la info
            res.writeHead(201, { 'Content-Type': 'application/json; charset=utf-8' })
            data.timestamp = Date.now()
            res.end(JSON.stringify(data))
          })

          break
        }

        default:
          res.statudCode = 404
          return res.end('Página no encontrada')
      }
      break
  }
}

const server = http.createServer(processRequest)

server.listen(desiredPort, () => {
  console.log('Escuchando')
})
