const Pnglib = require('pnglib')
const path = require('path')
const thenify = require('thenify')
const mkdirp = thenify(require('mkdirp'))
const writeFile = thenify(require('fs').writeFile)

module.exports = function (args) {
  const img = new Pnglib(args.size, args.size, 256)

  args.color.push(255)

  img.color(0, 0, 0, 0)

  for (let x = args.padding; x < args.size - args.padding; x++) {
    for (let y = args.padding; y < args.size - args.padding; y++) {
      img.buffer[img.index(x, y)] = img.color.apply(img, args.color)
    }
  }

  return mkdirp(args.directory).then(function () {
    return writeFile(path.join(args.directory, 'favicon.png'), Buffer.from(img.getBase64(), 'base64'))
  })
}
