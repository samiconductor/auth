const bcrypt = require('bcrypt')
const errors = require('../errors')

module.exports = class User {

  constructor(db) {
    this.db = db
  }

  async get(id) {
    const query = 'select id, username from users where id = ?'
    const params = [id]
    const user = await this.db.get(query, ...params)

    if (!user) {
      throw new errors.NoResultsError(query, params, `No user found with Id ${id}`)
    }

    const scopes = await this.scopes(id)

    return Object.assign(user, {scopes})
  }

  async scopes(userId) {
    const query = `select scope_id as id, name, description from user_scopes us
      join scopes s on s.id = us.scope_id
      where us.user_id = ?`

    return this.db.all(query, userId)
  }

  async withUsername(username) {
    const query = 'select id, username from users where username = ?'
    const params = [username]
    const user = await this.db.get(query, ...params)

    if (!user) {
      throw new errors.NoResultsError(query, params, `No user found with username ${username}`)
    }

    return user
  }

  async withCredentials(username, password) {
    const user = await this.withUsername(username)
    const query = 'select password from users where id = ?'
    const row = await this.db.get(query, user.id)
    const validPassword = await bcrypt.compare(password, row.password)

    if (!validPassword) {
      throw new errors.InvalidCredentialsError('Username and password are invalid')
    }

    return user
  }

}
