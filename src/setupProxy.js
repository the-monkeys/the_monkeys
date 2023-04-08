const { createProxyMiddleware } = require("http-proxy-middleware");

const API_BASE_URI = (path) => `/api/v1/${path}`;

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      pathRewrite: { "/api": API_BASE_URI("auth") },
      target: "https://themonkeys.tech",
      changeOrigin: true,
      secure: false,
      logLevel: "debug",
      protocol: "https",
      headers: {
        Connection: "keep-alive",
      },
    }),
    createProxyMiddleware({
      pathRewrite: { "/api": API_BASE_URI("profile") },
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
