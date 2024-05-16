const { createProxyMiddleware } = require('http-proxy-middleware');

const devBaseURL = "https://localhost:5268";
const prodBaseURL = "https://kcurr-backend.onrender.com";

module.exports = function(app) {
  app.use(
    '/api', // The endpoint on your frontend to be proxied
    createProxyMiddleware({
      target: devBaseURL, // URL of your backend API
      changeOrigin: true,
    })
  );
};