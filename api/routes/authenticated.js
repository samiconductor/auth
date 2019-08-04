module.exports = {
  method: "GET",
  path: "/api/authenticated",
  handler(request, h) {
    return h.continue;
  }
};
