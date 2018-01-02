module.exports = require('require-all')({
  dirname: __dirname,
  filter: /(.+Error)\.js$/
})

exports.intanceOf = (error, ...types) => {
  return types.some(ErrorType => error instanceof ErrorType)
}
