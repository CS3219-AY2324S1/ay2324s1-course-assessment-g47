const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: "proxy": "http://question-service:27017/",
      changeOrigin: true,
    })
  );
};
