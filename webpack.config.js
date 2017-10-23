const path = require('path')
const glob = require('glob')
const entry = glob.sync('elm/**/index.js', {
  cwd: __dirname
}).reduce((entries, elmPath) => {
  const name = path.basename(path.dirname(elmPath))
  const filename = path.basename(elmPath)

  return Object.assign(entries, {
    [name]: `./${name}/${filename}`
  })
}, {})

module.exports = {
  context: path.join(__dirname, 'elm'),

  entry,

  output: {
    path: path.join(__dirname, 'elm-dist'),
    filename: '[name].js'
  },

  module: {
    loaders: [
      {
        test: /\.elm$/,
        exclude: [/elm-stuff/, /node_modules/],
        use: ['elm-webpack-loader']
      }
    ],

    noParse: /\.elm$/
  }
}
