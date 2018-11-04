const errors = require("../errors");

module.exports = class Roles {
  constructor(db) {
    this.db = db;
  }

  async all() {
    const query = "select id, name, description from roles";

    return this.db.all(query);
  }

  async get(role) {
    const query = `select
      id, name, description
      from roles
      where lower(name) = lower(?);`;
    const params = [role];

    if (!role) {
      throw errors.NotFoundError(
        query,
        params,
        `No role found with name ${role}`
      );
    }

    return this.db.get(query, ...params);
  }

  async user(id) {
    const query = `select
      r.id, r.name, r.description
      from users u
      join roles r on r.id = u.role_id
      where u.id = ?`;

    return this.db.get(query, id);
  }

  async set(userId, roleName) {
    const role = await this.get(roleName);
    const query = `update users
      set role_id = ?
      where user_id = ?`;

    return this.db.run(query, role.id, userId);
  }
};
