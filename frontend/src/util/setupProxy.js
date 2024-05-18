const { createProxyMiddleware } = require('http-proxy-middleware');

const baseURL = process.env.NODE_ENV === "development" ? "https://localhost" : "https://kcurr-backend.onrender.com";
const port = 5268;

module.exports = function(app) {
  app.use(
    '/api', // The endpoint on your frontend to be proxied
    createProxyMiddleware({
      target: `${baseURL}:${port}`, // URL of your backend API
      changeOrigin: true,
    })
  );
};