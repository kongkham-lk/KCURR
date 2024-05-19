const { createProxyMiddleware } = require('http-proxy-middleware');

const baseURL = process.env.NODE_ENV === "development" ? process.env.REACT_APP_DEV_BASEURL : process.env.REACT_APP_PROD_BASEURL;
const port = process.env.REACT_APP_TARGET_PORT;

module.exports = function(app) {
  app.use(
    '/api', // The endpoint on your frontend to be proxied
    createProxyMiddleware({
      target: `${baseURL}:${port}`, // URL of your backend API
      changeOrigin: true,
    })
  );
};