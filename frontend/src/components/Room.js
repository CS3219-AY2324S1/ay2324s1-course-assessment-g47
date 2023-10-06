import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import "./css/room.css";
import { Link } from "react-router-dom";
import Editor from "@monaco-editor/react";
import Peer from "simple-peer";
import io from "socket.io-client";
import { ca } from "date-fns/locale";
import { connect } from "mongoose";
import { set } from "date-fns";
import { codeLanguages } from "./constants";
import Select from "react-select";

const IO_PORT = 4002;
const socket = io.connect(`http://localhost:${IO_PORT}`); // Connect to the backend socket.io server


function Room() {

    // Code language settings 
    const [selectedLanguage, setSelectedLanguage] = useState(
        codeLanguages.find((language) => language.value === "python")
      );

    const { roomId } = useParams();
    const [me, setMe] = useState("");
    const [stream, setStream] = useState(null);
    const [connectedUsers, setConnectedUsers] = useState([]); //no use for now
    const [callerSignal, setCallerSignal] = useState();
    const [peerSocketId, setPeerSocketId] = useState(null);
    const [editorText, setEditorText] = useState("");
    const [micOn, setMicOn] = useState(true);
    const [cameraOn, setCameraOn] = useState(true);
    const [otherStream, setOtherStream] = useState(null);
    const [otherMicOn, setOtherMicOn] = useState(true);
    const [otherCameraOn, setOtherCameraOn] = useState(true);
    const [inCallRoom, setInCallRoom] = useState(false);

    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();

    useEffect(() => {

        socket.on("set-caller-signal", (data) => {
            setCallerSignal(data.signal);
        });

        const getFirstUserMediaWithStatus = async () => {

            try {
                const userStream = await navigator.mediaDevices.getUserMedia({
                    video: cameraOn,
                    audio: micOn,
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
                        setInCallRoom(true);
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
                    setInCallRoom(true);
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
                const userStream = null;
                setStream(userStream);
                myVideo.current.srcObject = userStream;
            }
        };

        socket.on("me", (id) => {
            setMe(id);
        });

        // Call the getUserMedia function only once when the component mounts
        getFirstUserMediaWithStatus();

        return () => {
            // Clean up the event listener when the component unmounts
            socket.off("user-connected");
            socket.off("user-disconnected");
            socket.off("signal-received");
            socket.off("signal-recievedd");
            socket.off("initial-editor-content");
            socket.off("editor-changed");
            socket.off("me");
        };
    }, []);

    useEffect(() => {
        const getUserMediaWithStatus = async () => {
            try {
                const userStream = await navigator.mediaDevices.getUserMedia({
                    video: cameraOn,
                    audio: micOn,
                });
                setStream(userStream);
                myVideo.current.srcObject = userStream;
            } catch (err) {
                const userStream = null;
                setStream(userStream);
                myVideo.current.srcObject = userStream;
            }
        };

        getUserMediaWithStatus();
    }, [micOn, cameraOn]);

    // pause peer video when other user toggled video
    useEffect(() => {
        if (otherCameraOn) {
            userVideo.current.srcObject = stream;
        } else {
            userVideo.current.srcObject = null;
        }
    }, [otherCameraOn]);

    // pause peer audio when other user toggled mic
    useEffect(() => {
        if (otherMicOn) {
            userVideo.current.srcObject = stream;
        } else {
            userVideo.current.srcObject = null;
        }
    }, [otherMicOn]);

    // Ignore for now
    // const getOtherMediaWithStatus = async () => {
    //     try {
    //       const otherStream = await navigator.mediaDevices.getUserMedia({
    //         video: otherCameraOn,
    //         audio: otherMicOn,
    //       });
    //       setOtherStream(otherStream);
    //       if (userVideo.current) {
    //         console.log("otherStream:", otherStream);
    //         userVideo.current.srcObject = otherStream;
    //       }
    //     } catch (err) {
    //       const otherStream = null;
    //       setOtherStream(otherStream);
    //       userVideo.current.srcObject = otherStream;
    //     }
    // };

    socket.on("editor-changed", (text) => {
        if (editorText !== text) {
            setEditorText(text);
        }
    });

    socket.on("user-disconnected", (userId) => {
        // A user has disconnected from the room
        console.log("User disconnected:", userId);
        setConnectedUsers((prevUsers) => prevUsers.filter((id) => id !== userId));
        if (connectionRef.current) {
            connectionRef.current.destroy();
        }
    });

    socket.on("otherUserToggledMic", (userId, toggleMicState) => {
        if (userId !== socket.id) {
            setOtherMicOn(toggleMicState);
            console.log("other user toggled mic:", userId, toggleMicState);
        }
    });

    socket.on("otherUserToggledCamera", (userId, toggleCameraState) => {
        if (userId !== socket.id) {
            setOtherCameraOn(toggleCameraState);
            console.log("other user toggled camera:", userId, toggleCameraState);
        }
    });

    const handleEditorChange = (newValue) => {
        setEditorText(newValue);
        socket.emit("editor-change", { text: newValue, roomId: roomId });
    };

    const leaveCall = () => {
        // Disconnect from the room
        console.log("Leaving call");
        socket.emit("disconnected");
    };

    const toggleMic = () => {
        setMicOn((prevMicOn) => !prevMicOn);
        socket.emit("toggleMic", !micOn);
        console.log("User toggled mic:", socket.id, !micOn);
    };

    const toggleCamera = () => {
        setCameraOn((prevCameraOn) => !prevCameraOn);
        socket.emit("toggleCamera", !cameraOn);
    };


  // Update the handleLanguageChange function
  const handleLanguageChange = (selectedOption) => {
    console.log(`Option selected:`, selectedOption);
    setSelectedLanguage(selectedOption);
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
                    <button
                        onClick={() => toggleCamera()}
                    >
                        Camera
                    </button>

                    <button
                        onClick={() => toggleMic()}
                    >
                        Microphone
                    </button>
                </div>
            </div>
            <div className="right-panel">
            <div className="editor-container">
            <div className="language-dropdown">
        <label>Select Language:</label>
        <Select
          value={selectedLanguage}
          onChange={handleLanguageChange}
          options={codeLanguages}
          isSearchable={true}
          placeholder="Search for a language..."
        />
      </div>
      <div className="editor">
        <Editor
          height="500px"
          width="100%"
          theme="vs-dark"
          language={selectedLanguage.value}

          value={editorText}
          onChange={handleEditorChange}
        />
      </div>
    </div>
            </div>
        </div>
    );
}

export default Room;


//TODO: Only allow 2 people to enter room. (Bug: a third user can copy and paste same link and join the room)
//TODO: add toggle mic and camera button.
//TODO: Queuing system require refresh to work.
//TODO: Once disconnected, cannot reconnect.
// Add "currently in queue" UI in home page, because user cant see if he/she is in queue or not (only can see in console for now)
// extra: Add "waitting for other user to join" UI in room page 