module.exports = {
  assign: "user",
  method: async (request, h) => {
    if (request.auth.isAuthenticated) {
      const { users, sessions } = request.app.repos;
      const { userId, sessionId, scope, roles } = request.auth.credentials;

      const user = await users.get(userId);
      const session = await sessions.get(sessionId);
      const access = Object.entries(roles).reduce(
        (access, [name, roleScope]) => {
          if (scope.some(s => s === roleScope)) {
            Object.assign(access, {
              [name]: true
            });
          }

          return access;
        },
        {}
      );

      return { ...user, session, scope, access };
    }

    return h.continue;
  }
};
