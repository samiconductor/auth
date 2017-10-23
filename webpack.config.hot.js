const Webpack = require('webpack')
const config = require('./webpack.config')

const entry = Object.entries(config.entry).reduce((entries, [name, entry]) => {
  return Object.assign(entries, {
    [name]: [entry, 'webpack-hot-middleware/client']
  })
}, {})

Object.assign(config.output, {
  publicPath: '/assets/scripts/'
})

config.module.loaders.filter(
  loader => loader.use.includes('elm-webpack-loader')
).forEach(
  loader => loader.use.unshift('elm-hot-loader')
)

const plugins = (config.plugins || []).concat([
  new Webpack.optimize.OccurrenceOrderPlugin(),
  new Webpack.HotModuleReplacementPlugin(),
  new Webpack.NoEmitOnErrorsPlugin()
])

module.exports = Object.assign(config, {entry, plugins})
