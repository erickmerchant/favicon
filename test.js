const test = require('tape')
const execa = require('execa')
const readFile = require('fs').readFile
const Color = require('./color')

const noopDeps = {
  makeDir () { return Promise.resolve(true) },
  writeFile () { return Promise.resolve(true) }
}
const noopDefiners = {
  parameter () {},
  option () {}
}

test('index.js - options and parameters', function (t) {
  t.plan(14)

  const parameters = {}
  const options = {}

  require('./index')(noopDeps)({
    parameter (name, args) {
      parameters[name] = args
    },
    option (name, args) {
      options[name] = args
    }
  })

  t.ok(parameters.color)

  t.equal(parameters.color.required, true)

  t.equal(parameters.color.type.name, 'color')

  t.ok(parameters.directory)

  t.equal(typeof parameters.directory.type, 'function')

  t.equal(parameters.directory.type(), '.')

  t.ok(options.size)

  t.equal(typeof options.size.type, 'function')

  t.equal(options.size.type.name, 'number')

  t.equal(options.size.type(), 16)

  t.ok(options.padding)

  t.equal(typeof options.padding.type, 'function')

  t.equal(options.padding.type.name, 'number')

  t.equal(options.padding.type(), 3)
})

test('index.js - defaults', function (t) {
  t.plan(4)

  readFile('./fixtures/defaults/favicon.png', function (err, fixture) {
    t.error(err)

    require('./index')({
      makeDir (path) {
        t.equal(path, './foo')

        return Promise.resolve(true)
      },
      writeFile (path, buffer) {
        t.equal(path, 'foo/favicon.png')

        t.ok(buffer.equals(fixture))

        return Promise.resolve(true)
      }
    })(noopDefiners)({
      directory: './foo',
      size: 16,
      padding: 3,
      color: Color('FF8000')
    })
  })
})

test('index.js - size and padding', function (t) {
  t.plan(4)

  readFile('./fixtures/size-and-padding/favicon.png', function (err, fixture) {
    t.error(err)

    require('./index')({
      makeDir (path) {
        t.equal(path, './foo')

        return Promise.resolve(true)
      },
      writeFile (path, buffer) {
        t.equal(path, 'foo/favicon.png')

        t.ok(buffer.equals(fixture))

        return Promise.resolve(true)
      }
    })(noopDefiners)({
      directory: './foo',
      size: 32,
      padding: 0,
      color: Color('FF8000')
    })
  })
})

test('cli.js', async function (t) {
  t.plan(4)

  try {
    await execa('node', ['./cli.js', '-h'])
  } catch (e) {
    t.ok(e)

    t.equal(e.stderr.includes('Usage'), true)

    t.equal(e.stderr.includes('Options'), true)

    t.equal(e.stderr.includes('Parameters'), true)
  }
})

test('color.js', async function (t) {
  t.plan(2)

  t.deepEqual(Color('FF8000'), [ 255, 128, 0, 255 ])

  t.deepEqual(Color('#FF8000'), [ 255, 128, 0, 255 ])
})
