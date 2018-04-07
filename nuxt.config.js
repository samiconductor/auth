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
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      {
        rel: "stylesheet",
        href:
          "https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons"
      }
    ]
  },
  css: ["@/assets/style/app.styl"],
  loading: { color: "#3B8070" },
  plugins: ["@/plugins/vuetify.js"],
  router: {
    middleware: "auth"
  },
  serverMiddleware: ["./jwt.js"],
  build: {
    vendor: ["whatwg-fetch", "@/plugins/vuetify.js"],
    babel: {
      presets: ["vue-app"],
      plugins: [
        [
          "babel-plugin-transform-builtin-extend",
          {
            globals: ["Error"]
          }
        ]
      ]
    },
    extraceCSS: true,
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
