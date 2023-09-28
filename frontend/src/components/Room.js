
import { useEffect } from "react";

import io from "socket.io-client";
const IO_PORT = 4002;
const socket = io.connect(`http://localhost:${IO_PORT}`); //Connect to backend socket.io server


function Room() {
    
    console.log(`${IO_PORT}`);
    useEffect(() => {
        console.log("Room1");
        console.log(`${IO_PORT}`);

        // Send a "ping" message to the server
        socket.on('ping', (message) => {
            console.log(`Received: ${message}`);

            // Respond with a "pong" message
            socket.emit('pong', 'Pong from client');
        });

        socket.on("me", (id) => {;
            console.log("Calling socket function `me`to get socketID, socketID:", id);
          });
        socket.emit("joinRoom", { roomName: "room1" });

    
    }, []);
    return (
        <h1>Room1</h1>
    );
}

export default Room;