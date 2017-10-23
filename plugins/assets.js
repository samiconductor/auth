const Hoek = require('hoek')
const path = require('path')
const name = path.basename(__filename, path.extname(__filename))
const {version} = require('../package.json')
const Webpack = require('webpack')
const WebpackPlugin = require('hapi-webpack-plugin')
const config = require('../webpack.config.hot')

exports.register = (server, options, next) => {
  if (process.env.NODE_ENV === 'development') {
    const compiler = new Webpack(config)
    const assets = {
      noInfo: true,
      publicPath: config.output.publicPath
    }
    const hot = {
      log: msg => server.log(['webpack'], msg)
    }

    server.register({
      register: WebpackPlugin,
      options: {compiler, assets, hot}
    }, err => Hoek.assert(!err, err))
  } else {
    server.route({
      method: 'GET',
      path: `${config.output.publicPath}{path*}`,
      handler: {
        directory: {
          path: path.basename(config.output.path)
        }
      }
    })
  }

  server.route({
    method: 'GET',
    path: '/assets/{path*}',
    config: {
      auth: false,
      handler: {
        directory: {
          path: 'views/assets'
        }
      }
    }
  })

  next()
}

exports.register.attributes = {name, version}
