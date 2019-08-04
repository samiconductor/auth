module.exports = class InvalidSessionError extends Error {
  constructor(...args) {
    super(...args);

    Error.captureStackTrace(this, InvalidSessionError);
  }
};
