module.exports = {
  method: "GET",
  path: `${process.env.API_PREFIX}/authorized`,
  options: {
    // TODO validate query
    auth: {
      access: [
        {
          scope: ["{credentials.allPrivileges.sites}", "{query.site}"]
        }
      ]
    }
  },
  handler(request, h) {
    return h.continue;
  }
};
