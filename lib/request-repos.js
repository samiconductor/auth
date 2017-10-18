const path = require('path')
const pkg = require('../package.json')
const sqlite = require('sqlite')
const verbose = process.env.NODE_ENV === 'development'

exports.register = (server, options, next) => {

  server.ext('onPreAuth', async (request, reply) => {
    try {
      const db = await sqlite.open(process.env.DB, {verbose})

      if (verbose) {
        db.driver.on('trace', sql => {
          request.log(['trace', 'database'], sql)
        })
      }

      request.app.repos = require('require-all')({
        dirname: path.join(__dirname, 'repos'),
        resolve: Repo => new Repo(db)
      })

      request.app.db = db

      reply.continue()
    } catch(error) {
      reply(error)
    }
  })

  server.ext('onPostHandler', async (request, reply) => {
    try {
      await request.app.db.close()

      reply.continue()
    } catch(error) {
      reply(error)
    }
  })

  next()

}

exports.register.attributes = {pkg}
