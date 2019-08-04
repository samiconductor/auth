const Boom = require("@hapi/boom");
const errors = require("../lib/errors");
const createToken = require("../lib/jwt/create");
const { username, password } = require("../lib/validate");

module.exports = {
  method: "POST",
  path: "/api/login",
  options: {
    auth: false,
    validate: {
      payload: { username, password },
      failAction(request, h, error) {
        const invalidLogin = Boom.badRequest("Invalid login");

        invalidLogin.output.payload.errors = validationErrors(error);

        return invalidLogin;
      }
    }
  },
  async handler(
    {
      app: {
        repos: { users }
      },
      payload: { username, password }
    },
    h
  ) {
    try {
      const user = await users.withCredentials(username, password);
      const token = createToken(user.username);

      h.state(process.env.TOKEN, token);

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
