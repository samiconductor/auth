module.exports = {
  method: 'POST',
  path: '/logout',
  config: {
    auth: {
      mode: 'optional'
    },
    handler: (request, reply) => {
      reply.redirect('/').unstate('token')
    }
  }
}
