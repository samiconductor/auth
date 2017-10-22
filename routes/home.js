module.exports = {
  method: 'GET',
  path: '/',
  config: {
    pre: [
      require('./pre/get-auth-user')
    ],
    auth: {
      mode: 'try'
    },
    handler: (request, reply) => {
      reply.view('home', {
        user: request.pre.user
      })
    }
  }
}
