const Hapi = require("hapi");
const setup = require("./setup");
const monitoring = require("./api/monitoring");
const validate = require("./api/validate-jwt");
const nuxt = require("./api/plugins/nuxt");
const routes = require("./api/routes");

const server = new Hapi.Server({
  port: 3000,
  host: "localhost"
});

const init = async () => {
  await setup({ verify: true });

  await server.register([
    {
      plugin: require("good"),
      options: monitoring
    },
    {
      plugin: require("./api/plugins/repos"),
      options: {
        verbose: process.env.NODE_ENV === "development"
      }
    },
    require("hapi-auth-jwt2")
  ]);

  server.auth.strategy("jwt", "jwt", {
    key: process.env.JWT_SECRET,
    validate,
    verifyOptions: {
      algorithms: ["HS256"]
    }
  });

  server.auth.default("jwt");

  server.state("token", {
    path: "/",
    isHttpOnly: process.env.NODE_ENV !== "development",
    isSecure: process.env.NODE_ENV !== "development"
  });

  await server.register(nuxt);

  server.route(Object.values(routes));

  await server.start();

  server.log(["start"], `Server running at: ${server.info.uri}`);
};

process.on("unhandledRejection", error => {
  /* eslint no-console: "off" */
  console.error(error);
  process.exit(1);
});

init();
