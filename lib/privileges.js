const uuid = require('uuid/v4')

module.exports = Object.freeze({
  admin: `admin-${uuid()}`,
  super: `super-${uuid()}`
})
