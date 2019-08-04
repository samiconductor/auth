const jwt = require("jsonwebtoken");

module.exports = username => jwt.sign({ username }, process.env.JWT_SECRET);
