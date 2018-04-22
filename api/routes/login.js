const Joi = require("joi");
const Boom = require("boom");
const jwt = require("jsonwebtoken");
const errors = require("../errors");

const schema = Joi.object().keys({
  username: Joi.string()
    .empty("")
    .trim()
    .alphanum()
    .max(50)
    .required(),
  password: Joi.string()
    .empty("")
    .max(200)
    .required()
});

module.exports = {
  method: "POST",
  path: `${process.env.API_PREFIX}/login`,
  options: {
    auth: false,
    validate: {
      payload: schema,
      failAction(request, h, error) {
        const invalidLogin = Boom.badRequest("Invalid login");

        invalidLogin.output.payload.errors = validationErrors(error);

        return invalidLogin;
      }
    }
  },
  async handler(
    { app: { repos: { users, sessions } }, payload: { username, password } },
    h
  ) {
    try {
      const user = await users.withCredentials(username, password);
      const session = await sessions.create(user.id);
      const token = jwt.sign(
        {
          sessionId: session.id
        },
        process.env.JWT_SECRET
      );

      h.state("token", token);

      return h.continue;
    } catch (error) {
      if (
        errors.instanceOf(
          error,
          errors.NotFoundError,
          errors.InvalidCredentialsError
        )
      ) {
        const message = "Invalid username or password";
        const unauthorized = Boom.unauthorized(message);

        unauthorized.output.payload.errors = { message };

        return unauthorized;
      }

      throw error;
    }
  }
};

function validationErrors(error) {
  return error.details.reduce((fields, detail) => {
    return {
      ...fields,
      [detail.context.key]: detail.message
    };
  }, {});
}
