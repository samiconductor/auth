const errors = require('./errors')

module.exports = async (decoded, request, callback) => {
  try {
    request.app.session = await request.app.repos.session.valid(decoded.sessionId)

    callback(null, true)
  } catch(error) {
    if (errors.instanceOf(error,
      errors.NoResultsError,
      errors.InvalidSessionError
    )) {
      return callback(null, false)
    }

    callback(error)
  }
}
