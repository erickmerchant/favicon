const hexRGB = require('hex-rgb')

module.exports = function Color (color) {
  return hexRGB(color, { format: 'array' }).slice(0, 3)
}
