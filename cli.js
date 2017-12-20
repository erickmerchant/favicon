#!/usr/bin/env node
'use strict'

const command = require('sergeant')
const favicon = require('./index')
const thenify = require('thenify')
const mkdirp = thenify(require('mkdirp'))
const writeFile = thenify(require('fs').writeFile)

command('favicon', favicon({makeDir: mkdirp, writeFile}))(process.argv.slice(2))
