const { Pool } = require("pg");
const bcrypt = require("bcrypt");
require("dotenv").config(); // Load environment variables from .env file

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
});

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
    bcrypt.hash('123456', 10),
    bcrypt.hash('123456', 10),
    bcrypt.hash('123456', 10),
    bcrypt.hash('123456', 10),
  ]);

  const values = [
    'User', 'user@example.com', hashedPasswords[0], 'user', true,
    'Superuser', 'superuser@example.com', hashedPasswords[1], 'superuser', true,
    'Admin', 'admin@example.com', hashedPasswords[2], 'admin', true,
    'Superadmin', 'superadmin@example.com', hashedPasswords[3], 'superadmin', true,
  ];

  pool.query(insertRowsQuery, values)
  .then((res) => {
	console.log(`${res.rowCount} rows added to the accounts table`);
	console.log("Added rows:", res.rows);
  })
  .catch((err) => {
	if (err.code === '23505' && err.constraint === 'accounts_email_key') {
	  console.error("Email created or already exists");
	} else {
	  console.error("Error adding rows to the accounts table:", err);
	}
  })
  .finally(() => {

  });
}

// module.exports = pool;
