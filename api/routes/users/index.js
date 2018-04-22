module.exports = {
  method: "GET",
  path: `${process.env.API_PREFIX}/users`,
  options: {
    auth: {
      access: [
        {
          scope: ["{credentials.allPrivileges.admin}"]
        }
      ]
    }
  },
  async handler({ app: { repos: { users } } }) {
    return await users.all();
  }
};
