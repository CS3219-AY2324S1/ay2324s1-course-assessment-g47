const jwt = require("jsonwebtoken");

// Generate an access token and a refresh token for this database user
function jwtTokens({ user_id, username, email, account_type }) {
	const user = { user_id, username, email, account_type };
	const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: "7d",
	});
	const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: "7d",
	});
	return { accessToken, refreshToken };
}

module.exports = { jwtTokens };
