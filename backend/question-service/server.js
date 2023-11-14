require("dotenv").config(); //Load env variables

const express = require("express");
const mongoose = require("mongoose");
const questionRoutes = require("./routes/questions");

const { initializeQuestions } = require("./controllers/questionController");
const defaultQuestions = require("./constants/default-questions");

const app = express();
const PORT = process.env.MONGO_PORT || 8082;

//middleware
app.use(express.json()); //Allows us to use json in the body of the request
app.use((req, res, next) => {
	console.log(req.path, req.method);
	next();
});

//routes
// app.use("/api/questions", questionRoutes);
app.use(
	"/api/questions",
	(req, res, next) => {
		console.log("MANAGED TO CONNECT TO QUESTIONS"); // Log "test" when a request reaches this middleware
		next(); // Continue to the next middleware or route handler
	},
	questionRoutes
);

// Connect to mongodb
const connectWithRetry = () => {
	mongoose
		.connect(process.env.MONGO_URI, {
			// Changed from URL to URI
			useNewUrlParser: true,
			useUnifiedTopology: true,
			serverSelectionTimeoutMS: 5000, // Timeout in milliseconds for server selection
		})
		.then(() => {
			console.log("Connected to MongoDB");
			// Initialize the questions collection with default questions
			initializeQuestions(defaultQuestions);
			// Only start the application server once the database connection is established
			app.listen(PORT, () => {
				console.log("Listening on port", PORT);
			});
		})
		.catch((error) => {
			console.log("MongoDB connection error:", error);
			// Retry the connection after a delay (e.g., 5 seconds)
			setTimeout(connectWithRetry, 5000);
		});
};

// Define an async function to handle database connection and start the server
async function startServer() {
	try {
		if (process.env.NODE_ENV === 'test') {
			console.log('Using Mock DB!');
			const { MongoMemoryServer } = require('mongodb-memory-server');
			const mongoServer = await MongoMemoryServer.create();
			await mongoose.connect(mongoServer.getUri(), { dbName: "test-db" });
			// Start the Express app after successful connection
			app.listen(8091, () => {
				console.log("Listening on port", 8091);
				});
		} else if (process.env.NODE_ENV === 'ci') {
			console.log('Using MongoDB with GitHub Actions!');
			await mongoose.connect('mongodb://127.0.0.1:27017/test-db');
			// Start the Express app after successful connection
			app.listen(8092, () => {
				console.log("Listening on port", 8092);
				});
		} else {
			// Call the connection function to initiate the connection process
			connectWithRetry();
		}
	} catch (error) {
	  console.error(error);
	  process.exit(1);
	}
  }
  
  // Call the async function to start the server
  startServer();

module.exports = app;

