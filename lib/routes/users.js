const privs = require('../privileges')

module.exports = {
  method: 'GET',
  path: '/users',
  options: {
    auth: {
      access: [{
        scope: [privs.admin]
      }]
    }
  },
  async handler(request) {
    return await request.app.repos.user.all()
  }
}
