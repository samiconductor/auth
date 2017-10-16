module.exports = {
  assign: 'user',
  method: (request, reply) => {
    if (request.auth.isAuthenticated) {
      return request.app.repos.user.get(request.app.userId).then(reply)
    }

    reply()
  }
}
