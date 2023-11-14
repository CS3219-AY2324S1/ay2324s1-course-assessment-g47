require("dotenv").config(); // Load environment variables from .env file
const { Pool } = require("pg");
const { newDb } = require("pg-mem");

let pool;

if (process.env.NODE_ENV === "test" || process.env.NODE_ENV === 'ci') {
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

module.exports = pool;

// // // CREATE NEW DATABASE
// // pool.query("CREATE DATABASE cs3219_g47;")
// // 	.then((res) => {
// // 		console.log("Database created");
// // 		console.log(res);
// // 		// pool.end();
// // 	})
// // 	.catch((err) => {
// // 		console.log(err);
// // 		// pool.end();
// // 	});

// CREATE TABLE
// const createTblQry = `CREATE TABLE accounts (
//     user_id serial PRIMARY KEY,
//     username VARCHAR ( 255 ) NOT NULL,
// 	   email VARCHAR ( 255 ) UNIQUE NOT NULL,
//     password VARCHAR ( 255 ) NOT NULL,
// 	   account_type VARCHAR ( 255 ) NOT NULL,
//     authentication_stats BOOLEAN DEFAULT false
// 	   );
// `;

// pool.query(createTblQry)
// 	.then((res) => {
// 		console.log("Table created");
// 		console.log(res);
// 		// pool.end();
// 	})
// 	.catch((err) => {
// 		console.log(err);
// 		// pool.end();
// 	});

// CREATE TABLE
// const createTblQry = `CREATE TABLE code_attempts (
//     attempt_id serial PRIMARY KEY,
//     user1_email VARCHAR ( 255 ) NOT NULL,
// 	user2_email VARCHAR ( 255 ) NOT NULL,
// 	room_id VARCHAR ( 255 ) NOT NULL,
//     timestamp VARCHAR ( 255 ) NOT NULL,
// 	   language VARCHAR ( 255 ) NOT NULL,
//     question_name VARCHAR ( 255 ) NOT NULL,
// 	question_difficulty VARCHAR ( 255 ) NOT NULL,
// 	question_category VARCHAR ( 255 ) NOT NULL,
// 	question_created_timestamp TIMESTAMP NOT NULL,
//  question_updated_timestamp TIMESTAMP NOT NULL,
//     code TEXT NOT NULL,
// 	question_description TEXT NOT NULL
// 	);
// `;

// pool.query(createTblQry)
// 	.then((res) => {
// 		console.log("Table created");
// 		console.log(res);
// 		// pool.end();
// 	})
// 	.catch((err) => {
// 		console.log(err);
// 		// pool.end();
// 	});

// module.exports = pool;

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