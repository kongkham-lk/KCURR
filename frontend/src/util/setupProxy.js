const { createProxyMiddleware } = require('http-proxy-middleware');

const baseURL = process.env.NODE_ENV === "Development" ? process.env.DEV_BASEURL : process.env.PROD_BASEURL;

module.exports = function(app) {
  app.use(
    '/api', // The endpoint on your frontend to be proxied
    createProxyMiddleware({
      target: baseURL, // URL of your backend API
      changeOrigin: true,
    })
  );
};