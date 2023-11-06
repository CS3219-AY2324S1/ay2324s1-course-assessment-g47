require("dotenv").config(); // Load environment variables from .env file

//write database code
const { Pool } = require("pg");

const pool = new Pool({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	password: process.env.DB_PASSWORD,
	port: process.env.DB_PORT,
});

// CREATE NEW DATABASE IF IT DOESN'T EXIST
const createDatabaseQuery = `
  CREATE DATABASE ${process.env.DB_DATABASE};
`;

pool.query(createDatabaseQuery)
	.then((res) => {
		console.log("Database created or already exists");
	})
	.catch((err) => {
		console.error("Error creating database:", err);
	});

module.exports = pool;
