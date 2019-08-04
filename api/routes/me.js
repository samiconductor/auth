const getAuthUser = require("../pre/get-auth-user");

module.exports = {
  method: "GET",
  path: "/api/me",
  options: {
    pre: [getAuthUser]
  },
  handler({ pre: { user } }) {
    return user;
  }
};
