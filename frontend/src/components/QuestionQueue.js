import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./css/QuestionQueue.css";
import * as Constants from "../constants/constants.js";

import io from "socket.io-client";

function QuestionQueue({ user }) {
	const [selectedDifficulty, setSelectedDifficulty] = useState("easy"); // Default difficulty
	const [loading, setLoading] = useState(false); // Loading state
	const [queueStartTime, setQueueStartTime] = useState(null); // Queue start time
	const [elapsedTime, setElapsedTime] = useState(0); // Elapsed time in seconds

	const MATCHING_SERVICE_URL = Constants.MATCHING_SERVICE_URL;

	const navigate = useNavigate();
	const [socketID, setSocketID] = useState(null);

	useEffect(() => {
		const IO_URL = Constants.COLLABORATION_SERVICE_URL;
		const socket = io.connect(`${IO_URL}`); //Connect to backend socket.io server
		socket.on("me", (id) => {
			console.log(
				"Calling socket function `me` to get socketID, socketID:",
				id
			);
			setSocketID(id);
		});

		const handleMatchedSuccessfully = (data) => {
			console.log(
				`User: ${user.username}}Matched successfully: ${data.roomId}`
			);
			console.log("difficultyLevel:", data.difficultyLevel);
			// Redirect to the room page with the roomId when matched successfully
			//navigate(`/room/${data.roomId}`); // Replace `roomId` with the actual room ID
			navigate(`/room/${data.roomId}`, {
				state: {
					difficultyLevel: data.difficultyLevel,
					matchedUsername: data.matchedUsername,
					matchedEmail: data.matchedEmail,
				},
			});
		};

		// Attach the event listener for successful matches
		socket.on("matched-successfully", handleMatchedSuccessfully);

		// Handle timer queue
		let timerInterval;

		if (queueStartTime && loading) {
			// Start a timer to update elapsed time while in the queue
			timerInterval = setInterval(() => {
				const currentTime = new Date().getTime();
				const elapsed = Math.floor(
					(currentTime - queueStartTime) / 1000
				);
				setElapsedTime(elapsed);
			}, 1000);
		} else {
			// Clear the timer interval when not in the queue
			clearInterval(timerInterval);
		}

		return () => {
			// Clean up the event listener when the component unmounts
			//socket.off('matched-successfully', handleMatchedSuccessfully);
			// Clear the timer interval when the component unmounts
			clearInterval(timerInterval);
		};
	}, [navigate, user, queueStartTime, loading]); // Listen to changes in the history object

	const handleDifficultyChange = (e) => {
		setSelectedDifficulty(e.target.value);
	};

	const handleJoinQueue = async () => {
		setLoading(true); // Set loading state to true
		setQueueStartTime(new Date().getTime()); // Record queue start time
		console.log(`User: ${user}, SocketId: ${socketID}`);
		// if (socketID === null) {
		//   socket.on("me", (id) => {
		//     console.log("Calling socket function `me` to get socketID, socketID:", id);
		//     setSocketID(id);
		//   });
		// }

		try {
			console.log(`SocketId: ${socketID}`);
			const response = await fetch(`${MATCHING_SERVICE_URL}/matchmake`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username: user.username,
					email: user.email, // Change this to the user's email
					difficultyLevel: selectedDifficulty,
					socketId: socketID, // Change this to the user's socket ID
				}),
			});

			if (response.status === 200) {
				// User successfully enqueued
				console.log("User enqueued successfully.");
			} else {
				// Handle error cases here
				console.error("Failed to enqueue user.");
				console.error(response);
				setLoading(false);
			}
		} catch (error) {
			console.error("Error enqueueing user:", error);
			setLoading(false);
		}
	};

	// Function to allow the user to exit the queue
	const handleExitQueue = async () => {
		setLoading(false); // Stop loading
		setQueueStartTime(null); // Reset queue start time
		setElapsedTime(0); // Reset elapsed time

		try {
			const response = await fetch(`${MATCHING_SERVICE_URL}/exitqueue`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username: user.username,
					email: user.email, // Change this to the user's email
					difficultyLevel: selectedDifficulty,
					socketId: socketID, // Change this to the user's socket ID
				}),
			});

			if (response.status === 200) {
				// User successfully exited the queue
				console.log("User exited the queue successfully.");
			} else {
				// Handle error cases here
				console.error("Failed to exit the queue.");
				console.error(response);
			}
		} catch (error) {
			console.error("Error exiting the queue:", error);
		}
	};

	return (
		<div className="question-queue">
			<h2>Question Queue</h2>
			<div>
				<label>Select Difficulty:</label>
				<select
					value={selectedDifficulty}
					onChange={handleDifficultyChange}
					disabled={loading}
					className="difficulty-select"
				>
					<option value="easy">Easy</option>
					<option value="medium">Medium</option>
					<option value="hard">Hard</option>
				</select>
				{loading ? (
					<p className="difficulty-prompt">
						Please exit the queue to change the difficulty.
					</p>
				) : null}
			</div>
			<div>
				{loading ? (
					<div>
						<div className="timer">
							<p className="timer-text">
								{formatElapsedTime(elapsedTime)}
							</p>
							<p className="waiting-text">
								Waiting in queue for {selectedDifficulty}{" "}
								difficulty...
							</p>
						</div>
						<button onClick={handleExitQueue}>Exit Queue</button>
					</div>
				) : (
					<button onClick={handleJoinQueue}>Join Queue</button>
				)}
			</div>
		</div>
	);
}

export default QuestionQueue;

// Function to format the queue timer
function formatElapsedTime(seconds) {
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const remainingSeconds = seconds % 60;

	if (hours > 0) {
		// Display hours only if elapsed time is greater than 60 minutes
		return `${hours}:${padWithZero(minutes)}:${padWithZero(
			remainingSeconds
		)}`;
	} else {
		return `${padWithZero(minutes)}:${padWithZero(remainingSeconds)}`;
	}
}
function padWithZero(number) {
	return number.toString().padStart(2, "0");
}
