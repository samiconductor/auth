const path = require('path')
const sqlite = require('sqlite')
const {version} = require('../../package.json')

exports.plugin = {
  name: 'repos',
  version,
  async register(server, { verbose = false }) {
    server.ext('onPreAuth', async (request, h) => {
      const db = await sqlite.open(process.env.DB, { verbose })
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

      return h.continue
    })

    server.ext('onPostHandler', async (request, h) => {
      await request.app.db.close()

      return h.continue
    })
  }
}
