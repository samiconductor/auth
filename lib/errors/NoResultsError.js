module.exports = class NoResultsError extends Error {

  constructor(query, params, ...args) {
    super(...args)

    Error.captureStackTrace(this, NoResultsError)

    this.query = query
    this.params = params
  }

}
