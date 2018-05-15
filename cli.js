#!/usr/bin/env node
'use strict'

const favicon = require('./index')
const command = require('sergeant')
const makeDir = require('make-dir')
const promisify = require('util').promisify
const writeFile = promisify(require('fs').writeFile)

command('favicon', favicon({makeDir, writeFile}))(process.argv.slice(2))
