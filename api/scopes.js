const camelCase = require("camelcase");
const slug = require("slug");

slug.defaults.mode = "rfc3986";

/**
 * Append unique Id to privilege scopes to avoid clashing with site name scopes.
 */
const privilegeScope = (privilege, uuid) => {
  return `${slug(privilege.name).toLowerCase()}-${uuid}`;
};

module.exports = async (userId, uuid, { privileges }) => {
  const user = await privileges.user(userId);
  const all = await privileges.all();
  const scope = Object.freeze(user.map(priv => privilegeScope(priv, uuid)));
  const allPrivileges = Object.freeze(
    all.reduce((privs, priv) => {
      return Object.assign(privs, {
        [camelCase(priv.name)]: privilegeScope(priv, uuid)
      });
    }, {})
  );

  return { scope, allPrivileges };
};
