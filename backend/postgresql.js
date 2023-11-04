require("dotenv").config();
const express = require("express");

// For postgresql
const cors = require("cors");
const pool = require("./database");
const bcrypt = require("bcrypt");
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

	console.log("Username:" + username);
	console.log("Email:" + email);
	console.log("Password:" + password);

	try {
		// Check if the user with the same email or username already exists
		const userExistsQuery = `SELECT * FROM accounts WHERE email = $1;`;
		const userExistsResult = await pool.query(userExistsQuery, [email]);

		if (userExistsResult.rowCount > 0) {
			// User with the same email or username already exists
			console.log("User already exists");
			return res.status(401).json({ message: "Email already exists" });
		}
		// Hash the password
		// const saltRounds = 10; // Number of salt rounds
		// const hashedPassword = bcrypt.hashSync(password, saltRounds);

		// console.log("Hashed password:" + hashedPassword);

		const insertSTMT = `INSERT INTO accounts (username, email, password) VALUES ('${username}', '${email}', '${password}');`;
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
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: err.message });
	}
});

// Login User
app.post("/users/login", async (req, res) => {
	res.setHeader("Content-Type", "application/json");

	const email = req.body["email"];
	const password = req.body["password"];

	console.log("Email:" + email);
	console.log("Password:" + password);

	const selectSTMT = `SELECT * FROM accounts WHERE 
        email = '${email}' AND password = '${password}';`;

	try {
		const response = await pool.query(selectSTMT);

		if (response.rows.length === 0)
			return res.status(401).json({ error: "Invalid email or password" });

		const user = response.rows[0];
		console.log(user);

		if (user.password !== password) {
			// Password does not match
			return res.status(401).json({ error: "Invalid email or password" });
		}

		// Successful login
		return res.status(200).json({ message: "Login successful", user });
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
	const password = req.body.password;

	console.log("User ID: " + id);
	console.log("Username: " + username);
	console.log("Email: " + email);
	console.log("Password: " + password);

	// Construct the UPDATE query with the ID in the WHERE clause
	const updateSTMT = `UPDATE accounts SET username = '${username}', 
                       email = '${email}', password = '${password}' WHERE user_id = ${id}`;

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
