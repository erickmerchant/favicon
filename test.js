const test = require('tape')
const execa = require('execa')
const readFile = require('fs').readFile
const Color = require('./color')

test('index.js - defaults', (t) => {
  t.plan(4)

  readFile('./fixtures/defaults/favicon.png', (err, fixture) => {
    t.error(err)

    require('./index')({
      async makeDir (path) {
        t.equal(path, './foo')

        return true
      },
      async writeFile (path, buffer) {
        t.equal(path, 'foo/favicon.png')

        t.ok(buffer.equals(fixture))

        return true
      }
    })({
      directory: './foo',
      size: 16,
      padding: 3,
      color: Color('FF8000')
    })
  })
})

test('index.js - size and padding', (t) => {
  t.plan(4)

  readFile('./fixtures/size-and-padding/favicon.png', (err, fixture) => {
    t.error(err)

    require('./index')({
      async makeDir (path) {
        t.equal(path, './foo')

        return true
      },
      async writeFile (path, buffer) {
        t.equal(path, 'foo/favicon.png')

        t.ok(buffer.equals(fixture))

        return true
      }
    })({
      directory: './foo',
      size: 32,
      padding: 0,
      color: Color('FF8000')
    })
  })
})

test('cli.js', async (t) => {
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

test('color.js', async (t) => {
  t.plan(2)

  t.deepEqual(Color('FF8000'), [ 255, 128, 0, 255 ])

  t.deepEqual(Color('#FF8000'), [ 255, 128, 0, 255 ])
})
