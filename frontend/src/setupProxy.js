require("dotenv").config();
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
	console.log(process.env.ENV);
	// Check the value of process.env.ENV
	if (process.env.ENV === "LOCAL") {
		console.log("LOCAL ENVIRONMENT DETECTED");
		// Proxy requests to localhost:8081 (user-service)
		app.use(
			"/api/users",
			createProxyMiddleware({
				target: "http://localhost:8081",
				changeOrigin: true,
				logLevel: "debug",
			})
		);

		// Proxy requests to localhost:8082 (question-service)
		app.use(
			"/api/questions",
			createProxyMiddleware({
				target: "http://localhost:8082",
				changeOrigin: true,
			})
		);

		// Proxy requests to localhost:8083 (matching-service)
		app.use(
			"/api/matching",
			createProxyMiddleware({
				target: "http://localhost:8083",
				changeOrigin: true,
			})
		);

		// Proxy requests to localhost:8084 (collaboration-service)
		app.use(
			"/api/collaboration",
			createProxyMiddleware({
				target: "http://localhost:8084",
				changeOrigin: true,
			})
		);

		// Proxy requests to localhost:8085 (history-service)
		app.use(
			"/api/history",
			createProxyMiddleware({
				target: "http://localhost:8085",
				changeOrigin: true,
			})
		);
	} else {
		console.log("PROD ENVIRONMENT DETECTED");
	}
};
