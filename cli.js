#!/usr/bin/env node
'use strict'

const command = require('sergeant')
const hexRGB = require('hex-rgb')
const favicon = require('./index')

command('favicon', function ({option, parameter}) {
  parameter('color', {
    description: 'a color like #aaa or #ffffff',
    type: Color,
    required: true
  })

  parameter('directory', {
    description: 'where to put it',
    default: { value: '.' }
  })

  option('padding', {
    description: 'the padding',
    type: Number,
    default: { value: 3 }
  })

  option('size', {
    description: 'the size',
    type: Number,
    default: { value: 16 }
  })

  return favicon
})(process.argv.slice(2))

function Color (color) {
  return hexRGB(color)
}
