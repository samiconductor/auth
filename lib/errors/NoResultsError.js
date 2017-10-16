module.exports = class NoResultsError extends Error {

  constructor(query, values, ...args) {
    super(...args)

    Error.captureStackTrace(this, NoResultsError)

    this.query = query
    this.values = values
  }

}
