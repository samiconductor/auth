const errors = require('./errors')

module.exports = (decoded, request, callback) => {
  request.app.repos.session.valid(decoded.sid).then(session => {
    Object.assign(request.app, {
      sessionId: decoded.sid,
      userId: decoded.uid
    })

    callback(null, true)
  }).catch(error => {
    if (errors.instanceOf(error,
      errors.NoResultsError,
      errors.InvalidSessionError
    )) {
      return callback(null, false)
    }

    callback(Boom.boomify(error))
  })
}
