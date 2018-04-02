module.exports = class InvalidTransactionError extends Error {
  constructor(...args) {
    super(...args);

    Error.captureStackTrace(this, InvalidTransactionError);
  }
};
