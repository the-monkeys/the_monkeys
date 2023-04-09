const { createProxyMiddleware } = require("http-proxy-middleware");

const API_BASE_URI = `/api/v1/`;

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      pathRewrite: { "/api/": API_BASE_URI },
      target: "https://themonkeys.tech",
      changeOrigin: true,
      secure: false,
      logLevel: "debug",
      protocol: "https",
      headers: {
        Connection: "keep-alive",
      },
    })
  );
};
