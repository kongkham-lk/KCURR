const { createProxyMiddleware } = require('http-proxy-middleware');

const baseURL = "https://localhost:5268";

module.exports = function(app) {
  app.use(
    '/api', // The endpoint on your frontend to be proxied
    createProxyMiddleware({
      target: baseURL, // URL of your backend API
      changeOrigin: true,
    })
  );
};