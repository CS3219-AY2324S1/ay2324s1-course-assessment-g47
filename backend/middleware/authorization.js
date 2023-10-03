const jwt = require("jsonwebtoken");

function authenticateToken(allowedRoles) {
	return (req, res, next) => {
		const authHeader = req.headers["authorization"]; // Bearer TOKEN
		const token = authHeader && authHeader.split(" ")[1];

		if (token == null) {
			return res.status(401).json({ error: "Null token" });
		}

		jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
			if (error) {
				return res.status(403).json({ error: error.message });
			}

			// Assuming your JWT payload includes a 'role' field
			const userRole = user.account_type;

			// Check if the user's role is allowed for this route
			if (!allowedRoles.includes(userRole)) {
				return res.status(403).json({
					error: "Access denied. Insufficient permissions.",
				});
			}

			req.user = user;
			next();
		});
	};
}

module.exports = authenticateToken;
