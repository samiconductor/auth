const bcrypt = require("bcrypt");
const errors = require("../lib/errors");

module.exports = class Users {
  constructor(db) {
    this.db = db;
  }

  async all() {
    const query = "select id, username from users";

    return await this.db.all(query);
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

    return user;
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

  async add(username, password) {
    const query = `insert into
      users (username, password)
      values (?, ?)`;
    const rounds = 10 + Math.floor(Math.random() * 5);
    const passwordHash = await bcrypt.hash(password, rounds);
    const params = [username, passwordHash];

    return this.db.run(query, ...params);
  }
};
