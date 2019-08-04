const path = require("path");
const requireAll = require("require-all");

module.exports = Object.values(
  requireAll({
    dirname: path.resolve(__dirname, "../routes"),
    recursive: true
  })
);
