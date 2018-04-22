const path = require("path");
const walk = require("fs-walk");
const requireAll = require("require-all");

const requireDir = (dirname, ...excludes) => {
  return requireAll({
    dirname,
    recursive: false,
    filter(name) {
      return excludes.includes(name) ? false : name;
    }
  });
};

const subDirs = async dirname => {
  return new Promise((resolve, reject) => {
    const paths = [];

    walk.dirs(
      dirname,
      (basedir, filename, stat, next) => {
        paths.push(path.resolve(basedir, filename));
        next();
      },
      err => {
        if (err) {
          return reject(err);
        }

        resolve(paths);
      }
    );
  });
};

module.exports = async () => {
  const routes = Object.values(
    requireDir(__dirname, path.basename(__filename))
  );
  const routeSubDirs = await subDirs(__dirname);

  return routeSubDirs.reduce((routes, dirname) => {
    return routes.concat(Object.values(requireDir(dirname)));
  }, routes);
};
