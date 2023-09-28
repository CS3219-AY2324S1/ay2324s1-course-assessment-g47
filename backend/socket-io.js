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

    console.log("connected to socket.io")
    
	/socket.emit("me", (socket.id))

    socket.emit('ping', 'Ping from server');

    socket.on('pong', (message) => {
      console.log(`Received: ${message}`);
    });

})

server.listen(IO_PORT, () => console.log(`server is running on port ${IO_PORT}`))
