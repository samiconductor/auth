const bcrypt = require("bcrypt");
const errors = require("../errors");
const transaction = require("../transaction");
const Privileges = require("./privileges");

module.exports = class Users {
  constructor(db) {
    this.db = db;
    this.privileges = new Privileges(db);
  }

  async all() {
    const query = "select id, username from users";
    const users = await this.db.all(query);

    return Promise.all(
      users.map(async user => {
        return {
          ...user,
          privileges: await this.privileges.user(user.id)
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

    const privileges = await this.privileges.user(user.id);

    return { ...user, privileges };
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

  async add(username, password, { admin = false, sites = false } = {}) {
    const query = "insert into users (username, password) values (?, ?)";
    const rounds = 10 + Math.floor(Math.random() * 5);
    const passwordHash = await bcrypt.hash(password, rounds);
    const params = [username, passwordHash];

    return await transaction(this.db, "add_user", async () => {
      const { lastID } = await this.db.run(query, ...params);
      const privs = await this.privileges.add(lastID, { admin, sites });

      return { user: lastID, privs };
    });
  }

  async admins() {
    const query = `select u.id, u.username
      from users u
      join user_privs up on up.user_id = u.id
      join privs p on p.id = up.priv_id
      where lower(p.name) = 'admin'`;

    return this.db.all(query);
  }
};
