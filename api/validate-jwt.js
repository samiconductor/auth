const errors = require("./errors");
const uuid = require("uuid/v4");
const scopes = require("./scopes");

module.exports = async ({ sessionId }, request) => {
  try {
    const { sessions, privileges } = request.app.repos;
    const { userId } = await sessions.valid(sessionId);
    const { scope, allPrivileges } = await scopes(userId, uuid(), {
      privileges
    });
    const credentials = Object.freeze({
      userId,
      sessionId,
      scope,
      allPrivileges
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
