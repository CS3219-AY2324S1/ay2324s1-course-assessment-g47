require("dotenv").config(); //Load env variables

const express = require("express");
const mongoose = require("mongoose");
const questionRoutes = require("./routes/questions");
const routes = require("./routes/routes");

const app = express();

//middleware
app.use(express.json()); //Allows us to use json in the body of the request
app.use((req, res, next) => {
	console.log(req.path, req.method);
	next();
});

//routes
app.use("/api/questions", questionRoutes);
app.use("/api/v1", routes);

// Connect to mongodb
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
