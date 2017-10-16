const path = require('path')
const errors = require('require-all')({
  dirname: __dirname,
  filter: /(.+Error)\.js$/
})

Object.assign(module.exports, errors)

exports.instanceOf = (error, ...types) => {
  return types.some(ErrorType => error instanceof ErrorType)
}
