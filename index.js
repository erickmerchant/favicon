const Pnglib = require('pnglib')
const Color = require('./color')
const path = require('path')
const assert = require('assert')

function number (val) {
  return Number(val)
}

function color (val) {
  return Color(val)
}

module.exports = function (deps) {
  assert.equal(typeof deps.makeDir, 'function')

  assert.equal(typeof deps.writeFile, 'function')

  return function ({option, parameter}) {
    parameter('color', {
      description: 'a color like #aaa or #ffffff',
      type: color,
      required: true
    })

    parameter('directory', {
      description: 'where to put it',
      default: '.'
    })

    option('padding', {
      description: 'the padding',
      type: number,
      default: 3
    })

    option('size', {
      description: 'the size',
      type: number,
      default: 16
    })

    return function (args) {
      const img = new Pnglib(args.size, args.size, 256)

      img.color(0, 0, 0, 0)

      for (let x = args.padding; x < args.size - args.padding; x++) {
        for (let y = args.padding; y < args.size - args.padding; y++) {
          img.buffer[img.index(x, y)] = img.color.apply(img, args.color)
        }
      }

      return deps.makeDir(args.directory).then(function () {
        return deps.writeFile(path.join(args.directory, 'favicon.png'), Buffer.from(img.getBase64(), 'base64'))
      })
    }
  }
}
