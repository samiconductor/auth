/* eslint no-console: "off" */
const path = require("path");
const repos = require("./api/lib/db/repos");
const inquirer = require("inquirer");

const setup = async ({ verify = false } = {}) => {
  try {
    const dbPath = process.env.DB || (await getDbPath());
    const verbose = process.env.NODE_ENV === "development";
    const {
      db,
      repos: { users }
    } = await repos({ dbPath, verbose });

    if (verbose) {
      db.driver.on("trace", console.debug.bind(console));
    }

    await db.migrate();

    const setupRequired = await userSetupRequired(users);

    if (setupRequired && verify) {
      console.log(
        `Setup the server first by running 'node ${path.basename(__filename)}'`
      );
      process.exit(1);
    }

    if (setupRequired) {
      const { username, password } = await getUserCredentials();

      await users.add(username, password);
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

async function userSetupRequired(users) {
  const all = await users.all();

  return !all.length;
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

async function getUserCredentials() {
  return await inquirer.prompt([
    {
      type: "input",
      name: "username",
      message: "Please provide a username",
      validate(username) {
        return /^[\w-]+$/.test(username)
          ? true
          : "Username must be only letters, numbers, underscores, or hyphens";
      }
    },
    {
      type: "password",
      name: "password",
      message: "Please provide a password",
      validate(password) {
        return password.length ? true : "Password must not be empty";
      }
    }
  ]);
}
