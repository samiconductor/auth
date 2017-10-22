const privs = require('./privileges')
const errors = require('./errors')

module.exports = async (decoded, request, callback) => {
  try {
    const session = await request.app.repos.session.valid(decoded.sessionId)
    const scopes = await request.app.repos.user.scopeCredentials(session.userId)
    const credentials = Object.freeze({
      userId: session.userId,
      sessionId: session.id,
      scope: Object.freeze(scopes),
      privs: Object.freeze({
        admin: scopes.some(scope => scope === privs.admin),
        super: scopes.some(scope => scope === privs.super)
      })
    })

    callback(null, true, credentials)
  } catch(error) {
    if (errors.instanceOf(error,
      errors.NoResultsError,
      errors.InvalidSessionError
    )) {
      return callback(null, false)
    }

    request.log(['error'], error)

    callback(error)
  }
}
