require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const { connectToPostgres } = require("./database");

const app = express();

// Connect to MongoDB
const connectToMongoDB = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			serverSelectionTimeoutMS: 30000,
		});
		console.log("Connected to MongoDB");
	} catch (err) {
		console.error("MongoDB connection error:", err);
	}
};

// Middleware
app.use(express.json()); // Body parser middleware
app.use(cors({ origin: "http://localhost:3000" })); // CORS middleware (allows requests from other domains)

// Set the Access-Control-Allow-Origin header
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
	next();
});

// Error handler
function errorHandler(err, req, res, next) {
	res.status(500);
	console.log(err);
	res.json({ error: err.message });
}

// Initialize routes
//app.use("/api/users", userRoutes);

app.use(
    "/api/users",
    (req, res, next) => {
        next(); // Continue to the next middleware or route handler
    },
    userRoutes
);


// Start the server
if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'ci') {
	port = 8090;
  } else {
	port = process.env.POSTGRESQLPORT || 8081;
  }
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});

// Connect to MongoDB
connectToMongoDB();

module.exports = app;

