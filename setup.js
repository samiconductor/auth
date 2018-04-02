/* eslint no-console: "off" */
const path = require("path");
const connectRepos = require("./api/connect-repos");
const errors = require("./api/errors");
const inquirer = require("inquirer");

const setup = async ({ verify = false } = {}) => {
  try {
    const dbPath = process.env.DB || (await getDbPath());
    const verbose = process.env.NODE_ENV === "development";
    const { db, repos: { users } } = await connectRepos({ dbPath, verbose });

    if (verbose) {
      db.driver.on("trace", console.debug.bind(console));
    }

    await db.migrate();

    const setupRequired = {
      admin: await adminSetupRequired(users)
    };

    if (Object.values(setupRequired).some(req => req) && verify) {
      console.log(
        `Setup the server first by running 'node ${path.basename(__filename)}'`
      );
      process.exit(1);
    }

    if (setupRequired.admin) {
      const { username, password } = await getAdminCredentials();

      await users.add(username, password, { admin: true, sites: true });
    }

    await db.close();

    if (!verify) {
      console.log("Auth server is setup.");
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = setup;

if (require.main === module) {
  setup();
}

async function adminSetupRequired(users) {
  try {
    const adminUsers = await users.admins();

    return !adminUsers.length;
  } catch (error) {
    if (errors.instanceOf(errors.NoResultsError)) {
      return true;
    }

    throw error;
  }
}

async function getDbPath() {
  const { dbPath } = await inquirer.prompt({
    type: "input",
    name: "dbPath",
    message: "Enter the path to a database file",
    default: "auth.db"
  });

  return dbPath;
}

async function getAdminCredentials() {
  return await inquirer.prompt([
    {
      type: "input",
      name: "username",
      message: "Please provide the admin username",
      validate(username) {
        return /^[\w-]+$/.test(username)
          ? true
          : "Username must be only letters, numbers, underscores, or hyphens";
      }
    },
    {
      type: "password",
      name: "password",
      message: "Please provide the admin password",
      validate(password) {
        return password.length ? true : "Admin password must not be empty";
      }
    }
  ]);
}
