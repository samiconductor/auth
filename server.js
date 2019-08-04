const Hapi = require("@hapi/hapi");
const setup = require("./setup");
const monitoring = require("./api/lib/monitoring");
const validate = require("./api/lib/jwt/validate");
const nuxt = require("./api/plugins/nuxt");
const routes = require("./api/lib/routes");

const server = Hapi.server({
  host: process.env.HOST,
  port: process.env.PORT
});

const init = async () => {
  await setup({ verify: true });

  await server.register([
    {
      plugin: require("@hapi/good"),
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
    isSecure: process.env.NODE_ENV !== "development",
    isSameSite: "Strict"
  });

  await server.register(nuxt);

  server.route(routes);

  await server.start();

  server.log(["start"], `Server running at: ${server.info.uri}`);
};

process.on("unhandledRejection", error => {
  /* eslint no-console: "off" */
  console.error(error);
  process.exit(1);
});

init();
