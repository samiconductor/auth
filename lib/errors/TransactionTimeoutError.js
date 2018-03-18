module.exports = class TransactionTimeoutError extends Error {

  constructor(...args) {
    super(...args)

    Error.captureStackTrace(this, TransactionTimeoutError)
  }

}
