module.exports = class NotFoundError extends Error {
  constructor(query, params, ...args) {
    super(...args);

    Error.captureStackTrace(this, NotFoundError);

    this.query = query;
    this.params = params;
  }
};
