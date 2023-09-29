require("dotenv").config();
const express = require("express");
const amqp = require("amqplib");
const nodemailer = require("nodemailer");
const authenticateToken = require("./middleware/authorization"); // Import the middleware

const amqpUrl = process.env.AMQP_URL;

// Create a global variable to store the RabbitMQ connection
let connection;

// Create a global variable to store the RabbitMQ channel
let matchmakingChannel;

// For OTP Verification model
const UserOTPVerification = require("./models/UserOTPVerification");
const mongoose = require("mongoose");

// Connecting to MongoDB and verifying its connection
mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverSelectionTimeoutMS: 30000, // Global server selection timeout in milliseconds
});

const db = mongoose.connection;

db.on("error", (err) => {
	console.error("MongoDB connection error:", err);
});

// For postgresql
const cors = require("cors");
const pool = require("./database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { jwtTokens } = require("./utils/jwt-helpers");
const port = process.env.POSTGRESQLPORT;

// Nodemailer stuff
const { AUTH_EMAIL, AUTH_PASS } = process.env;
let transporter = nodemailer.createTransport({
	host: "smtp-mail.outlook.com",
	auth: {
		user: AUTH_EMAIL,
		pass: AUTH_PASS,
	},
});

const app = express(); //Start up express app

// For postgresql
app.use(express.json()); // Body parser middleware
app.use(cors()); // CORS middleware (allows requests from other domains)

// Register User
let id_counter;

app.post("/users/register", async (req, res) => {
	res.setHeader("Content-Type", "application/json");

	const username = req.body["username"];
	const email = req.body["email"];
	const password = req.body["password"];
	const hashedPassword = await bcrypt.hash(password, 10);

	console.log("Username:" + username);
	console.log("Email:" + email);
	console.log("Password:" + password);
	console.log("Account Type: User");

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

		const insertSTMT = `INSERT INTO accounts (username, email, password, account_type) VALUES ('${username}', '${email}', '${hashedPassword}', 'user') RETURNING user_id;`;
		pool.query(insertSTMT)
			.then((response) => {
				id_counter = response.rows[0].user_id;
				console.log("User added");
				console.log(response);
				console.log("Last Inserted ID:", id_counter);
			})
			.catch((err) => {
				console.log(err);
			});

		console.log(req.body);
		res.json({ message: "Account Created!", data: req.body });
		sendOTPVerificationEmail({ _id: id_counter, email, res });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: err.message });
	}
});

// Send OTP verification email
const sendOTPVerificationEmail = async ({ _id, email }, res) => {
	try {
		const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

		const mailOptions = {
			from: AUTH_EMAIL,
			to: email,
			subject: "Verify Your Email",
			html: `<p>Enter <b>${otp}</b> in the app to verify your email address.</p><p>This code <b>expires in 1 hour</b>.</p>`,
		};

		const saltRounds = 10;
		const hashedOTP = await bcrypt.hash(otp, saltRounds);

		try {
			const UserOTPVerificationRecords = await UserOTPVerification.find({
				email: email.toString(),
			});
			if (UserOTPVerificationRecords.length > 0) {
				throw new Error(
					"An existing account with this email address has already been created! Please try with a new email address!"
				);
			}
			const newOTPVerification = new UserOTPVerification({
				user_Id: _id,
				email: email,
				otp: hashedOTP,
				createdAt: Date.now(),
				expiresAt: Date.now() + 3600000,
			});

			// Save OTP Record
			await newOTPVerification.save();

			await transporter.sendMail(mailOptions);
		} catch (error) {
			console.error("Error while inserting into MongoDB:", error);
			if (res) {
				res.status(500).json({
					status: "FAILED",
					message: "Internal server error",
				});
			}
		}
	} catch (error) {
		console.log(error);
		if (res) {
			res.json({
				status: "FAILED",
				message: error.message,
			});
		}
	}
};

// Login User
app.post("/users/login", async (req, res) => {
	res.setHeader("Content-Type", "application/json");

	const { email, password } = req.body;

	try {
		const response = await pool.query(
			"SELECT * FROM accounts WHERE email = $1",
			[email]
		);

		if (response.rows.length === 0)
			return res.status(401).json({ error: "Email is incorrect" });

		user = response.rows[0];

		//PASSWORD CHECK
		const validPassword = await bcrypt.compare(password, user.password);
		if (!validPassword)
			return res.status(401).json({ error: "Incorrect password" });

		const authentication_stats = user.authentication_stats;
		if (!authentication_stats) {
			return res
				.status(401)
				.json({ error: "Please verify your account first!" });
		}

		// Create a JWT token
		let tokens = jwtTokens(user); //Gets access and refresh tokens
		res.cookie("refresh_token", tokens.refreshToken, {
			...(process.env.COOKIE_DOMAIN && {
				domain: process.env.COOKIE_DOMAIN,
			}),
			httpOnly: true,
			sameSite: "none",
			secure: true,
		});

		// Successful login
		return res
			.status(200)
			.json({ message: "Login successful", user, tokens });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Internal server error" });
	}
});

// Update User using ID
app.post("/users/update/:id", authenticateToken(['user', 'superuser', 'admin', 'superadmin']), async (req, res) => {
	const id = req.params.id; // Get the user's ID from the URL parameter
	const username = req.body.username;
	const email = req.body.email;
	// const password = req.body.password;

	console.log("User ID: " + id);
	console.log("Username: " + username);
	console.log("Email: " + email);
	// console.log("Password: " + password);

	// Construct the UPDATE query with the ID in the WHERE clause
	const updateSTMT = `UPDATE accounts SET username = '${username}', 
                       email = '${email}' WHERE user_id = ${id}`; //, password = '${password}'

	try {
		const response = await pool.query(updateSTMT);
		console.log("User updated");
		console.log(response);
		return res
			.status(200)
			.json({ message: "User updated successful", data: req.body });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Internal server error" });
	}
});

// Update password using email (forgot password)
app.post("/users/update_password", authenticateToken(['user', 'superuser', 'admin', 'superadmin']), async (req, res) => {
	console.log("Update password");
	const email = req.body.email;
	const password = req.body.password;
	const hashedPassword = await bcrypt.hash(password, 10);

	console.log("Password:" + hashedPassword);
	console.log("Email:" + email);

	const updateSTMT = `UPDATE accounts SET password = '${hashedPassword}' WHERE email = '${email}';`;

	try {
		const response = await pool.query(updateSTMT);
		console.log("User updated");
		console.log(response);
		return res
			.status(200)
			.json({ message: "Update password successful", data: req.body });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Internal server error" });
	}
});

// Delete User using email
app.post("/users/delete", authenticateToken(['user', 'superuser', 'admin', 'superadmin']), async (req, res) => {
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

// Update account type using email
app.post("/users/update/type/:id", authenticateToken(['admin', 'superadmin']), async (req, res) => {
	const email = req.body.email;
	const account_type = req.body.account_type;

	console.log("Email:" + email);
	console.log("Account Type:" + account_type);

	//check if email is non empty
	if (email === "") {
		return res.status(401).json({ error: " Email cannot be empty." });
	}

	//Only update the account type for the email and keep the rest the same
	const updateSTMT = `UPDATE accounts SET account_type = '${account_type}' WHERE email = '${email}';`;

	try {
		const check = await pool.query(
			`SELECT * FROM accounts WHERE email = '${email}';`
		);
		if (check.rows.length === 0) {
			return res.status(401).json({ error: " Email not found." });
		}
		const response = await pool.query(updateSTMT);
		console.log("User updated");
		console.log(response);
		return res
			.status(200)
			.json({ message: "Update successful", data: req.body });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Internal server error" });
	}
});

// Verify OTP email
app.post("/verifyOTP", async (req, res) => {
	try {
		let { email, otp } = req.body;
		console.log(email);
		console.log(otp);
		if (!email || !otp) {
			throw Error("Empty OTP details are not allowed");
		} else {
			const UserOTPVerificationRecords = await UserOTPVerification.find({
				email: email.toString(),
			});
			if (UserOTPVerificationRecords.length <= 0) {
				throw new Error(
					"Account record doesn't exist or has been verified already. Please sign up or log in."
				);
			} else {
				const { expiresAt } = UserOTPVerificationRecords[0];
				const hashedOTP = UserOTPVerificationRecords[0].otp;
				// const storedEmail = UserOTPVerificationRecords[0].email;

				if (expiresAt < Date.now()) {
					// User OTP record has expired
					await UserOTPVerification.deleteMany({
						email: email.toString(),
					});
					throw new Error("Code has expired. Please request again.");
				} else {
					const validOTP = await bcrypt.compare(otp, hashedOTP);
					if (!validOTP) {
						// OTP given is wrong / invalid
						throw new Error(
							"Invalid verification code given. Check your inbox and submit again."
						);
					} else {
						const updateAuthentication = `UPDATE accounts SET authentication_stats = 'true' WHERE email = '${email}';`;
						const response = await pool.query(updateAuthentication);
						console.log("User updated");
						console.log(response);
						await UserOTPVerification.deleteMany({
							email: email.toString(),
						});
						return res.status(200).json({
							status: "VERIFIED",
							message: "You are now verified!",
							data: req.body,
						});
					}
				}
			}
		}
	} catch (error) {
		console.error(error);
		return res
			.status(500)
			.json({ status: "FAILED", message: error.message });
	}
});

// Resending OTP
app.post("/resendOTPVerificationCode", async (req, res) => {
	try {
		let { email } = req.body;

		if (!email) {
			throw Error("Empty user details are not allowed");
		} else {
			// check if there's even an entry for this email
			const UserOTPVerificationRecords = await UserOTPVerification.find({
				email: email.toString(),
			});
			if (UserOTPVerificationRecords.length <= 0) {
				throw new Error(
					"An existing account with this email address has already been created! Please try with a new email address!"
				);
			}
			// delete existing records and resend
			await UserOTPVerification.deleteMany({ email: email.toString() });
			const selectUserIdQuery = `SELECT user_id FROM accounts WHERE email = '${email}';`;
			const response = await pool.query(selectUserIdQuery);
			const userID = response.rows[0].user_id;
			console.log(response);

			if (response.rowCount === 0) {
				throw Error(
					"Invalid email given. Please check the email you keyed in and resubmit."
				);
			}

			sendOTPVerificationEmail({ _id: userID, email }, res);
			return res.status(200).json({
				status: "RESENT",
				message: "New verification code has been sent to you.",
				data: req.body,
			});
		}
	} catch (error) {
		return res
			.status(500)
			.json({ status: "FAILED", message: error.message });
	}
});

//Fetch user info
app.post('/users/fetch/:id', authenticateToken(['user', 'superuser', 'admin', 'superadmin']), async (req, res) => {
	const user_id = req.params.id; // Use req.params.id to get the user_id from the route parameter
	try {
		const query = `SELECT * FROM accounts WHERE user_id = '${user_id}'`;
		const result = await pool.query(query);
		if (result.rows.length === 1) {
			res.json({
				message: "User found",
				user: result.rows[0],
				tokens: req.body.tokens,
			});
		} else {
			res.status(404).json({ error: 'Account not found' });
		}
	} catch (error) {
		console.error('Error:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
});

// Establish a RabbitMQ connection if it is not already
const createRabbitMQConnection = async () => {
	try {
		if (!connection) {
			connection = await amqp.connect(amqpUrl);
		}
		return connection;
	} catch (error) {
		console.error('Error connecting to RabbitMQ: ', error);
		throw error;
	}
};

// Create a channel in RabbitMQ to establish the waiting and matched queues
const createMatchingChannel = async () => {
	try {
		if (!matchmakingChannel) {
			const connection = await createRabbitMQConnection();
			matchmakingChannel = await connection.createChannel();
			await matchmakingChannel.assertQueue('user_queue', { durable: true });
			await matchmakingChannel.assertQueue('matched_pairs', { durable: true });
			console.log('Matchmaking channel set up successfully');
		}
		return matchmakingChannel;
	} catch (error) {
		console.error('Error setting up matchmaking channel:', error);
	}
};

// Adds users into the waiting queue
const enqueueUser = async (email, difficultyLevel, socketId) => {
	try {
		const channel = await createMatchingChannel();
		const message = JSON.stringify({ email, difficultyLevel, socketId });

		channel.sendToQueue("user_queue", Buffer.from(message), { persistent: true });
		console.log(`User ${email} with socket ID (${socketId}) enqueued with difficulty level ${difficultyLevel}.`);
	} catch (error) {
		console.error('Failed to add user into the waiting queue due to unexpected error: ', error);
	}
}

// Matching service to match users of the same difficulty, upon match add them into the matched queue as a pair and remove them from waiting queue
const matchUsers = async () => {
	try {
		const channel = await createMatchingChannel();
		
		await channel.prefetch(1);

		const difficultyMap = new Map();

		console.log('Waiting for users to match...');

		// Check for users in the waiting queue to match with the same difficulty level
		channel.consume("user_queue", (message) => {
			if (message !== null) {
				const { email, difficultyLevel, socketId } = JSON.parse(message.content.toString());
				// Checks the map for users waiting to get matched based on their difficulty level
				if (difficultyMap.has(difficultyLevel)) {
					const matchingUser = difficultyMap.get(difficultyLevel);

					// Ensures the two users matched are not the same user
					if (matchingUser.email !== email) {
						// Send the two users' information into the matched_pairs queue and remove from waiting queue
						const matchedPair = { Player1: { email: email, difficultyLevel: difficultyLevel, socketId: socketId }, Player2: { email: matchingUser.email, difficultyLevel: matchingUser.difficultyLevel, socketId: matchingUser.socketId } };
						matched_message = JSON.stringify(matchedPair)
						channel.sendToQueue('matched_pairs', Buffer.from(matched_message));
						console.log(matched_message);
						console.log(`Matched user ${email} with user ${matchingUser.email} for difficulty level: ${difficultyLevel}`);
						// Remove the matched user from the map
						difficultyMap.delete(difficultyLevel);
					} else {
						// When the user queues himself/herself up twice in a row with the same difficulty level chosen
						console.log(`User ${email} matched with themselves. Ignoring.`);
					}
				} else {
					// No match found, store the user's info into the difficultyMap based on the difficulty level he/she chose
					difficultyMap.set(difficultyLevel, { email, difficultyLevel, socketId });
				}

				// Remove the user from the waiting queue by acknowledging his/her message
				channel.ack(message);
			}
		})
	} catch (error) {
		console.error('Failed to match any users due to an internal issue: ', error);
	}
}

// Queuing feature to match users that chose the same difficulty level
app.post('/matchmake', async (req, res) => {
	// Upon every matching request, user sends his/her 'email' and 'difficultyLevel' to the waiting queue
	const { email, difficultyLevel, socketId } = req.body; 

	try {
		// Checks for missing email address or difficulty level of the question
		if (!email || !difficultyLevel || !socketId) {
			return res.status(400).json({ error: 'Email, difficultyLevel and socketId are required fields.' });
		}

		// Enqueue the user into the waiting queue
		enqueueUser(email, difficultyLevel, socketId);

		return res.status(200).json({ message: 'User enqueued successfully.' });
	} catch (error) {
		console.error('Error publishing user to waiting queue:', error);
		return res.status(500).json({ error: 'Internal server error' });
	}
});

app.listen(port, () => {
	console.log(`PostgreSQL server running on port ${port}`)
	createMatchingChannel(); // Creates a connection to the Cloud AMQP server (RabbitMQ)
	matchUsers(); // Starts the matching service
});