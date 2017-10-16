const errors = require('../errors')

module.exports = class Session {

  constructor(pg) {
    this.pg = pg
    this.uuid = require('uuid/v4')
  }

  async get(id) {
    const query = 'select * from sessions where id = $1'
    const values = [id]
    const result = await this.pg.query(query, values)

    if (!result.rowCount) {
      throw new errors.NoResultsError(query, values, `No session found with Id ${id}`)
    }

    return result.rows[0];
  }

  async isValid(id) {
    const session = await this.get(id)

    return !session.end_timestamp
  }

  async valid(id) {
    const valid = await this.isValid(id)

    if (!valid) {
      throw new errors.InvalidSessionError(`Session Id ${id} is no longer valid`)
    }
  }

  async createForUser(userId) {
    const id = this.uuid()
    const query = 'insert into sessions (id, user_id) values ($1, $2)'

    await this.pg.query(query, [id, userId])

    return this.get(id)
  }

}
