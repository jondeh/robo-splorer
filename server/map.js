// 0 = grass
// 1 = iron
// 2 = copper
// 3 = water
// 4 = acid

exports.generate = function (w = 40, h = 20) {
  let map = []
  for (let i = 0; i < h; ++i) {
    let row = []
    for (let j = 0; j < w; ++j) {
      const num = Math.random()
      if (num < 0.05) row.push(1)
      else if (num < 0.1) row.push(2)
      else if (num < 0.2) row.push(3)
      else if (num < 0.25) row.push(4)
      else row.push(0)
    }
    map.push(row)
  }
  return map
}

exports.render = function (map) {
  for (let i = 0; i < map.length; ++i) {
    let str = ''
    for (j = 0; j < map[i].length; ++j) {
      str += fancy(' ', mapping[map[i][j]])
    }
    console.log(str)
  }
}

// Colors Code

const codes = {
  bgBlack: [40, 49],
  bgRed: [41, 49],
  bgGreen: [42, 49],
  bgYellow: [43, 49],
  bgBlue: [44, 49],
  bgMagenta: [45, 49],
  bgCyan: [46, 49],
  bgWhite: [47, 49],
  bgGray: [100, 49],
  bgGrey: [100, 49]
}
const styles = {}
const mapping = ['bgGreen', 'bgWhite', 'bgYellow', 'bgBlue', 'bgMagenta']

Object.keys(codes).forEach(function (key) {
  const [a, b] = codes[key]
  styles[key] = {
    open: '\u001b[' + a + 'm',
    close: '\u001b[' + b + 'm'
  }
})

function fancy (str, style) {
  const { open, close } = styles[style]
  return `${open}${str}${close}`
}
