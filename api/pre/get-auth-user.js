module.exports = {
  assign: "user",
  method: async (
    {
      app: { repos: { users } },
      auth: { isAuthenticated, credentials: { userId } }
    },
    h
  ) => {
    if (isAuthenticated) {
      return await users.get(userId);
    }

    return h.continue;
  }
};
