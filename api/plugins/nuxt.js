const { resolve } = require("path");
const { Nuxt, Builder } = require("nuxt");
const { version } = require("../../package.json");

module.exports = {
  name: "nuxt",
  version,
  async register(server, { config = "nuxt.config.js" }) {
    const configPath = resolve(__dirname, "../../", config);
    const nuxt = new Nuxt(require(configPath));

    await nuxt.ready();

    server.expose("nuxt", nuxt);

    server.route({
      method: "GET",
      path: "/{path*}",
      options: {
        id: "Nuxt.render",
        auth: {
          mode: "try"
        }
      },
      handler(request, h) {
        if (request.path.startsWith("/api")) {
          return h.continue;
        }

        const {
          auth: { isAuthenticated: authenticated },
          raw: { req, res }
        } = request;

        nuxt.render(Object.assign(req, { authenticated }), res);

        return h.abandon;
      }
    });

    if (nuxt.options.dev) {
      server.log(["plugin", "nuxt"], "Building nuxt...");

      const builder = new Builder(nuxt);

      server.expose("builder", builder);

      builder
        .build()
        .catch(error => server.log(["error", "plugin", "nuxt"], error));
    }
  }
};
