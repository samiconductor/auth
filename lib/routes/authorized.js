const privs = require('../privileges')

module.exports = {
  method: 'GET',
  path: '/authorized',
  config: {
    auth: {
      access: [{
        scope: [privs.super, '{query.scope}']
      }]
    },
    handler: (request, reply) => {
      reply()
    }
  }
}
