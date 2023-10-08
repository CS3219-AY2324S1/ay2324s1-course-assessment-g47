-- -- Create the database if it doesn't exist
-- CREATE DATABASE IF NOT EXISTS cs3219_g47;

-- Connect to the cs3219_g47 database
-- \c cs3219_g47;

-- Create the 'accounts' table if it doesn't exist
CREATE TABLE IF NOT EXISTS accounts (
    user_id serial PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    account_type VARCHAR(255) NOT NULL,
    authentication_stats BOOLEAN DEFAULT false
);

-- -- Insert a test record to verify initialization
-- INSERT INTO accounts (username, email, password, account_type)
-- VALUES ('testuser', 'test@example.com', 'password123', 'standard');
