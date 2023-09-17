require("dotenv").config();
const express = require("express");

// For postgresql
const cors = require("cors");
const pool = require("./database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { jwtTokens } = require("./utils/jwt-helpers");
const port = process.env.POSTGRESQLPORT;

const app = express(); //Start up express app

// For postgresql
app.use(express.json()); // Body parser middleware
app.use(cors()); // CORS middleware (allows requests from other domains)

// Register User
app.post("/users/register", async (req, res) => {
	res.setHeader("Content-Type", "application/json");

	const username = req.body["username"];
	const email = req.body["email"];
	const password = req.body["password"];
	const hashedPassword = await bcrypt.hash(password, 10);

	console.log("Username:" + username);
	console.log("Email:" + email);
	console.log("Password:" + password);

	const insertSTMT = `INSERT INTO accounts (username, email, password) VALUES ('${username}', '${email}', '${hashedPassword}');`;
	pool.query(insertSTMT)
		.then((response) => {
			console.log("User added");
			console.log(response);
		})
		.catch((err) => {
			console.log(err);
		});

	console.log(req.body);
	res.json({ message: "Account Created!", data: req.body });
});

// Login User
app.post("/users/login", async (req, res) => {
	res.setHeader("Content-Type", "application/json");

	const { email, password } = req.body;

	try {
		const response = await pool.query('SELECT * FROM accounts WHERE email = $1', [email]);

		if (response.rows.length === 0)
			return res.status(401).json({ error: "Email is incorrect" });

		user = response.rows[0];

		//PASSWORD CHECK
		const validPassword = await bcrypt.compare(password, user.password);
		if (!validPassword) return res.status(401).json({error: "Incorrect password"});

		// Create a JWT token
		let tokens = jwtTokens(user);//Gets access and refresh tokens
		res.cookie('refresh_token', tokens.refreshToken, {...(process.env.COOKIE_DOMAIN && {domain: process.env.COOKIE_DOMAIN}) , httpOnly: true,sameSite: 'none', secure: true});
	

		// Successful login
		return res.status(200).json({ message: "Login successful", user, tokens});
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Internal server error" });
	}
});

// Update User using ID
app.post("/users/update/:id", async (req, res) => {
	const id = req.params.id; // Get the user's ID from the URL parameter
	const username = req.body.username;
	const email = req.body.email;

	console.log("User ID: " + id);
	console.log("Username: " + username);
	console.log("Email: " + email);

	// Construct the UPDATE query with the ID in the WHERE clause
	const updateSTMT = `UPDATE accounts SET username = '${username}', 
                       email = '${email}' WHERE user_id = ${id}`;

	try {
		const response = await pool.query(updateSTMT);
		console.log("User updated");
		console.log(response);
		return res
			.status(200)
			.json({ message: "Login successful", data: req.body });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Internal server error" });
	}
});

// Update password using email (forgot password)
app.post("/users/update/password", async (req, res) => {
	const email = req.body.email;
	const password = req.body.password;

	// Hash the password
	const saltRounds = 10; // Number of salt rounds
	const hashedPassword = await bcrypt.hash(password, saltRounds);

	console.log("Password:" + hashedPassword);
	console.log("Email:" + email);

	const updateSTMT = `UPDATE accounts SET password = '${hashedPassword}' WHERE email = '${email}';`;

	try {
		const response = await pool.query(updateSTMT);
		console.log("User updated");
		console.log(response);
		return res
			.status(200)
			.json({ message: "Login successful", data: req.body });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Internal server error" });
	}
});

// Delete User using email
app.post("/users/delete", async (req, res) => {
	const email = req.body.email;

	console.log("Email:" + email);

	const deleteSTMT = `DELETE FROM accounts WHERE email = '${email}';`;

	try {
		const response = await pool.query(deleteSTMT);
		console.log("User deleted");
		console.log(response);
		return res
			.status(200)
			.json({ message: "Deleted successful", data: req.body });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Internal server error" });
	}
});

app.listen(port, () =>
	console.log(`PostgreSQL server running on port ${port}`)
);