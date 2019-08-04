const Joi = require("@hapi/joi");

exports.username = Joi.string()
  .empty("")
  .trim()
  .alphanum()
  .max(50)
  .required();

exports.password = Joi.string()
  .empty("")
  .max(100)
  .required();
