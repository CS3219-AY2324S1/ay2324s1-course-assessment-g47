import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


import io from "socket.io-client";
const IO_PORT = 4002;
const socket = io.connect(`http://localhost:${IO_PORT}`); //Connect to backend socket.io server


function QuestionQueue({ user }) {
  const [selectedDifficulty, setSelectedDifficulty] = useState('easy'); // Default difficulty
  const navigate = useNavigate();
  const [socketID, setSocketID] = useState(null);

  useEffect( () => {
    socket.on("me", (id) => {
        console.log("Calling socket function `me` to get socketID, socketID:", id);
        setSocketID(id);
    });
      
    const handleMatchedSuccessfully = (roomId) => {
        console.log(`User: ${user.username}}Matched successfully: ${roomId}`);
      // Redirect to the room page with the roomId when matched successfully
      navigate(`/room/${roomId}`); // Replace `roomId` with the actual room ID
    };

    // Attach the event listener for successful matches
    socket.on('matched-successfully', handleMatchedSuccessfully);

    return () => {
      // Clean up the event listener when the component unmounts
      socket.off('matched-successfully', handleMatchedSuccessfully);
    };
  }, [navigate ,user]); // Listen to changes in the history object


  const handleDifficultyChange = (e) => {
    setSelectedDifficulty(e.target.value);
  };
  

  const handleJoinQueue = async () => {

    console.log(`User: ${user}, SocketId: ${socketID}`);
    
    try {
        console.log(`SocketId: ${socketID}`);
      const response = await fetch('http://localhost:4001/matchmake', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email, // Change this to the user's email
          difficultyLevel: selectedDifficulty,
          socketId: socketID, // Change this to the user's socket ID
        }),
      });

      if (response.status === 200) {
        // User successfully enqueued
        console.log('User enqueued successfully.');
      } else {
        // Handle error cases here
        console.error('Failed to enqueue user.');
        console.error(response);
      }
    } catch (error) {
      console.error('Error enqueueing user:', error);
    }
  };

  return (
    <div>
      <h2>Question Queue</h2>
      <div>
        <label>Select Difficulty:</label>
        <select value={selectedDifficulty} onChange={handleDifficultyChange}>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
      <div>
        <button onClick={handleJoinQueue}>Join Queue</button>
      </div>
    </div>
  );
}

export default QuestionQueue;
