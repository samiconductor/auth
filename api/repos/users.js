const bcrypt = require("bcrypt");
const errors = require("../errors");
const transaction = require("../transaction");
const Roles = require("./roles");

module.exports = class Users {
  constructor(db) {
    this.db = db;
    this.roles = new Roles(db);
  }

  async all() {
    const query = "select id, username from users";
    const users = await this.db.all(query);

    return Promise.all(
      users.map(async user => {
        return {
          ...user,
          role: await this.roles.user(user.id)
        };
      })
    );
  }

  async get(id) {
    const query = "select id, username from users where id = ?";
    const params = [id];
    const user = await this.db.get(query, ...params);

    if (!user) {
      throw new errors.NotFoundError(
        query,
        params,
        `No user found with Id ${id}`
      );
    }

    const role = await this.roles.user(user.id);

    return { ...user, role };
  }

  async withUsername(username) {
    const query = "select id, username from users where username = ?";
    const params = [username];
    const user = await this.db.get(query, ...params);

    if (!user) {
      throw new errors.NotFoundError(
        query,
        params,
        `No user found with username ${username}`
      );
    }

    return user;
  }

  async withCredentials(username, password) {
    const user = await this.withUsername(username);
    const query = "select password from users where id = ?";
    const row = await this.db.get(query, user.id);
    const validPassword = await bcrypt.compare(password, row.password);

    if (!validPassword) {
      throw new errors.InvalidCredentialsError(
        "Username and password are invalid"
      );
    }

    return user;
  }

  async add(username, password, roleName) {
    const role = await this.roles.get(roleName);
    const query = `insert into
      users (username, password, role_id)
      values (?, ?, ?)`;
    const rounds = 10 + Math.floor(Math.random() * 5);
    const passwordHash = await bcrypt.hash(password, rounds);
    const params = [username, passwordHash, role.id];

    return this.db.run(query, ...params);
  }

  async admins() {
    const query = `select
      u.id, u.username
      from users u
      join roles r on r.id = u.role_id
      where lower(r.name) = 'admin'`;

    return this.db.all(query);
  }
};
