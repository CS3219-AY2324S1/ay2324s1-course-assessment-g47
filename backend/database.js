require("dotenv").config(); // Load environment variables from .env file

//write database code
const { Pool } = require("pg");

const pool = new Pool({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	password: process.env.DB_PASSWORD,
	port: process.env.DB_PORT,
	database: process.env.DB_DATABASE, //Comment out when creating a new database
});

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
// email VARCHAR ( 255 ) UNIQUE NOT NULL,
//     password VARCHAR ( 255 ) NOT NULL,
// 	   account_type VARCHAR ( 255 ) NOT NULL,
//     authentication_stats BOOLEAN DEFAULT false
// 	   );
//     `;

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
// 	   user2_email VARCHAR ( 255 ) NOT NULL,
// 	   room_id VARCHAR ( 255 ) NOT NULL,
//     question_name VARCHAR ( 255 ) NOT NULL,
// 	   question_difficulty VARCHAR ( 255 ) NOT NULL,
// 	   question_category VARCHAR ( 255 ) NOT NULL,
// 	   question_description TEXT NOT NULL,
//     code TEXT NOT NULL,
// 	   timestamp TIMESTAMP NOT NULL
// 	   );
//     `;

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

module.exports = pool;
