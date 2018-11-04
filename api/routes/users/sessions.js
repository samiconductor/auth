module.exports = {
  method: "GET",
  path: `${process.env.API_PREFIX}/users/{id}/sessions`,
  options: {
    auth: {
      access: [
        {
          scope: ["{credentials.roles.admin}"]
        }
      ]
    }
  },
  async handler({
    app: { repos: { sessions } },
    params: { id },
    query: { active }
  }) {
    return await sessions.user(id, { active });
  }
};
