require("dotenv").config(); // Load environment variables from .env file

const express = require("express")
const http = require("http")
const amqp = require("amqplib");
const app = express()
const { v4: uuidv4 } = require('uuid');

const IO_PORT = 4002

const server = http.createServer(app)
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})

io.on("connection", (socket) => {

  socket.emit("me", (socket.id));

  socket.emit("message", "Welcome to the chat!");

  socket.on("matchUser", (data) => {
    //socket.join(data.roomName)
    socket.to(data.socketId).emit("matched-successfully", {roomId: data.roomName,difficultyLevel: data.difficultyLevel, matchedUsername: data.matchedUsername, matchedEmail: data.matchedEmail})
  })


  // Handle user joining a room
  socket.on("join-room", (data) => {
    const roomName = data.roomId; // Replace with your desired room name
    socket.join(roomName);
    console.log(`User ${data.user.username} joined room ${roomName}`);

    // Notify other users in the room that a new user has connected
    socket.to(roomName).emit("user-connected", socket.id);
    //io.to(data.roomId).emit("chatNotifcationMessage", { message: `${data.user.username} joined the room`, roomId: data.roomId});
    socket.broadcast.to(roomName).emit("messageNotification", { message: `User ${data.user.username} joined room ${roomName}`, senderInfo: data.user, time: new Date().toLocaleTimeString([], { }) });
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

  socket.on('newRandomQuestion', (data) => {
    // Emit the updated random question to the room
    socket.to(data.roomId).emit('updateRandomQuestion', data.randomQuestion);
    console.log('Question changed by', data.user.username);
    //socket.to(data.roomId).emit("messageNotification", { message: `${data.user.username} changed to question to ${data.randomQuestion.title}`, senderInfo: data.user, time: new Date().toLocaleTimeString([], { }) });
    
    
  });

  // Handle user disconnection
  socket.on("disconnected", (data) => {
    console.log("A user disconnected: " + socket.id);

    // Notify other users in the room that a user has disconnected
    socket.to(data.roomId).emit("user-disconnected", socket.id);
  });

  socket.on("editor-change", (data) => {
    editorContent = data.text;
    io.to(data.roomId).emit("editor-changed", data.text)
  })

  socket.on("language-change", (data) => {
    const newLanguage = data.language;
    io.to(data.roomId).emit("language-changed", {label: data.label, value: data.value})
    // Update the selected language for peers
    //setSelectedLanguage({ value: newLanguage, label: newLanguage });
  });
  
  // Listen for chat messages
  socket.on("chatMessage", (msg, roomId, senderInfo, time) => {
    console.log("Received chat message: " + msg);
    // Send the message to all users in the room
    io.to(roomId).emit("message", { message: msg, senderInfo: senderInfo, time: time });
  });

  socket.on("chatNotifcationMessage", (data) => {
    console.log("Received chat notification: " + data.message + "to:" + data.roomId + "from:" + data.senderInfo.username + "at:" + data.time);
    // Send the message to all users in the room
    io.to(data.roomId).emit("messageNotification", { message: data.message, senderInfo: data.senderInfo, time:data.time});
    //io.to(roomId).emit("messageNotification", { message: msg });
  });

})

const consumeFromQueue = async () => {
  try {
      const queueName = 'matched_pairs'
      const connection = await amqp.connect(process.env.AMQP_URL);
      const channel = await connection.createChannel();
      await channel.assertQueue(queueName, {durable: true});
      console.log('Connected to RabbitMQ through socket-io.js');
      console.log(`Waiting for messages in ${queueName}`);

      channel.consume(queueName,(message) => {
              if (message !== null) {
                  const roomId = uuidv4(); // Implement a function to generate a unique roomId
                  const data = JSON.parse(message.content.toString()); // Convert the message content back to JSON
                  // Emit the signal to the clients
                  console.log('Message received from matched_pair queue in socket-io.js: ', data);

                  io.to(data.Player1.socketId).emit("matched-successfully", {roomId: roomId, socketId: data.Player1.socketId, difficultyLevel: data.Player1.difficultyLevel, matchedUsername: data.Player2.username, matchedEmail: data.Player2.email});
                  io.to(data.Player2.socketId).emit("matched-successfully", {roomId: roomId, socketId: data.Player2.socketId, difficultyLevel: data.Player2.difficultyLevel, matchedUsername: data.Player1.username, matchedEmail: data.Player1.email});

                  channel.ack(message);
              } else {
                console.log('Listening but there was no message, socket-io.js')
              }
          })
  } catch (error) {
      console.error('Error consuming message from queue: ', error);
  }
}

server.listen(IO_PORT, () => {
  console.log(`socket-io is running on port ${IO_PORT}`)
  consumeFromQueue();
})

