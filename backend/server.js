require("dotenv").config(); //Load env variables

const express = require("express");
const mongoose = require("mongoose");
const questionRoutes = require("./routes/questions");

const app = express();

//middleware
app.use(express.json()); //Allows us to use json in the body of the request
app.use((req, res, next) => {
	console.log(req.path, req.method);
	next();
});

//routes
app.use("/api/questions", questionRoutes);

// Define an async function to handle database connection and start the server
async function startServer() {
	try {
		if (process.env.NODE_ENV === 'test') {
		console.log('Using Mock DB!');
		const { MongoMemoryServer } = require('mongodb-memory-server');
		const mongoServer = await MongoMemoryServer.create();
		await mongoose.connect(mongoServer.getUri(), { dbName: "test-db" });
		} else if (process.env.NODE_ENV === 'ci') {
		console.log('Using MongoDB with GitHub Actions!');
		await mongoose.connect('mongodb://127.0.0.1:27017/test-db');
		} else {
		const con = await mongoose.connect(process.env.MONGO_URI);
		console.log(`MongoDB Connected: ${con.connection.host}`);
		}

		// Start the Express app after successful connection
		app.listen(process.env.PORT, () => {
		console.log("Listening on port", process.env.PORT);
		});
	} catch (error) {
	  console.error(error);
	  process.exit(1);
	}
  }
  
  // Call the async function to start the server
  startServer();

module.exports = app;