require("dotenv").config(); //Load env variables

const express = require("express");
const mongoose = require("mongoose");
const questionRoutes = require("./routes/questions");

const { initializeQuestions } = require("./controllers/questionController");
const defaultQuestions = require("./constants/default-questions");

const app = express();
const port = process.env.MONGO_PORT || 27017;

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
		.connect(process.env.MONGO_URI, { // Changed from URL to URI
			useNewUrlParser: true,
			useUnifiedTopology: true,
			serverSelectionTimeoutMS: 5000, // Timeout in milliseconds for server selection
		})
		.then(() => {
			console.log("Connected to MongoDB");
			// Initialize the questions collection with default questions
			initializeQuestions(defaultQuestions);
			// Only start the application server once the database connection is established
			app.listen(port, () => {
				console.log("Listening on port", port);
			});
		})
		.catch((error) => {
			console.log("MongoDB connection error:", error);
			// Retry the connection after a delay (e.g., 5 seconds)
			setTimeout(connectWithRetry, 5000);
		});
};

// Call the connection function to initiate the connection process
connectWithRetry();
