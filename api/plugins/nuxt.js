const { resolve } = require("path");
const { Nuxt, Builder } = require("nuxt");
const { version } = require("../../package.json");

module.exports = {
  name: "nuxt",
  version,
  async register(server, { config = "nuxt.config.js" }) {
    const configPath = resolve(process.cwd(), config);
    const nuxt = new Nuxt(require(configPath));

    server.expose("nuxt", nuxt);

    server.route({
      method: "GET",
      path: "/{path*}",
      options: {
        id: "Nuxt.render",
        auth: false
      },
      handler(request, h) {
        if (request.path.startsWith(process.env.API_PREFIX)) {
          return h.continue;
        }

        const { req, res } = request.raw;

        nuxt.render(req, res);

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
