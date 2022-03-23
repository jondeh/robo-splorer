const game = require('./game')

function forEach (obj, cb) {
  Object.keys(obj).forEach(id => {
    cb(obj[id])
  })
}

exports.join = hash => {
  console.log('time to join with', hash)
  const [gameId, playerId, botId] = Buffer.from(hash, 'base64')
    .toString()
    .split(':')
  console.log({ gameId, playerId, botId })
  const bot = game.fetch(gameId).players[playerId].bots[botId]
  if (!bot) throw new Error('Bot not found')
  // join the swarm
  // OR throw an error
  return bot
}

function tick () {
  game.list().forEach(({ id }) => {
    const g = game.fetch(id)
    forEach(g.players, p => {
      forEach(p.bots, b => {
        if (b.instruction) {
          console.log('GOT AN INSTRUCTION')
          console.log(b.instruction)
          // do the instruction
          // report the result
          b.instruction = null
        }
      })
    })
  })
  // run through all the games
  // run through all the bots
  // execute their instructions
  // emit status events
}

setInterval(tick, 5000)
