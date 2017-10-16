module.exports = class InvalidCredentialsError extends Error {

  constructor(...args) {
    super(...args)

    Error.captureStackTrace(this, InvalidCredentialsError)
  }

}
