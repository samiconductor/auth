const path = require("path");

const basename = name => path.basename(name, ".js");

module.exports = require("require-all")({
  dirname: __dirname,
  recursive: false,
  filter(fileName) {
    const name = basename(fileName);

    return name !== basename(__filename) ? name : false;
  }
});
