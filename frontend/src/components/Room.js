import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import "./css/room.css";
import { Link } from "react-router-dom";
import Editor from "@monaco-editor/react";
import Peer from "simple-peer";
import io from "socket.io-client";

const IO_PORT = 4002;
const socket = io.connect(`http://localhost:${IO_PORT}`); // Connect to the backend socket.io server

function Room() {

    const { roomId } = useParams();
    const [me, setMe] = useState("");
    const [stream, setStream] = useState(null);
    const [connectedUsers, setConnectedUsers] = useState([]); //no use for now
    const [callerSignal, setCallerSignal] = useState();
    const [peerSocketId, setPeerSocketId] = useState(null);
    const [editorText, setEditorText] = useState("");

    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();

    useEffect(() => {

        socket.on("set-caller-signal", (data) => {
            setCallerSignal(data.signal);
          });
          
        const getUserMediaWithStatus = async () => {

            try {
                const userStream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: false,
                });
                setStream(userStream);
                myVideo.current.srcObject = userStream;

                socket.emit("join-room", { roomId: roomId }); // Automatically join the socket.io room

                socket.on("user-connected", (userId) => {
                    // A new user has connected to the room
                    setConnectedUsers((prevUsers) => [...prevUsers, userId]);

                    console.log("Another User connected:", userId);
                    // Create a new Peer connection for the new user
                    const peer = new Peer({
                        initiator: true,
                        trickle: false,
                        stream: userStream,
                    });

                    peer.on("signal", (data) => {
                        socket.emit("send-signal", {
                            callerId: userId,
                            signal: data,
                        });
                        socket.emit("set-caller-signal", {
                            callerId: userId,
                            signal: data,
                        });
                        setCallerSignal(data);
                        setPeerSocketId(userId)
                    });
                    peer.on("stream", (stream) => {
                        userVideo.current.srcObject = stream;
                    });

                    socket.on("signal-recievedd", (signal) => {
                        console.log("Signal received24:", signal);
                        peer.signal(signal.signal);
                    });

                    connectionRef.current = peer;
                });

                socket.on("signal-received", (data) => {
                    
                    console.log("Signal received1:");
                    setPeerSocketId(data.from)
                    const peer = new Peer({
                        initiator: false,
                        trickle: false,
                        stream: userStream,
                    });

                    peer.on("signal", (signalData) => {
                        socket.emit("return-signal", { signal: signalData, callerId: data.from });
                    });

                    peer.on("stream", (stream) => {
                        userVideo.current.srcObject = stream;
                    });

                    console.log("Signal received2:", callerSignal);
                    console.log("Signal received23:", data.signal);
                     peer.signal(data.signal);
                     connectionRef.current = peer;
                });

                socket.on("user-disconnected", (userId) => {
                    // A user has disconnected from the room
                    setConnectedUsers((prevUsers) =>
                        prevUsers.filter((user) => user !== userId)
                    );
                });

                socket.on("initial-editor-content", (initialContent) => {
                    setEditorText(initialContent);
                });

                // Listen for changes from Socket.io and update the editor
                socket.on("editor-changed", (text) => {
                    if (editorText !== text) {
                        setEditorText(text);
                    }
                });
            } catch (err) {
                console.error("Error accessing user media:", err);
            }
        };

        socket.on("me", (id) => {
            setMe(id);
        });

        // Call the getUserMedia function
        getUserMediaWithStatus();
    }, []);

    const handleEditorChange = (newValue) => {
        setEditorText(newValue);
        socket.emit("editor-change", {text: newValue, roomId: roomId});
    };

    const leaveCall = () => {
        connectionRef.current.destroy();
        socket.disconnect({roomId: roomId});
    };

    return (
        <div className="container">
            <div className="left-panel">
                <div className="video-container">
                    <video className="video-player" autoPlay playsInline ref={myVideo} />
                    <video className="video-player" playsInline ref={userVideo} autoPlay />
                </div>

                <div id="controls">
                    <Link to="/">
                        <button onClick={() => leaveCall()}>Home</button>
                    </Link>
                </div>
                
            </div>
            <div className="right-panel">
                <Editor
                    height="100%"
                    width="100%"
                    theme="vs-dark"
                    value={editorText}
                    onChange={handleEditorChange}
                />
            </div>
        </div>
    );
}

export default Room;


//TODO: Only allow 2 people to enter room. (Bug: a third user can copy and paste same link and join the room)
// TODO: add toggle mic and camera button
// Add "currently in queue" UI in home page, because user cant see if he/she is in queue or not (only can see in console for now)
// extra: Add "waitting for other user to join" UI in room page 