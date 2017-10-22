module.exports = {
  method: 'GET',
  path: '/login',
  config: {
    auth: false,
    handler: {
      view: 'login'
    }
  }
}
