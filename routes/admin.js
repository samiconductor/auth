const privs = require('../lib/privileges')

module.exports = {
  method: 'GET',
  path: '/admin',
  config: {
    pre: [
      require('./pre/get-auth-user')
    ],
    auth: {
      access: [{
        scope: privs.admin
      }]
    },
    handler: (request, reply) => {
      reply.view('home', {
        user: request.pre.user
      })
    }
  }
}
