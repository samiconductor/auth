module.exports = {
  method: 'GET',
  path: '/authorized',
  handler: (request, reply) => {
    // get orignal site from request and make sure the scope is good
    reply('ok')
  }
}
