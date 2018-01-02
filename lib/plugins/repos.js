const path = require('path')
const sqlite = require('sqlite')
const {version} = require('../../package.json')

const name = path.basename(__filename, path.extname(__filename))
const verbose = process.env.NODE_ENV === 'development'

exports.register = (server, options, next) => {

  server.ext('onPreAuth', async (request, reply) => {
    try {
      const db = await sqlite.open(process.env.DB, {verbose})
      const repos = require('require-all')({
        dirname: path.resolve(__dirname, '../repos'),
        resolve: Repo => new Repo(db)
      })

      if (verbose) {
        db.driver.on('trace', sql => {
          request.log(['trace', 'db'], sql)
        })
      }

      Object.assign(request.app, {repos, db})

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

exports.register.attributes = {name, version}
