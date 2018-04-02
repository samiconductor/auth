module.exports = {
  method: "GET",
  path: "/api/authorized",
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
