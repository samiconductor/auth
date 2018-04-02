module.exports = {
  method: "GET",
  path: "/api/users",
  options: {
    auth: {
      access: [
        {
          scope: ["{credentials.allPrivileges.admin}"]
        }
      ]
    }
  },
  async handler(request) {
    return await request.app.repos.users.all();
  }
};
