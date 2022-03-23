const http = require('http')
const express = require('express')
const { WebSocketServer } = require('ws')

const engine = require('./engine')
const game = require('./game')
const map = require('./map')

const app = express()
const server = http.createServer(app)
const wss = new WebSocketServer({ noServer: true, clientTracking: false })

const { PORT = 3131 } = process.env

app.use(express.static('client'))

app.get('/games', (req, res) => {
  res.json(game.list())
})

app.get('/games/:id', (req, res) => {
  res.json(game.fetch(req.params.id))
})

/*
GET http://localhost:3131/games
Accept: application/json
*/

app.post('/games', (req, res) => {
  const g = game.create()
  map.render(g.map)
  res.json(g)
})

/*
POST http://localhost:3131/games
Content-Type: application/json
Accept: application/json
*/

app.post('/games/:id/join', (req, res) => {
  const g = game.fetch(req.params.id)
  if (!g) return res.sendStatus(404)
  const p = game.join(g)
  res.json(p)
})

server.on('upgrade', function (request, socket, head) {
  wss.handleUpgrade(request, socket, head, ws => {
    wss.emit('connection', ws, request)
  })
})

server.listen(PORT, () => console.log(`server listening on ${PORT}`))

const robots = {}

// join:HASH
// move:north
// move:south
// mine
// research

wss.on('connection', function connection (ws) {
  let bot
  ws.on('message', function message (data) {
    data = data.toString()
    if (!bot) {
      if (data.startsWith('join:')) {
        const hash = data.replace('join:', '')
        try {
          bot = engine.join(hash)
        } catch {
          ws.send('error:failed to join swarm')
        }
        return
      }
      ws.send('error:must join the swarm first')
    } else {
      if (data.startsWith('move:')) {
        const direction = data.replace('move:', '')
        bot.instruction = { type: 'move', direction }
        return
      }
      ws.send('error:unknown message')
    }
  })
})
