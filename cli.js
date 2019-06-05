#!/usr/bin/env node
'use strict'

const favicon = require('./index')
const Color = require('./color')
const { command, start } = require('sergeant')('favicon')
const makeDir = require('make-dir')
const createWriteStream = require('fs').createWriteStream
const streamPromise = require('stream-to-promise')

command(({ parameter, option }) => {
  parameter({
    name: 'color',
    description: 'a color like #aaa or #ffffff',
    type (val) {
      return val != null ? Color(val) : null
    },
    required: true
  })

  parameter({
    name: 'directory',
    description: 'where to put it',
    type (val = '.') {
      return val
    }
  })

  option({
    name: 'padding',
    description: 'the padding',
    type (val = 3) {
      return Number(val)
    }
  })

  option({
    name: 'size',
    description: 'the size',
    type (val = 16) {
      return Number(val)
    }
  })

  return (args) => favicon({
    makeDir,
    writeFile (path, content) {
      const stream = createWriteStream(path)

      stream.end(content)

      return streamPromise(stream)
    }
  })(args)
})

start(process.argv.slice(2))
