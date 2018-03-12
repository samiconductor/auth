module.exports = {
  method: 'GET',
  path: '/authorized',
  options: {
    // TODO validate query
    auth: {
      access: [{
        scope: [
          '{credentials.allPrivileges.sites}',
          '{query.site}'
        ]
      }]
    }
  },
  handler(request, h) {
    return h.continue
  }
}
