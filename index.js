#!/usr/bin/env node
'use strict'

const command = require('sergeant')
const Pnglib = require('pnglib')
const path = require('path')
const hexRGB = require('hex-rgb')
const thenify = require('thenify')
const mkdirp = thenify(require('mkdirp'))
const fsWriteFile = thenify(require('fs').writeFile)

command('favicon', function ({option, parameter}) {
  parameter('color', {
    description: 'a color like #aaa or #ffffff',
    type: Color,
    required: true
  })

  parameter('directory', {
    description: 'where to put it',
    default: process.cwd()
  })

  option('padding', {
    description: 'the padding',
    type: Number,
    default: 3
  })

  option('size', {
    description: 'the size',
    type: Number,
    default: 16
  })

  return function (args) {
    var img = new Pnglib(args.size, args.size, 256)

    args.color.push(255)

    img.color(0, 0, 0, 0)

    for (let x = args.padding; x < args.size - args.padding; x++) {
      for (let y = args.padding; y < args.size - args.padding; y++) {
        img.buffer[img.index(x, y)] = img.color.apply(img, args.color)
      }
    }

    return mkdirp(args.directory).then(function () {
      return fsWriteFile(path.join(args.directory, 'favicon.png'), Buffer.from(img.getBase64(), 'base64'))
    })
  }
})(process.argv.slice(2))

function Color (color) {
  return hexRGB(color)
}
