CREATE TABLE IF NOT EXISTS accounts (
    user_id serial PRIMARY KEY,
    username VARCHAR ( 255 ) NOT NULL,
    email VARCHAR ( 255 ) UNIQUE NOT NULL,
    password VARCHAR ( 255 ) NOT NULL,
    account_type VARCHAR ( 255 ) NOT NULL,
    authentication_stats BOOLEAN DEFAULT false
);
