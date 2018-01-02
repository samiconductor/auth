const bcrypt = require('bcrypt')
const slug = require('slug')
const privs = require('../privileges')
const errors = require('../errors')

slug.defaults.mode = 'rfc3986'

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

    return user
  }

  async all() {
    const query = 'select id, username from users'
    const users = await this.db.all(query)

    return await Promise.all(users.map(async user => {
      const scopes = await this.scopes(user.id)

      return {...user, scopes}
    }))
  }

  async scopes(id) {
    const query = `select scope_id as id, name, description, admin, super
      from user_scopes us
      join scopes s on s.id = us.scope_id
      where us.user_id = ?`

    return this.db.all(query, id)
  }

  async scopeCredentials(id) {
    const scopeNames = new Set()
    const scopes = await this.scopes(id)

    scopes.forEach(scope => scopeNames.add(slug(scope.name)))

    Object.entries(privs).forEach(([priv, privScope]) => {
      if (scopes.some(scope => scope[priv])) {
        scopeNames.add(privScope)
      }
    })

    return Array.from(scopeNames)
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
