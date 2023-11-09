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

-- Enable the pgcrypto extension if it's not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- -- Insert a test record to verify initialization
INSERT INTO accounts (username, email, password, account_type, authentication_stats)
VALUES ('User', 'user@example.com', crypt('123456', gen_salt('bf', 10)::text), 'user', true),
       ('Superuser', 'superuser@example.com', crypt('123456', gen_salt('bf', 10)::text), 'superuser', true),
       ('Admin', 'admin@example.com', crypt('123456', gen_salt('bf', 10)::text), 'admin', true),
       ('Superadmin', 'superadmin@example.com', crypt('123456', gen_salt('bf', 10)::text), 'superadmin', true)
ON CONFLICT (email) DO NOTHING;
