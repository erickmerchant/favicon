#!/usr/bin/env node
'use strict'

const favicon = require('./index')
const Color = require('./color')
const command = require('sergeant')
const makeDir = require('make-dir')
const promisify = require('util').promisify
const writeFile = promisify(require('fs').writeFile)

command('favicon', ({parameter, option}) => {
  parameter('color', {
    description: 'a color like #aaa or #ffffff',
    type (val) {
      return val != null ? Color(val) : null
    },
    required: true
  })

  parameter('directory', {
    description: 'where to put it',
    type (val = '.') {
      return val
    }
  })

  option('padding', {
    description: 'the padding',
    type (val = 3) {
      return Number(val)
    }
  })

  option('size', {
    description: 'the size',
    type (val = 16) {
      return Number(val)
    }
  })

  return (args) => favicon({makeDir, writeFile})(args)
})(process.argv.slice(2))
