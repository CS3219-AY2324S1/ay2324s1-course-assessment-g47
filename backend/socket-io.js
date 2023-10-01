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


io.on("connection", (socket) => {

  socket.emit("me", (socket.id))

  // socket.on("toggleMic", () => {
  // 	// Handle toggling of microphone on the server
  // 	// Broadcast the toggleMic event to other users in the same room
  // 	io.to(socket.id).emit("otherUserToggledMic");
  //   });

  //   socket.on("toggleCamera", () => {
  // 	// Handle toggling of camera on the server
  // 	// Broadcast the toggleCamera event to other users in the same room
  // 	io.to(socket.id).emit("otherUserToggledCamera");
  //   });

  socket.on("matchUser", (data) => {
    //socket.join(data.roomName)
    socket.to(data.socketId).emit("matched-successfully", data.roomName)
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

  // Handle user disconnection
  socket.on("disconnect", (data) => {
    console.log("A user disconnected: " + socket.id);

    // Notify other users in the room that a user has disconnected
    socket.to(data.roomId).emit("user-disconnected", socket.id);
  });

  socket.on("editor-change", (data) => {
    editorContent = data.text;
    io.to(data.roomId).emit("editor-changed", data.text)
  })

})

server.listen(IO_PORT, () => console.log(`socket-io is running on port ${IO_PORT}`))

module.exports = {
  io,
};
