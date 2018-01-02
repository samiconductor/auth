const moment = require('moment')
const errors = require('../errors')
const uuid = require('uuid/v4')

module.exports = class Session {

  constructor(db) {
    this.db = db
  }

  from(row) {
    return {
      id: row.id,
      userId: row.user_id,
      startTime: moment.unix(row.start_timestamp),
      endTime: row.end_timestamp ? moment.unix(row.end_timestamp) : moment.invalid()
    }
  }

  async get(id) {
    const query = 'select id, user_id, start_timestamp, end_timestamp from sessions where id = ?'
    const params = [id]
    const session = await this.db.get(query, ...params)

    if (!session) {
      throw new errors.NoResultsError(query, params, `No session found with Id ${id}`)
    }

    return this.from(session)
  }

  async valid(id) {
    const session = await this.get(id)

    if (session.endTime.isValid()) {
      throw new errors.InvalidSessionError(`Session Id ${id} is no longer valid`)
    }

    return session
  }

  async createForUser(userId) {
    const id = uuid()
    const query = 'insert into sessions (id, user_id) values (?, ?)'

    await this.db.run(query, id, userId)

    return this.get(id)
  }

  async end(id, {expire = false, terminate = false} = {}) {
    const query = `update sessions
      set end_timestamp = strftime('%s', 'now'),
      expired = ?, terminated = ?
      where id = ?`

    await this.db.run(query, expire, terminate, id)

    return this.get(id)
  }

}
