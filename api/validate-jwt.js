const errors = require("./errors");
const uuid = require("uuid/v4");
const scopes = require("./scopes");

module.exports = async ({ sessionId }, request) => {
  try {
    const { sessions } = request.app.repos;
    const { userId } = await sessions.valid(sessionId);
    const { scope, roles } = await scopes(userId, uuid(), {
      roles: request.app.repos.roles
    });
    const credentials = Object.freeze({
      userId,
      sessionId,
      scope,
      roles
    });

    request.log(
      ["debug"],
      `Auth user credentials ${JSON.stringify(credentials)}`
    );

    return { isValid: true, credentials };
  } catch (error) {
    if (
      errors.instanceOf(error, errors.NotFoundError, errors.InvalidSessionError)
    ) {
      return { isValid: false };
    }

    request.log(["error"], error);

    throw error;
  }
};
