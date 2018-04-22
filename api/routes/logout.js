module.exports = {
  method: "POST",
  path: `${process.env.API_PREFIX}/logout`,
  async handler(
    {
      app: { repos: { sessions } },
      auth: { isAuthenticated, credentials: { sessionId } }
    },
    h
  ) {
    if (isAuthenticated) {
      await sessions.end(sessionId);
    }

    h.unstate("token");

    return h.continue;
  },
  options: {
    auth: {
      mode: "try"
    }
  }
};
