const connectRepos = require('../connect-repos')
const { version } = require('../../package.json')

exports.plugin = {
  name: 'repos',
  version,
  async register(server, { verbose = false }) {

    server.ext('onPreAuth', async (request, h) => {
      const { db, repos } = await connectRepos({ verbose })

      if (verbose) {
        db.driver.on('trace', sql => {
          request.log(['trace', 'db'], sql)
        })
      }

      Object.assign(request.app, { repos, db })

      return h.continue
    })

    server.ext('onPostHandler', async (request, h) => {
      await request.app.db.close()

      return h.continue
    })

  }
}
