const Boom = require('boom')
const privs = require('../privileges')

module.exports = {
  method: 'GET',
  path: '/users',
  config: {
    auth: {
      access: [{
        scope: [privs.admin]
      }]
    },
    handler: async (request, reply) => {
      try {
        const users = await request.app.repos.user.all()

        reply(users)
      } catch (error) {
        reply(Boom.boomify(error))
      }
    }
  }
}
