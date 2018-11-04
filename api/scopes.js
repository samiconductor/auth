const camelCase = require("camelcase");
const slug = require("slug");

slug.defaults.mode = "rfc3986";

/**
 * Append unique Id to role scopes to avoid clashing with site name scopes.
 */
const roleScope = (role, uuid) => {
  return `${slug(role.name).toLowerCase()}-${uuid}`;
};

module.exports = async (userId, uuid, { roles }) => {
  const userRole = await roles.user(userId);
  const all = await roles.all();
  const scope = [roleScope(userRole, uuid)];
  const roleScopes = Object.freeze(
    all.reduce((roles, role) => {
      return Object.assign(roles, {
        [camelCase(role.name)]: roleScope(role, uuid)
      });
    }, {})
  );

  return { scope, roles: roleScopes };
};
