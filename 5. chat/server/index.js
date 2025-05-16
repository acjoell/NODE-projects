import express from 'express'
import logger from 'morgan'
import dotenv from 'dotenv'
import { createClient } from '@libsql/client'

import { Server } from 'socket.io'
import { createServer } from 'node:http'

dotenv.config() // inicializamos

const port = process.env.PORT ?? 3000

const app = express()
const server = createServer(app) // creamos el servidor http
const io = new Server(server, {
  connectionStateRecovery: {} // tiempo max de desconexion para guardar esos eventos
}) // creamos servidor de socket.io (bidireccional, in & out)

const db = createClient({
  url: process.env.DB_URL,
  authToken: process.env.DB_TOKEN
})

await db.execute(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT,
    user TEXT
  )
`)

//  Cuando tenga una conexion ejecuta callback
io.on('connection', async (socket) => {
  console.log('The user has connected')

  socket.on('disconnect', () => {
    console.log('The user has disconnected')
  })

  socket.on('chat message', async (msg) => {
    let result
    const username = socket.handshake.auth.username ?? 'anonymous'
    try {
      result = await db.execute({
        sql: 'INSERT INTO messages (content, user) VALUES (:content, :user)',
        args: { content: msg, user: username }
      })
    } catch (err) {
      console.error(err)
      return
    }
    io.emit('chat message', msg, result.lastInsertRowid.toString(), username)
  })

  if (!socket.recovered) { // recuperar los mensajes sin conexion
    try {
      const results = await db.execute({
        sql: 'SELECT id, content, user FROM messages WHERE id > ?',
        args: [socket.handshake.auth.serverOffset ?? 0]
      })

      results.rows.forEach(row => {
        socket.emit('chat message', row.content, row.id.toString(), row.user)
      })
    } catch (e) {
      console.error(e)
    }
  }
})

app.use(logger('dev'))

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/client/index.html') // current working directory
})

// vamos a escuchar el servidor, no la aplicacion
server.listen(port, () => {
  console.log('Server running')
})
