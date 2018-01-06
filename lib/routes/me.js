const getAuthUser = require('./pre/get-auth-user')

module.exports = {
  method: 'GET',
  path: '/me',
  config: {
    pre: [
      getAuthUser
    ],
    handler: (request, reply) => {
      reply(request.pre.user)
    }
  }
}
