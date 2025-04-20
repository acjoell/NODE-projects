const net = require('node:net')

// Encontrams puerto libre
function findPort (desiredPort) {
  return new Promise((resolve, reject) => {
    const server = net.createServer()

    server.listen(desiredPort, () => {
      const { port } = server.address()
      server.close(() => {
        resolve(port)
      })
    })

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        findPort(0)
          .then(port => resolve(port))
      } else {
        reject(err)
      }
    })
  })
}

module.exports = {
  findPort
}
