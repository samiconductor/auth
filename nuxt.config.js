module.exports = {
  srcDir: "client/",
  head: {
    title: "Auth",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: "Web app for auth server"
      }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },
  router: {
    middleware: "auth"
  },
  serverMiddleware: ["./jwt.js"],
  modules: ["@nuxtjs/axios", "@nuxtjs/vuetify"],
  axios: {
    prefix: "/api"
  },
  build: {
    // run eslint on save
    extend(config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: "pre",
          test: /\.(js|vue)$/,
          loader: "eslint-loader",
          exclude: /(node_modules)/
        });
      }
    }
  }
};
