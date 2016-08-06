#!/usr/bin/env node
'use strict'

const command = require('sergeant/command')()
const chalk = require('chalk')
const Pnglib = require('pnglib')
const path = require('path')
const assert = require('assert')
const hexRGB = require('hex-rgb')
const thenify = require('thenify')
const mkdirp = thenify(require('mkdirp'))
const fsWriteFile = thenify(require('fs').writeFile)

command.describe('Make a single color square favicon')
.parameter('color', 'a color like #aaa or #ffffff')
.parameter('padding', 'the padding (default: 3)')
.parameter('size', 'the size (default: 16)')
.parameter('directory', 'where to put it (optional)')
.action(function (args) {
  assert.notEqual(args.has('color'), false, 'color is required')

  var color = args.get('color')
  var padding = args.has('padding') ? args.get('padding') : 3
  var size = args.has('size') ? args.get('size') : 16
  var length = color.length

  if (color.startsWith('#')) {
    length -= 1
  }

  assert.ok(length < 7 && length > 2, 'color should be like #aaa or #ffffff')

  color = hexRGB(color)

  var img
  var directory = args.has('directory') ? args.get('directory') : process.cwd()

  img = new Pnglib(size, size, 256)

  color.push(255)

  img.color(0, 0, 0, 0)

  for (let x = padding; x < size - padding; x++) {
    for (let y = padding; y < size - padding; y++) {
      img.buffer[img.index(x, y)] = img.color.apply(img, color)
    }
  }

  return mkdirp(directory).then(function () {
    return fsWriteFile(path.join(directory, 'favicon.png'), new Buffer(img.getBase64(), 'base64'))
  })
})

command.run().catch(function (err) {
  console.error(chalk.red(err.message))
})
