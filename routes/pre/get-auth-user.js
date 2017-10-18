module.exports = {
  assign: 'user',
  method: async (request, reply) => {
    if (request.auth.isAuthenticated) {
      try {
        const user = await request.app.repos.user.get(request.app.session.userId)

        return reply(user)
      } catch(error) {
        return reply(error)
      }
    }

    reply()
  }
}
