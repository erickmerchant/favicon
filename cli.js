#!/usr/bin/env node
'use strict'

const favicon = require('./index')
const { command, start } = require('sergeant')('favicon')
const makeDir = require('make-dir')
const createWriteStream = require('fs').createWriteStream
const streamPromise = require('stream-to-promise')

command({
  name: '',
  signature: ['color', 'directory'],
  options: {
    color: {
      description: 'a color like #aaa or #ffffff',
      parameter: true,
      required: true
    },
    directory: {
      description: 'where to put it',
      parameter: true,
      default: '.'
    },
    padding: {
      description: 'the padding',
      parameter: true,
      default: 3
    },
    size: {
      description: 'the size',
      parameter: true,
      default: 16
    }
  },
  action (args) {
    return favicon({
      makeDir,
      writeFile (path, content) {
        const stream = createWriteStream(path)

        stream.end(content)

        return streamPromise(stream)
      }
    })(args)
  }
})

start(process.argv.slice(2))
