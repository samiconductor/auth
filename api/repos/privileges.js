const transaction = require("../transaction");

module.exports = class Privileges {
  constructor(db) {
    this.db = db;
  }

  async all() {
    const query = "select name from privs";

    return this.db.all(query);
  }

  async user(id) {
    const query = `select p.id, p.name, p.description
      from user_privs up
      join privs p on p.id = up.priv_id
      where up.user_id = ?`;

    return this.db.all(query, id);
  }

  async add(userId, { admin = false, sites = false } = {}) {
    const query = `replace into user_privs (user_id, priv_id)
      select ?, id from privs p where lower(p.name) = ?`;
    const privs = [];

    if (admin) privs.push("admin");
    if (sites) privs.push("sites");

    if (privs.length) {
      return await transaction(this.db, "add_privs", async () => {
        return await Promise.all(
          privs.map(async priv => {
            const { lastID } = await this.db.run(query, userId, priv);
            return lastID;
          })
        );
      });
    }
  }
};
