const errors = require("./errors");

module.exports = async (decoded, request) => {
  try {
    const { users, sessions } = request.app.repos;
    const session = await sessions.valid(decoded.sessionId);
    const scopes = await users.scopes(session.userId);
    const privileges = await users.allPrivilegeScopes();
    const credentials = Object.freeze({
      userId: session.userId,
      sessionId: session.id,
      scope: Object.freeze(scopes),
      allPrivileges: Object.freeze(privileges)
    });

    request.log(
      ["debug"],
      `Auth user credentials ${JSON.stringify(credentials)}`
    );

    return { isValid: true, credentials };
  } catch (error) {
    if (
      errors.instanceOf(
        error,
        errors.NoResultsError,
        errors.InvalidSessionError
      )
    ) {
      return { isValid: false };
    }

    request.log(["error"], error);

    throw error;
  }
};
