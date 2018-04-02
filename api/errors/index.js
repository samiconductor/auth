const errors = require("require-all")({
  dirname: __dirname,
  filter: /(.+Error)\.js$/
});

module.exports = {
  instanceOf(error, ...types) {
    return types.some(ErrorType => error instanceof ErrorType);
  },
  ...errors
};
