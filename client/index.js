function log (msg) {
  document.body.appendChild(document.createElement('br'))
  document.body.appendChild(document.createTextNode(msg))
}

log('Page Loaded')

const socket = new WebSocket('ws://localhost:3131')

socket.addEventListener('open', e => {
  log('Connection Opened')
  join().then(hash => {
    socket.send(`join:${hash}`)

    setTimeout(() => {
      socket.send('move:north')
    })
  })
  socket.send('Hello Server!')
})

socket.addEventListener('message', e => {
  log(`got a message: ${e.data}`)
})

async function join () {
  const game = await fetch('/games', { method: 'POST' }).then(res => res.json())
  log(JSON.stringify(game))
  const player = await fetch(`/games/${game.id}/join`, { method: 'POST' }).then(
    res => res.json()
  )
  log(JSON.stringify(player))

  const [botId] = Object.keys(player.bots)
  const { hash } = player.bots[botId]
  return hash
}
