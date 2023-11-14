require("dotenv").config();
const cors = require("cors");
const express = require("express");
const amqp = require("amqplib");

const { v4: uuidv4 } = require("uuid");
const port = process.env.MATCHING_SERVICE_PORT || 8083;
// const socketIO = process.env.SOCKET_IO_URL;

const amqpUrl = process.env.AMQP_URL;

// Create a global variable to store the RabbitMQ connection
let connection;

// Create a global variable to store the RabbitMQ channel
let matchmakingChannel;

// Create a new Map to aid in matching different Difficulty Levels
const difficultyMap = new Map();

const app = express(); //Start up express app

app.use(express.json()); // Body parser middleware
app.use(cors({ origin: "http://localhost:3000" })); // CORS middleware (allows requests from other domains)

// Set the Access-Control-Allow-Origin header
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
	next();
});

// Establish a RabbitMQ connection if it is not already
const createRabbitMQConnection = async () => {
	try {
		if (!connection) {
			connection = await amqp.connect(amqpUrl);
		}
		return connection;
	} catch (error) {
		console.error("Error connecting to RabbitMQ: ", error);
		throw error;
	}
};

// Create a channel in RabbitMQ to establish the waiting and matched queues
const createMatchingChannel = async () => {
	try {
		if (!matchmakingChannel) {
			const connection = await createRabbitMQConnection();
			matchmakingChannel = await connection.createChannel();
			await matchmakingChannel.assertQueue("user_queue", {
				durable: true,
			});
			await matchmakingChannel.assertQueue("matched_pairs", {
				durable: true,
			});
			console.log("Matchmaking channel set up successfully");
		}
		return matchmakingChannel;
	} catch (error) {
		console.error("Error setting up matchmaking channel:", error);
	}
};

// Adds users into the waiting queue
const enqueueUser = async (username, email, difficultyLevel, socketId) => {
	try {
		const channel = await createMatchingChannel();
		const message = JSON.stringify({
			username,
			email,
			difficultyLevel,
			socketId,
		});

		channel.sendToQueue("user_queue", Buffer.from(message), {
			persistent: true,
		});
		console.log(
			`${username} with email ${email} with socket ID (${socketId}) enqueued with difficulty level ${difficultyLevel}.`
		);
	} catch (error) {
		console.error(
			"Failed to add user into the waiting queue due to unexpected error: ",
			error
		);
	}
};

// Function to remove a user from the "user_queue" by email
const dequeueUserByEmail = async (email, difficultyLevel) => {
	console.log(`Removing user ${email} from the waiting queue...`);
	try {
		if (difficultyMap.has(difficultyLevel)) {
			console.log(difficultyMap);
			difficultyMap.delete(difficultyLevel);
			console.log(
				`User ${email} has been dequeued from the waiting queue.`
			);
			console.log(difficultyMap);
		}
	} catch (error) {
		console.error(
			"Failed to remove user by email due to an internal issue: ",
			error
		);
	}
};
const rooms = {}; // Store rooms and their participants

// Matching service to match users of the same difficulty, upon match add them into the matched queue as a pair and remove them from waiting queue
const matchUsers = async () => {
	try {
		const channel = await createMatchingChannel();

		await channel.prefetch(1);

		console.log("Waiting for users to match...");

		// Check for users in the waiting queue to match with the same difficulty level
		channel.consume("user_queue", (message) => {
			if (message !== null) {
				const { username, email, difficultyLevel, socketId } =
					JSON.parse(message.content.toString());
				const deliveryTag = message.fields.deliveryTag;
				console.log(deliveryTag);
				// Checks the map for users waiting to get matched based on their difficulty level
				if (difficultyMap.has(difficultyLevel)) {
					const matchingUser = difficultyMap.get(difficultyLevel);

					// Ensures the two users matched are not the same user
					if (matchingUser.email !== email) {
						// Send the two users' information into the matched_pairs queue and remove from waiting queue
						const matchedPair = {
							Player1: {
								username: username,
								email: email,
								difficultyLevel: difficultyLevel,
								socketId: socketId,
							},
							Player2: {
								username: matchingUser.username,
								email: matchingUser.email,
								difficultyLevel: matchingUser.difficultyLevel,
								socketId: matchingUser.socketId,
							},
						};
						matched_message = JSON.stringify(matchedPair);
						channel.sendToQueue(
							"matched_pairs",
							Buffer.from(matched_message)
						);
						console.log("MATCHED_MESSAGE" + matched_message);
						console.log(
							`Matched user ${email} with user ${matchingUser.email} for difficulty level: ${difficultyLevel}`
						);

						const roomId = uuidv4(); // Implement a function to generate a unique roomId
						rooms[roomId] = [email, matchingUser.email]; // Store the matched users in the room

						// Notify the matched users with the roomId
						//socketIO.io.to(socketId).emit("matched-successfully", {roomId: roomId, socketId: socketId, difficultyLevel: difficultyLevel, matchedUsername: matchingUser.email});
						//socketIO.io.to(matchingUser.socketId).emit("matched-successfully", {roomId: roomId, socketId: matchingUser.socketId, difficultyLevel: difficultyLevel, matchedUsername: email});

						// Remove the matched user from the map
						difficultyMap.delete(difficultyLevel);
					} else {
						// When the user queues himself/herself up twice in a row with the same difficulty level chosen
						console.log(
							`User ${email} matched with themselves. Ignoring.`
						);
					}
				} else {
					// No match found, store the user's info into the difficultyMap based on the difficulty level he/she chose
					difficultyMap.set(difficultyLevel, {
						deliveryTag,
						username,
						email,
						difficultyLevel,
						socketId,
					});
				}

				// Remove the user from the waiting queue by acknowledging his/her message
				channel.ack(message);
			}
		});
	} catch (error) {
		console.error(
			"Failed to match any users due to an internal issue: ",
			error
		);
	}
};

// Queuing feature to match users that chose the same difficulty level
app.post("/api/matching/matchmake", async (req, res) => {
	console.log("Matchmake request received");
	// Upon every matching request, user sends his/her 'email' and 'difficultyLevel' to the waiting queue
	const { username, email, difficultyLevel, socketId } = req.body;

	// console.log(username);
	// console.log(email);
	// console.log(difficultyLevel);
	// console.log(socketId);
	try {
		// Checks for missing email address or difficulty level of the question
		if (!email || !difficultyLevel || !socketId) {
			return res.status(400).json({
				error: "Email, difficultyLevel and socketId are required fields.",
			});
		}

		// Enqueue the user into the waiting queue
		enqueueUser(username, email, difficultyLevel, socketId);
		return res.status(200).json({ message: "User enqueued successfully." });
	} catch (error) {
		console.error("Error publishing user to waiting queue:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
});

// Endpoint for users to exit the queue
app.post("/api/matching/exitqueue", async (req, res) => {
	console.log("Exit queue request received");
	const { username, difficultyLevel, email, socketId } = req.body;

	try {
		// Checks for missing email or socketId
		if (!email || !socketId) {
			return res
				.status(400)
				.json({ error: "Email and socketId are required fields." });
		}

		// Remove the user from the queue (you'll need to implement a function to do this)
		dequeueUserByEmail(email, difficultyLevel);

		console.log(
			`${username} with email ${email} with socket ID (${socketId}) has exited the queue.`
		);
		return res
			.status(200)
			.json({ message: "User exited the queue successfully." });
	} catch (error) {
		console.error("Error exiting the queue:", error);
		return res.status(500).json({ error: "Internal server error" });
	}
});

app.listen(port, () => {
	console.log(`Matchmaking service running on port ${port}`);
	createMatchingChannel(); // Creates a connection to the Cloud AMQP server (RabbitMQ)
	matchUsers(); // Starts the matching service
});
