const moment = require("moment");
const errors = require("../errors");
const uuid = require("uuid/v4");

module.exports = class Sessions {
  constructor(db) {
    this.db = db;
  }

  async get(id) {
    const query = "select * from sessions where id = ?";
    const params = [id];
    const session = await this.db.get(query, ...params);

    if (!session) {
      throw new errors.NotFoundError(
        query,
        params,
        `No session found with Id ${id}`
      );
    }

    return this._mapRow(session);
  }

  async valid(id) {
    const session = await this.get(id);

    if (session.endTime.isValid()) {
      throw new errors.InvalidSessionError(
        `Session Id ${id} is no longer valid`
      );
    }

    return session;
  }

  async user(userId, { active = false }) {
    const activeQuery = active ? "and end_timestamp is null" : "";
    const query = `select *
      from sessions
      where user_id = ? ${activeQuery}
      order by start_timestamp desc`;
    const sessions = await this.db.all(query, [userId]);

    return sessions.map(session => this._mapRow(session));
  }

  async create(userId) {
    const id = uuid();
    const query = "insert into sessions (id, user_id) values (?, ?)";

    await this.db.run(query, id, userId);

    return this.get(id);
  }

  async end(id, { expire = false, terminate = false } = {}) {
    const query = `update sessions
      set end_timestamp = strftime('%s', 'now'),
      expired = ?, terminated = ?
      where id = ?`;

    await this.db.run(query, expire, terminate, id);

    return this.get(id);
  }

  _mapRow({ id, user_id: userId, start_timestamp, end_timestamp }) {
    return {
      id,
      userId,
      startTime: moment.unix(start_timestamp),
      endTime: end_timestamp ? moment.unix(end_timestamp) : moment.invalid()
    };
  }
};
