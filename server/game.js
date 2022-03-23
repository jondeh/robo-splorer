const { nanoid } = require('nanoid')

const map = require('./map')
const Haikunator = require('haikunator')

const haikunator = new Haikunator()

const games = {}

exports.create = function () {
  const game = {
    id: nanoid(),
    players: {},
    map: map.generate()
  }
  games[game.id] = game
  return game
}

exports.list = function () {
  return Object.keys(games).map(id => ({
    id,
    playerCount: Object.keys(games[id].players).length
  }))
}

exports.fetch = function (id) {
  return games[id]
}

exports.join = function (game) {
  const { x, y } = getRandomCoordinates(game)
  const player = {
    id: nanoid(),
    name: haikunator.haikunate(),
    x,
    y,
    bots: {}
  }
  const bot = newBot(x, y)
  bot.hash = Buffer.from(`${game.id}:${player.id}:${bot.id}`).toString('base64')
  player.bots[bot.id] = bot
  game.players[player.id] = player
  return player
}

function newBot (x, y, level = 1, acidboots = false) {
  return {
    id: nanoid(),
    x: 0,
    y: 0,
    level: 1,
    acidBoots: false,
    inventory: []
  }
}

function getRandomCoordinates (game) {
  const x = Math.floor(Math.random() * game.map[0].length)
  const y = Math.floor(Math.random() * game.map.length)
  // TODO:: make sure we don't collide with other players
  if (game.map[y][x] === 0) return { x, y }
  return getRandomCoordinates(game)
}
