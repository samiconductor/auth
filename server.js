const Hapi = require('hapi')
const monitoring = require('./lib/monitoring')
const cors = require('./lib/cors')
const validate = require('./lib/validate-jwt')
const routes = require('./lib/routes')

const server = new Hapi.Server({
  port: 3000,
  host: 'localhost',
  routes: {
    cors
  }
})

const init = async () => {
  await server.register([
    {
      plugin: require('good'),
      options: monitoring
    }, {
      plugin: require('./lib/plugins/repos'),
      options: {
        verbose: process.env.NODE_ENV === 'development'
      },
    },
    require('hapi-auth-jwt2')
  ])

  server.auth.strategy('jwt', 'jwt', {
    key: process.env.JWT_SECRET,
    validate,
    verifyOptions: {
      algorithms: ['HS256']
    }
  })

  server.auth.default('jwt')

  server.state('token', {
    isHttpOnly: process.env.NODE_ENV !== 'development',
    isSecure: process.env.NODE_ENV !== 'development'
  })

  server.route(Object.values(routes))

  await server.start()

  server.log(['start'], `Server running at: ${server.info.uri}`)
}

process.on('unhandledRejection', error => {
  /* eslint no-console: "off" */
  console.error(error)
  process.exit(1)
})

init()
