const getAuthUser = require("../pre/get-auth-user");

module.exports = {
  method: "GET",
  path: `${process.env.API_PREFIX}/me`,
  options: {
    pre: [getAuthUser]
  },
  handler({ pre: { user } }) {
    return user;
  }
};
