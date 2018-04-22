module.exports = {
  method: "DELETE",
  path: `${process.env.API_PREFIX}/sessions/{id}`,
  options: {
    auth: {
      access: [
        {
          scope: ["{credentials.allPrivileges.admin}"]
        }
      ]
    }
  },
  async handler({ app: { repos: { sessions } }, params: { id } }) {
    return await sessions.end(id, {
      terminate: true
    });
  }
};
