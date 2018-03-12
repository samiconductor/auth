module.exports = {
  method: 'GET',
  path: '/authenticated',
  handler(request, h) {
    return h.continue
  }
}
