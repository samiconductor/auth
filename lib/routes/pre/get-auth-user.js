module.exports = {
  assign: 'user',
  method: async (request, h) => {
    if (request.auth.isAuthenticated) {
      const {userId, sessionId, privs} = request.auth.credentials
      const user = await request.app.repos.user.get(userId)
      const scopes = await request.app.repos.user.scopes(userId)
      const session = await request.app.repos.session.get(sessionId)

      return {...user, scopes, session, privs}
    }

    return h.continue
  }
}
