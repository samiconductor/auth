const Boom = require('boom')

module.exports = {
  method: 'POST',
  path: '/logout',
  async handler(request, h) {
    if (request.auth.isAuthenticated) {
      await request.app.repos.session.end(request.auth.credentials.sessionId)
    }

    h.unstate('token')

    return h.continue
  },
  options: {
    auth: {
      mode: 'try'
    }
  }
}
