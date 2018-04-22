module.exports = {
  method: "GET",
  path: `${process.env.API_PREFIX}/authenticated`,
  handler(request, h) {
    return h.continue;
  }
};
