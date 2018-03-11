const getAuthUser = require('./pre/get-auth-user')

module.exports = {
  method: 'GET',
  path: '/me',
  options: {
    pre: [
      getAuthUser
    ],
  },
  handler(request) {
    return request.pre.user
  }
}
