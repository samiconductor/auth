const bcrypt = require('bcrypt')
const uuid = require('uuid/v4')
const camelCase = require('camelcase')
const slug = require('slug')
const errors = require('../errors')
const transaction = require('../transaction')

slug.defaults.mode = 'rfc3986'

module.exports = class User {

  constructor(db) {
    this.db = db
    this.uuid = uuid()
  }

  async all() {
    const query = 'select id, username from users'

    return this.db.all(query)
  }

  async get(id) {
    const query = 'select id, username from users where id = ?'
    const params = [id]
    const user = await this.db.get(query, ...params)

    if (!user) {
      throw new errors.NoResultsError(query, params, `No user found with Id ${id}`)
    }

    const privileges = await this.privileges(user.id)

    return { ...user, privileges }
  }

  async privileges(id) {
    const query = `select priv_id as id, name, description
      from user_privs up
      join privs p on p.id = up.priv_id
      where up.user_id = ?`

    return this.db.all(query, id)
  }

  async scopes(id) {
    const privileges = await this.privileges(id)

    return privileges.map(priv => this._privilegeScope(priv))
  }

  async allPrivilegeScopes() {
    const query = 'select name from privs'
    const privileges = await this.db.all(query)

    return privileges.reduce((privs, priv) => {
      return Object.assign(privs, {
        [camelCase(priv.name)]: this._privilegeScope(priv)
      })
    }, {})
  }

  /**
   * Avoid privilege names clashing with other scope names.
   */
  _privilegeScope(privilege) {
    return `${slug(privilege.name).toLowerCase()}-${this.uuid}`
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

  async add(username, password, { admin = false, sites = false } = {}) {
    const query = 'insert into users (username, password) values (?, ?)'
    const rounds = 10 + Math.floor(Math.random() * 5)
    const passwordHash = await bcrypt.hash(password, rounds)
    const params = [username, passwordHash]

    return await transaction(this.db, 'add_user', async () => {
      const { lastID } = await this.db.run(query, ...params)
      const privs = await this.addUserPrivileges(lastID, { admin, sites })

      return { user: lastID, privs }
    })
  }

  async addUserPrivileges(userId, { admin = false, sites = false } = {}) {
    const query = `replace into user_privs (user_id, priv_id)
      select ?, id from privs p where lower(p.name) = ?`
    const privs = []

    if (admin) privs.push('admin')
    if (sites) privs.push('sites')

    if (privs.length) {
      return await transaction(this.db, 'add_privs', async () => {
        return await Promise.all(privs.map(async priv => {
          const { lastID } = await this.db.run(query, userId, priv)
          return lastID
        }))
      })
    }
  }

  async admins() {
    const query = `select u.id, u.username
      from users u
      join user_privs up on up.user_id = u.id
      join privs p on p.id = up.priv_id
      where lower(p.name) = 'admin'`

    return this.db.all(query)
  }

}
