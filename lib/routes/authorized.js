const privs = require('../privileges')

module.exports = {
  method: 'GET',
  path: '/authorized',
  options: {
    auth: {
      access: [{
        scope: [privs.super, '{query.scope}']
      }]
    }
  },
  handler(request, h) {
    return h.continue
  }
}
