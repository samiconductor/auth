const jwt = require("express-jwt");
const cookie = require("cookie");

module.exports = jwt({
  secret: process.env.JWT_SECRET,
  credentialsRequired: false,
  getToken(req) {
    if (!req.headers.cookie) {
      return;
    }

    const { token } = cookie.parse(req.headers.cookie);

    return token;
  }
});
