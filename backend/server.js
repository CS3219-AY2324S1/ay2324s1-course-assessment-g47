require("dotenv").config(); //Load env variables

const express = require("express");
const mongoose = require("mongoose");
const questionRoutes = require("./routes/questions");

const app = express(); //Start up express app

//middleware
app.use(express.json()); //Allows us to use json in the body of the request
app.use((req, res, next) => {
	console.log(req.path, req.method);
	next();
});

//routes
app.use("/api/questions", questionRoutes); //Grabs all the routes from the questions.js file
//The routes will only be used if the path starts with /api/questions

// connect to mongodb
mongoose
	.connect(process.env.MONGO_URI)
	.then(() => {
		// only listen for requests when we are connected to the database
		app.listen(process.env.PORT, (req, res) => {
			console.log("Listining on port", process.env.PORT);
		});
	})
	.catch((error) => {
		console.log(error);
	});
