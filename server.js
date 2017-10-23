const Hapi = require('hapi')
const Hoek = require('hoek')
const path = require('path')
const routes = require('require-all')({
  dirname: path.join(__dirname, 'routes'),
  recursive: false
})

const server = new Hapi.Server({
  debug: {
    log: ['error', 'start', 'webpack'],
    request: ['error', 'db']
  }
})

server.connection({port: 3000})

server.register([
  require('vision'),
  require('inert'),
  require('./plugins/assets'),
  require('./plugins/request-repos'),
  require('hapi-auth-jwt2')
], err => {
  Hoek.assert(!err, err)

  server.views({
    engines: {
      pug: require('pug')
    },
    relativeTo: __dirname,
    path: 'views',
    compileOptions: {
      pretty: true
    },
    isCached: process.env.NODE_ENV !== 'development'
  })

  server.auth.strategy('jwt', 'jwt', true, {
    key: process.env.JWT_SECRET,
    validateFunc: require('./lib/validate-jwt'),
    verifyOptions: {
      algorithms: ['HS256']
    }
  })

  server.state('token', {
    isSecure: process.env.NODE_ENV !== 'development'
  })

  server.route(Object.values(routes))
})

server.start(err => {
  Hoek.assert(!err, err)

  server.log(['start'], `Server running at: ${server.info.uri}`)
})
