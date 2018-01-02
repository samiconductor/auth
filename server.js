const Hapi = require('hapi')
const Hoek = require('hoek')
const routes = require('./lib/routes')

const server = new Hapi.Server({
  debug: {
    log: ['error', 'start'],
    request: ['error', 'db']
  }
})

server.connection({port: 3000})

server.register([
  require('inert'),
  require('./lib/plugins/repos'),
  require('hapi-auth-jwt2')
], err => {
  Hoek.assert(!err, err)

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
