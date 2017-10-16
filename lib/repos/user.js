const bcrypt = require('bcrypt')
const errors = require('../errors')

module.exports = class User {

  constructor(pg) {
    this.pg = pg
  }

  async get(id) {
    const query = 'select id, username from users where id = $1'
    const values = [id]
    const result = await this.pg.query(query, values)

    if (!result.rowCount) {
      throw new errors.NoResultsError(query, values, `No user found with Id ${id}`)
    }

    const user = result.rows[0]
    const scopes = await this.scopes(id)

    return Object.assign(user, {scopes})
  }

  async scopes(userId) {
    const query = `select scope_id as id, name, description from user_scopes us
      join scopes s on s.id = us.scope_id
      where us.user_id = $1`
    const values = [userId]
    const result = await this.pg.query(query, values)

    return result.rows
  }

  async withUsername(username) {
    const query = 'select id, username from users where username = $1'
    const values = [username]
    const result = await this.pg.query(query, values)

    if (!result.rowCount) {
      throw new errors.NoResultsError(query, values, `No user found with username ${username}`)
    }

    return result.rows[0]
  }

  async validCredentials(username, password) {
    const user = await this.withUsername(username)
    const validPassword = await bcrypt.compare(password, user.password)

    if (!validPassword) {
      throw new errors.InvalidCredentialsError('Username and password are invalid')
    }

    return user
  }
}
