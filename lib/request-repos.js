const Hoek = require('hoek')
const path = require('path')
const pkg = require('../package.json')

exports.register = (server, options, next) => {

  server.ext('onPreAuth', (request, reply) => {
    Hoek.assert(request.pg, 'Request models need the pg pool!')

    request.app.repos = require('require-all')({
      dirname: path.join(__dirname, 'repos'),
      resolve: Repo => new Repo(request.pg)
    });

    reply.continue()
  })

  next()
}

exports.register.attributes = {pkg}
