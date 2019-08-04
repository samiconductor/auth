module.exports = {
  srcDir: "client/",
  head: {
    titleTemplate: "%s - " + process.env.npm_package_name,
    title: process.env.npm_package_name || "",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || ""
      }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },
  css: ["@mdi/font/css/materialdesignicons.css"],
  router: {
    middleware: "auth"
  },
  modules: ["@nuxtjs/axios"],
  devModules: ["@nuxtjs/vuetify"],
  axios: {
    prefix: "/api"
  },
  vuetify: {
    defaultAssets: false,
    theme: {
      dark: true
    }
  }
};
