require("dotenv").config(); // Load environment variables from .env file

const express = require("express")
const http = require("http")
const app = express()

const IO_PORT = 4002

const server = http.createServer(app)
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})

const codeByRoom = {}; // Create an object to store code by room
const connectedUsers = {}; // Create an object to store users by room
const questionByRoom = {}; // Create an object to store question by room

io.on("connection", (socket) => {

  socket.emit("me", (socket.id));

  socket.emit("message", "Welcome to the chat!");

  // socket.on("toggleMic", (newMicState) => {
	// 	  io.emit("otherUserToggledMic", socket.id, newMicState);
  //     console.log("Mic toggled")
	// });
  
	
	// socket.on("toggleCamera", (newCameraState) => {
	// 	  io.emit("otherUserToggledCamera", socket.id, newCameraState);
  //     console.log("Camera toggled")
	// });

  socket.on("matchUser", (data) => {
    //socket.join(data.roomName)
    socket.to(data.socketId).emit("matched-successfully", {roomId: data.roomName,difficultyLevel: data.difficultyLevel, matchedUsername: data.matchedUsername})
  })


  // Handle user joining a room
  socket.on("join-room", (data) => {
    const roomName = data.roomId; // Replace with your desired room name
    socket.join(roomName);
    console.log(`User ${socket.id} joined room ${roomName}`);

    // Notify other users in the room that a new user has connected
    socket.to(roomName).emit("user-connected", socket.id);

    // Send the user their own ID
    socket.emit("me", socket.id);

    codeByRoom[roomName] = ''; // Store an empty code based on the current roomId when initial join
  });

  // Receive and store user information when they connect
  socket.on("set-user-info", ({ userName, matchedName, roomId }) => {
    const roomName = roomId;
    connectedUsers[roomName] = { userName, matchedName }; // Store both users' info based on the current roomId
  });

  // Handle signaling
  socket.on("send-signal", (data) => {
    console.log("Sending signal from user: " + socket.id + " to user: " + data.callerId);
    // Send the signal data to the target user
    io.to(data.callerId).emit("signal-received", {
      signal: data.signal,
      callerId: socket.id,
      from: socket.id,
    });
  });

  socket.on("return-signal", (data) => {
    console.log("Returning signal from user: " + socket.id + " to user: " + data.callerId);
    // Send the signal data back to the caller
    io.to(data.callerId).emit("signal-recievedd", {
      signal: data.signal,
      callerId: socket.id,
    });
  });

  socket.on("set-caller-signal", (data) => {
    console.log("Setting caller signal from user: " + socket.id + " to user: " + data.callerId);
    // Send the signal data back to the caller
    socket.to(data.callerId).emit("set-caller-signal", {
      callerId: socket.id,
      signal: data.signal
    });

  });

  socket.on('newRandomQuestion', (data) => {
    // Emit the updated random question to the room
    questionByRoom[data.roomId] = data.randomQuestion; // Store the question info into the current roomId
    socket.to(data.roomId).emit('updateRandomQuestion', data.randomQuestion);
  });

  // Handle user disconnection
  socket.on("disconnected", (data) => {
    console.log("A user disconnected: " + socket.id);

    // const codeToSave = codeByRoom[data.roomId];
    // const userInfo = connectedUsers[socket.id];
    // console.log(codeToSave);
    // console.log(userInfo);
    // delete codeByRoom[data.roomId];
    // delete connectedUsers[data.roomId];

    // Notify other users in the room that a user has disconnected
    socket.to(data.roomId).emit("user-disconnected", socket.id);
  });

  socket.on("editor-change", (data) => {
    editorContent = data.text;
    const roomName = data.roomId;
    // Update the code for the room
    codeByRoom[data.roomId] = data.text; // Update the code stored based on the current roomId
    // console.log(codeByRoom[data.roomId]); // Code written by users
    // console.log(connectedUsers[data.roomId]); // Both users' email
    // console.log(questionByRoom[data.roomId]); // Question info (Difficulty, Question Name, Date and Time)
    const user_1 = connectedUsers[roomName].userName;
    const user_2 = connectedUsers[roomName].matchedName;
    const question_difficulty = questionByRoom[roomName].complexity;
    const question_name = questionByRoom[roomName].title;
    const time_of_creation = questionByRoom[roomName].updatedAt;
    const question_category = questionByRoom[roomName].category;
    const question_description = questionByRoom[roomName].description;
    const code = data.text;
    io.to(data.roomId).emit("editor-changed", data.text)
  })

  socket.on("language-change", (data) => {
    const newLanguage = data.language;
    io.to(data.roomId).emit("language-changed", {label: data.label, value: data.value})
    // Update the selected language for peers
    //setSelectedLanguage({ value: newLanguage, label: newLanguage });
  });
  
  // Listen for chat messages
  socket.on("chatMessage", (msg, roomId, username, time) => {
    console.log("Received chat message: " + msg);
    // Send the message to all users in the room
    io.to(roomId).emit("message", { message: msg, username: username, time: time });
  });

})

server.listen(IO_PORT, () => console.log(`socket-io is running on port ${IO_PORT}`))

module.exports = {
  io,
};
