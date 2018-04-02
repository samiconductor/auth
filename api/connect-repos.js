const path = require("path");
const sqlite = require("sqlite");
const requireAll = require("require-all");

module.exports = async ({ dbPath = process.env.DB, verbose = false } = {}) => {
  const db = await sqlite.open(dbPath, { verbose });
  const repos = requireAll({
    dirname: path.resolve(__dirname, "./repos"),
    resolve: Repo => new Repo(db)
  });

  return { db, repos };
};
