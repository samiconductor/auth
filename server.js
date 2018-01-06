const Hapi = require('hapi')
const Hoek = require('hoek')
const monitoring = require('./lib/monitoring')
const cors = require('./lib/cors')
const validateFunc = require('./lib/validate-jwt')
const routes = require('./lib/routes')

const server = new Hapi.Server()

server.connection({
  port: 3000,
  routes: {
    cors
  }
})

server.register([
  { register: require('good'), options: monitoring },
  require('inert'),
  require('./lib/plugins/repos'),
  require('hapi-auth-jwt2')
], err => {
  Hoek.assert(!err, err)

  server.auth.strategy('jwt', 'jwt', true, {
    key: process.env.JWT_SECRET,
    validateFunc,
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
