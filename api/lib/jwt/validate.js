const errors = require("../errors");

module.exports = async ({ username }, request) => {
  if (!username) {
    return { isValid: false };
  }

  try {
    const { users } = request.app.repos;
    const { id: userId } = await users.withUsername(username);
    const credentials = Object.freeze({ userId });

    request.log(
      ["debug"],
      `Auth user credentials ${JSON.stringify(credentials)}`
    );

    return { isValid: true, credentials };
  } catch (error) {
    if (errors.instanceOf(error, errors.NotFoundError)) {
      return { isValid: false };
    }

    request.log(["error"], error);

    throw error;
  }
};
