const Boom = require("boom");
const errors = require("../../errors");

module.exports = {
  method: "GET",
  path: `${process.env.API_PREFIX}/users/{id}`,
  options: {
    auth: {
      access: [
        {
          scope: ["{credentials.roles.admin}"]
        }
      ]
    }
  },
  async handler({ app: { repos: { users } }, params: { id } }) {
    try {
      return await users.get(id);
    } catch (error) {
      if (errors.instanceOf(error, errors.NotFoundError)) {
        throw Boom.notFound(`User ${id} not found`);
      }

      throw error;
    }
  }
};
