import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./css/QuestionQueue.css";
import io from "socket.io-client";

function QuestionQueue({ user }) {
	const [selectedDifficulty, setSelectedDifficulty] = useState("easy"); // Default difficulty
	const [loading, setLoading] = useState(false); // Loading state
	const [queueStartTime, setQueueStartTime] = useState(null); // Queue start time
	const [elapsedTime, setElapsedTime] = useState(0); // Elapsed time in seconds
	const [noMatchFound, setNoMatchFound] = useState(false); // Checks if user has gotten a match within a certain time

	const navigate = useNavigate();
	const [socketID, setSocketID] = useState(null);

	// Handle timer queue
	let timerInterval;

	useEffect(() => {
		const socket = io({
			path: "/api/collaboration/socket.io",
		});
		console.log("Socket connected to:", socket.io.uri);
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

		if (queueStartTime && loading) {
			// Start a timer to update elapsed time while in the queue
			timerInterval = setInterval(() => {
				const currentTime = new Date().getTime();
				const elapsed = Math.floor(
					(currentTime - queueStartTime) / 1000
				);
				setElapsedTime(elapsed);
				if (selectedDifficulty === "easy") {
					console.log("Time in Queue: ", elapsed);
					if (elapsed >= 30) {
						setNoMatchFound(true);
						handleExitQueue();
						clearInterval(timerInterval);
					}
				} else if (selectedDifficulty === "medium") {
					console.log("Time in Queue: ", elapsed);
					if (elapsed >= 45) {
						setNoMatchFound(true);
						handleExitQueue();
						clearInterval(timerInterval);
					}
				} else {
					console.log("Time in Queue: ", elapsed);
					if (elapsed >= 60) {
						setNoMatchFound(true);
						handleExitQueue();
						clearInterval(timerInterval);
					}
				}
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
			const response = await fetch(`/api/matching/matchmake`, {
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
		clearInterval(timerInterval);

		try {
			const response = await fetch(`/api/matching/exitqueue`, {
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
		<div className="container-fluid " style={{ minWidth: "200px" }}>
			<div className="card m-1 rounded-4">
				<div className="card-body bg-light rounded-4">
					<h2 className="card-title text-dark">Find your match!</h2>
					<form>
						{!loading && !noMatchFound ? (
							<div className="mb-3">
								<label
									htmlFor="difficulty-select"
									className="form-label"
								>
									Select Difficulty:
								</label>
								<select
									id="difficulty-select"
									className="form-select"
									value={selectedDifficulty}
									onChange={handleDifficultyChange}
									disabled={loading}
								>
									<option value="easy">Easy</option>
									<option value="medium">Medium</option>
									<option value="hard">Hard</option>
								</select>
							</div>
						) : (
							<></>
						)}
						<div>
							{loading ? (
								<div>
									<div className="timer mb-3">
										<p className="timer-text fs-2">
											{formatElapsedTime(elapsedTime)}
										</p>
										<p className="waiting-text">
											Waiting in queue for{" "}
											{selectedDifficulty} difficulty...
										</p>
									</div>
									<button
										type="button"
										className="btn btn-danger"
										onClick={handleExitQueue}
									>
										Exit Queue
									</button>
								</div>
							) : (
								!noMatchFound && (
									<button
										type="button"
										className="btn btn-success"
										onClick={handleJoinQueue}
									>
										Join Queue
									</button>
								)
							)}
							{noMatchFound && (
								<div>
									<div className="no-match-popup">
										<p>
											No match found, please requeue or
											select another difficulty.
										</p>
									</div>
									<button
										onClick={() => setNoMatchFound(false)}
									>
										Close
									</button>
								</div>
							)}
						</div>
					</form>
				</div>
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
