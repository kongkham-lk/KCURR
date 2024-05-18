const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api', // The endpoint on your frontend to be proxied
    createProxyMiddleware({
      target: process.env.PRODBASEURL, // URL of your backend API
      changeOrigin: true,
    })
  );
};