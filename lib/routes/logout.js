const Boom = require('boom')

module.exports = {
  method: 'POST',
  path: '/logout',
  config: {
    auth: {
      mode: 'try'
    },
    handler: async (request, reply) => {
      try {
        if (request.auth.isAuthenticated) {
          await request.app.repos.session.end(request.auth.credentials.sessionId)
        }

        reply.redirect('/').unstate('token')
      } catch (error) {
        reply(Boom.boomify(error))
      }
    }
  }
}
