const Pnglib = require('pnglib')
const path = require('path')
const assert = require('assert')
const Color = require('./color')

module.exports = (deps) => {
  assert.strictEqual(typeof deps.makeDir, 'function')

  assert.strictEqual(typeof deps.writeFile, 'function')

  return async (args) => {
    args.color = Color(args.color)
    args.size = Number(args.size)
    args.padding = Number(args.padding)

    const img = new Pnglib(args.size, args.size, 256)

    img.color(0, 0, 0, 0)

    for (let x = args.padding; x < args.size - args.padding; x++) {
      for (let y = args.padding; y < args.size - args.padding; y++) {
        img.buffer[img.index(x, y)] = img.color.apply(img, args.color)
      }
    }

    await deps.makeDir(args.directory)

    return deps.writeFile(path.join(args.directory, 'favicon.png'), Buffer.from(img.getBase64(), 'base64'))
  }
}
