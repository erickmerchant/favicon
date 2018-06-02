const Pnglib = require('pnglib')
const Color = require('./color')
const path = require('path')
const assert = require('assert')

function numberFactory (_default) {
  return function number (val) {
    if (val == null) return _default

    return Number(val)
  }
}

function color (val) {
  return val != null ? Color(val) : null
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
      type: function directory (val) {
        if (val == null) return '.'

        return val
      }
    })

    option('padding', {
      description: 'the padding',
      type: numberFactory(3)
    })

    option('size', {
      description: 'the size',
      type: numberFactory(16)
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
