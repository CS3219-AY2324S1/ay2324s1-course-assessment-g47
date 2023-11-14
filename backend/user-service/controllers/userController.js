const bcrypt = require("bcrypt");
const pool = require("../database"); // Import your database connection
const otpModel = require("../models/UserOTPVerification");
const { jwtTokens } = require("../utils/jwt-helpers");
const nodemailer = require("nodemailer");

let id_counter = 0;

// Nodemailer stuff
const { AUTH_EMAIL, AUTH_PASS } = process.env;
let transporter = nodemailer.createTransport({
	host: "smtp-mail.outlook.com",
	auth: {
		user: AUTH_EMAIL,
		pass: AUTH_PASS,
	},
});

const registerUser = async function (req, res) {
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

		res.end();
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: err.message });
	}
};

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
			const UserOTPVerificationRecords = await otpModel.find({
				email: email.toString(),
			});
			if (UserOTPVerificationRecords.length > 0) {
				throw new Error(
					"An existing account with this email address has already been created! Please try with a new email address!"
				);
			}
			const newOTPVerification = new otpModel({
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

const loginUser = async function (req, res) {
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
};

const updateUserById = async function (req, res) {
	const id = req.params.id;
	const { username, email } = req.body;

	console.log("User ID: " + id);
	console.log("Username: " + username);
	console.log("Email: " + email);

	// Construct the UPDATE query with the ID in the WHERE clause
	const updateSTMT =
		"UPDATE accounts SET username = $1, email = $2 WHERE user_id = $3";

	try {
		const response = await pool.query(updateSTMT, [username, email, id]);
		console.log("User updated");
		console.log(response);

		return res
			.status(200)
			.json({ message: "User updated successful", data: req.body });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Internal server error" });
	}
};

const updatePasswordByEmail = async function (req, res) {
	console.log("Update password");
	const { email, password } = req.body;
	const hashedPassword = await bcrypt.hash(password, 10);

	console.log("Password: " + hashedPassword);
	console.log("Email: " + email);

	const updateSTMT = "UPDATE accounts SET password = $1 WHERE email = $2";

	try {
		const response = await pool.query(updateSTMT, [hashedPassword, email]);
		console.log("User updated");
		console.log(response);

		return res.status(200).json({
			message: "Update password successful",
			data: req.body,
		});
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Internal server error" });
	}
};

const deleteUserByEmail = async function (req, res) {
	const email = req.body.email;

	console.log("Email: " + email);

	const deleteSTMT = "DELETE FROM accounts WHERE email = $1";

	try {
		const response = await pool.query(deleteSTMT, [email]);
		console.log("User deleted");
		console.log(response);

		return res
			.status(200)
			.json({ message: "Deleted successful", data: req.body });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Internal server error" });
	}
};

const updateAccountTypeByEmail = async function (req, res) {
	const email = req.body.email;
	const account_type = req.body.account_type;

	console.log("Email: " + email);
	console.log("Account Type: " + account_type);

	// Check if email is non-empty
	if (!email) {
		return res.status(401).json({ error: "Email cannot be empty." });
	}

	// Only update the account type for the email and keep the rest the same
	const updateSTMT = "UPDATE accounts SET account_type = $1 WHERE email = $2";

	try {
		const check = await pool.query(
			"SELECT * FROM accounts WHERE email = $1",
			[email]
		);
		if (check.rows.length === 0) {
			return res.status(401).json({ error: "Email not found." });
		}

		const response = await pool.query(updateSTMT, [account_type, email]);
		console.log("User updated");
		console.log(response);

		return res
			.status(200)
			.json({ message: "Update successful", data: req.body });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Internal server error" });
	}
};

const verifyOTP = async function (req, res) {
	try {
		const { email, otp } = req.body;
		console.log(email);
		console.log(otp);

		if (!email || !otp) {
			throw new Error("Empty OTP details are not allowed");
		} else {
			const UserOTPVerificationRecords = await otpModel.find({
				email: email.toString(),
			});

			if (UserOTPVerificationRecords.length <= 0) {
				throw new Error(
					"Account record doesn't exist or has been verified already. Please sign up or log in."
				);
			} else {
				const { expiresAt } = UserOTPVerificationRecords[0];
				const hashedOTP = UserOTPVerificationRecords[0].otp;

				if (expiresAt < Date.now()) {
					// User OTP record has expired
					await otpModel.deleteMany({
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
						const updateAuthentication =
							"UPDATE accounts SET authentication_stats = $1 WHERE email = $2";
						const response = await pool.query(
							updateAuthentication,
							["true", email]
						);
						console.log("User updated");
						console.log(response);

						await otpModel.deleteMany({
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
};

const resendOTPVerificationCode = async function (req, res) {
	try {
		const { email } = req.body;

		if (!email) {
			throw Error("Empty user details are not allowed");
		} else {
			// Check if there's even an entry for this email
			const UserOTPVerificationRecords = await otpModel.find({
				email: email.toString(),
			});

			if (UserOTPVerificationRecords.length <= 0) {
				throw new Error(
					"An existing account with this email address has already been created! Please try with a new email address."
				);
			}
			// Delete existing records and resend
			await otpModel.deleteMany({ email: email.toString() });

			const selectUserIdQuery =
				"SELECT user_id FROM accounts WHERE email = $1;";
			const response = await pool.query(selectUserIdQuery, [email]);
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
};

const fetchUserInfo = async function (req, res) {
	const user_id = req.params.id; // Use req.params.id to get the user_id from the route parameter

	try {
		const query = "SELECT * FROM accounts WHERE user_id = $1";
		const result = await pool.query(query, [user_id]);

		if (result.rows.length === 1) {
			res.json({
				message: "User found",
				user: result.rows[0],
				tokens: req.body.tokens, // Assuming you need to include tokens in the response
			});
		} else {
			res.status(404).json({ error: "Account not found" });
		}
	} catch (error) {
		console.error("Error:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

const fetchUserEmail = async function (req, res) {
	const email = req.body.email;

	try {
		const query = "SELECT username FROM accounts WHERE email = $1";
		const result = await pool.query(query, [email]);

		if (result.rows.length === 1) {
			res.json({
				message: "User found",
				user: result.rows[0],
				tokens: req.body.tokens, // Assuming you need to include tokens in the response
			});
		} else {
			res.status(404).json({ error: "Account not found" });
		}
	} catch (error) {
		console.error("Error:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

const fetchUserHistory = async function (req, res) {
	const user_email = req.body.email;

	try {
		const historyQuery = `
        SELECT *
        FROM code_attempts
        WHERE (
          user1_email = $1 OR user2_email = $1
        );
      `;
		const result = await pool.query(historyQuery, [user_email]);

		if (result.rows.length === 0) {
			return res.status(200).json({ message: "No history found." });
		} else {
			return res.status(200).json({
				message: "Found User's History!",
				data: result,
			});
		}
	} catch (error) {
		console.error("Error:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
};

module.exports = {
	registerUser,
	loginUser,
	updateUserById,
	updatePasswordByEmail,
	deleteUserByEmail,
	updateAccountTypeByEmail,
	verifyOTP,
	resendOTPVerificationCode,
	fetchUserInfo,
	fetchUserEmail,
	fetchUserHistory
};
