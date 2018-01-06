module.exports = {
  reporters: {
    console: [{
      module: 'good-squeeze',
      name: 'Squeeze',
      args: [{
        error: '*',
        log: '*',
        request: '*',
        response: '*'
      }]
    }, {
      module: 'good-console'
    }, 'stdout']
  }
}
