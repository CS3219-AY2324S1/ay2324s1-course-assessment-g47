require("dotenv").config(); // Load environment variables from .env file
const { Pool } = require("pg");
const { newDb } = require("pg-mem");
const bcrypt = require("bcrypt");

let pool;

if (process.env.NODE_ENV === "test" || process.env.NODE_ENV === "ci") {
	// Use pg-mem for testing
	const { Client } = newDb().adapters.createPg();
	const pgMemDb = new Client();
	pool = {
		query: (text, params) => pgMemDb.query(text, params),
		end: () => pgMemDb.cleanup(),
	};
	console.log("Connected to pg-mem for testing");
} else {
	// Connect to the actual PostgreSQL database
	pool = new Pool({
		user: process.env.DB_USER,
		host: process.env.DB_HOST,
		password: process.env.DB_PASSWORD,
		port: process.env.DB_PORT,
		database: process.env.DB_DATABASE,
	});
	console.log("Connected to PostgreSQL");
}

// CREATE TABLE IF NOT EXISTS
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS accounts (
    user_id serial PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    account_type VARCHAR(255) NOT NULL,
    authentication_stats BOOLEAN DEFAULT false
  );
`;

pool.query(createTableQuery)
	.then((res) => {
		console.log("Table created or already exists");
		// Add multiple rows to the table after the table is created
		addMultipleRowsToAccountsTable();
	})
	.catch((err) => {
		console.error("Error creating table:", err);
	});

// Function to add multiple rows to the "accounts" table
async function addMultipleRowsToAccountsTable() {
	const insertRowsQuery = `
    INSERT INTO accounts (username, email, password, account_type, authentication_stats)
    VALUES 
      ($1, $2, $3, $4, $5),
      ($6, $7, $8, $9, $10),
      ($11, $12, $13, $14, $15),
      ($16, $17, $18, $19, $20)
    RETURNING *;
  `;

	const hashedPasswords = await Promise.all([
		bcrypt.hash("123456", 10),
		bcrypt.hash("123456", 10),
		bcrypt.hash("123456", 10),
		bcrypt.hash("123456", 10),
	]);

	const values = [
		"User",
		"user@example.com",
		hashedPasswords[0],
		"user",
		true,
		"Superuser",
		"superuser@example.com",
		hashedPasswords[1],
		"superuser",
		true,
		"Admin",
		"admin@example.com",
		hashedPasswords[2],
		"admin",
		true,
		"Superadmin",
		"superadmin@example.com",
		hashedPasswords[3],
		"superadmin",
		true,
	];

	pool.query(insertRowsQuery, values)
		.then((res) => {
			console.log(`${res.rowCount} rows added to the accounts table`);
			console.log("Added rows:", res.rows);
		})
		.catch((err) => {
			if (
				err.code === "23505" &&
				err.constraint === "accounts_email_key"
			) {
				console.error("Email created or already exists");
			} else {
				console.error("Error adding rows to the accounts table:", err);
			}
		})
		.finally(() => {});
}

// Create the code_attempts table if it doesn't exist
const createCodeAttemptsTableQuery = `
  CREATE TABLE IF NOT EXISTS code_attempts (
    attempt_id serial PRIMARY KEY,
    user1_email VARCHAR(255) NOT NULL,
    user2_email VARCHAR(255) NOT NULL,
    room_id VARCHAR(255) NOT NULL,
    timestamp VARCHAR ( 255 ) NOT NULL,
    language VARCHAR(255) NOT NULL,
    question_name VARCHAR(255) NOT NULL,
    question_difficulty VARCHAR(255) NOT NULL,
    question_category VARCHAR(255) NOT NULL,
    question_created_timestamp TIMESTAMP NOT NULL,
    question_updated_timestamp TIMESTAMP NOT NULL,
    code TEXT NOT NULL,
    question_description TEXT NOT NULL
  );
`;

pool.query(createCodeAttemptsTableQuery)
	.then((res) => {
		console.log("Code attempts table created or already exists.");
	})
	.catch((err) => {
		console.error("Error creating code attempts table:", err);
	});

module.exports = pool;
