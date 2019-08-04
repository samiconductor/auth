module.exports = {
  reporters: {
    console: [
      {
        module: "@hapi/good-squeeze",
        name: "Squeeze",
        args: [
          {
            error: "*",
            log: "*",
            request: "*",
            response: "*"
          }
        ]
      },
      {
        module: "@hapi/good-console"
      },
      "stdout"
    ]
  }
};
