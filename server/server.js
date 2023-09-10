const express = require("express");
const cors = require("cors");
const pool = require("./database");
const bcrypt = require("bcrypt");

const app = express();
const port = 4000;

app.use(express.json()); // Body parser middleware
app.use(cors()); // CORS middleware (allows requests from other domains)

// Register User
app.post("/users/register", (req, res) => {
	res.setHeader("Content-Type", "application/json");

	const username = req.body["username"];
	const email = req.body["email"];
	const password = req.body["password"];

	console.log("Username:" + username);
	console.log("Email:" + email);
	console.log("Password:" + password);

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

app.listen(port, () => console.log(`Server running on port ${port}`));

// pool.query(selectSTMT)
// 	.then((response) => {
// 		console.log("User logged in");
// 		console.log(response);
// 	})
// 	.catch((err) => {
// 		console.log(err);
// 	});

// console.log(req.body);
// res.json({ message: "Response queried!", data: req.body });

// let errors = [];
// if (!username || !email || !password) {
// 	errors.push({ msg: "Please enter all fields" });
// }

// if (password.length < 6) {
// 	errors.push({ msg: "Password must be at least 6 characters" });
// }

// if (errors.length > 0) {
// 	res.render("register", { errors });
// }

// pool.query(updateSTMT)
// 	.then((response) => {
// 		console.log("User updated");
// 		console.log(response);
// 		res.send("User updated successfully");
// 	})
// 	.catch((err) => {
// 		console.log(err);
// 	});
// console.log(req.body);
// res.send("Response updated!" + req.body);

// pool.query(updateSTMT)
// 	.then((response) => {
// 		console.log("User updated");
// 		console.log(response);
// 		res.send("User updated successfully");
// 	})
// 	.catch((err) => {
// 		console.log(err);
// 	});
// console.log(req.body);
// res.send("Response updated!" + req.body);

// Update User username and password only
// app.post("/users/update", (req, res) => {
// 	const username = req.body["username"];
// 	const email = req.body["email"];
// 	const password = req.body["password"];

// 	console.log("Username:" + username);
// 	console.log("Email:" + email);
// 	console.log("Password:" + password);

// 	const updateSTMT = `UPDATE accounts SET username = '${username}',
//         password = '${password}' WHERE email = '${email}';`;

// 	pool.query(updateSTMT)
// 		.then((response) => {
// 			console.log("User updated");
// 			console.log(response);
// 		})
// 		.catch((err) => {
// 			console.log(err);
// 		});

// 	console.log(req.body);
// 	res.send("Response updated!" + req.body);
// });
