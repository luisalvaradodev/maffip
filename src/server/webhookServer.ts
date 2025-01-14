import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import MessageController from '../lib/messageController'

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
})

app.use(express.json())

app.post('/webhook', (req, res) => {
  const payload = req.body
  console.log('Webhook received:', payload)

  // Emit the received message to connected clients
  io.emit('messages.upsert', payload)

  res.status(200).send('OK')
})

io.on('connection', (socket) => {
  console.log('A client connected')

  socket.on('disconnect', () => {
    console.log('A client disconnected')
  })
})

const PORT = 4000
server.listen(PORT, () => {
  console.log(`Webhook server running on http://localhost:${PORT}`)
})

