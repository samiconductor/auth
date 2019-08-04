module.exports = {
  method: "POST",
  path: "/api/logout",
  options: {
    auth: false
  },
  async handler(request, h) {
    h.unstate(process.env.TOKEN);

    return h.continue;
  }
};
