const test = require('tape')
const execa = require('execa')
const readFile = require('fs').readFile
const Color = require('./color')

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
    })({
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
    })({
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
