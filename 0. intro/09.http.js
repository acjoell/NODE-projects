const http = require('node:http')
const { findPort } = require('./10.free-port')

const server = http.createServer((req, res) => {
  console.log('Servidor esta corriendo')
  res.end('Hola mundo')
})

// tambien se puede utilizar el puerto 0
// el cual encuentra el primer puerto vacio que encuentre

server.listen(0, () => {
  console.log(`Servidor escuchando en el puerto ${server.address().port}`)
  console.log(`http://localhost:${server.address().port}`)
  console.log('-------------------------------------')
  console.log('Presiona Ctrl + C para detener el servidor')
  console.log('-------------------------------------')
})

// utilizando nuestra funcion para encontrar si un puerto esta disponible o no
/*
findPort(3000)
  .then(port => {
    server.listen(port, () => {
      console.log(`Servidor escuchando en el puerto ${port}`)
      console.log(`http://localhost:${port}`)
      console.log('-------------------------------------')
      console.log('Presiona Ctrl + C para detener el servidor')
      console.log('-------------------------------------')
    })
  })
  .catch(err => {
    console.error('Error al encontrar el puerto:', err)
  })
*/
