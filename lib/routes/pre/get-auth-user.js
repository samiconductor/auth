module.exports = {
  assign: 'user',
  method: async (request, reply) => {
    if (request.auth.isAuthenticated) {
      try {
        const {userId, sessionId, privs} = request.auth.credentials
        const user = await request.app.repos.user.get(userId)
        const scopes = await request.app.repos.user.scopes(userId)
        const session = await request.app.repos.session.get(sessionId)

        return reply({...user, scopes, session, privs})
      } catch(error) {
        return reply(error)
      }
    }

    reply()
  }
}
