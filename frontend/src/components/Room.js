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
import { FaHome, FaVideo, FaVideoSlash, FaMicrophone, FaMicrophoneSlash, FaCheck } from 'react-icons/fa';
import { useLocation } from 'react-router-dom'
import DisplayRandomQuestion from "./DisplayRandomQuestion"

import Select, { components } from "react-select";

const IO_PORT = 4002;
const socket = io.connect(`http://localhost:${IO_PORT}`); // Connect to the backend socket.io server


function Room({ user }) {
    console.log("user:", user);
    const location = useLocation();
    const difficultyLevel = location.state?.difficultyLevel || 'easy'; // Get the difficultyLevel from location state
    const matchedUsername = location.state?.matchedUsername || 'Peer2'; // Get the difficultyLevel from location state
    console.log("matchedUsername:", matchedUsername);
    console.log("difficultyLevel:", difficultyLevel);
    // Code language settings 
    const [selectedLanguage, setSelectedLanguage] = useState(
        codeLanguages.find((language) => language.value === "python")
    );

    const { roomId } = useParams();
    const [me, setMe] = useState("");
    // const [stream, setStream] = useState(null);
    const [connectedUsers, setConnectedUsers] = useState([]); //no use for now
    const [callerSignal, setCallerSignal] = useState();
    const [peerSocketId, setPeerSocketId] = useState(null);
    const [editorText, setEditorText] = useState("");
    // const [micOn, setMicOn] = useState(true);
    // const [cameraOn, setCameraOn] = useState(true);
    // const [otherStream, setOtherStream] = useState(null);
    // const [otherMicOn, setOtherMicOn] = useState(true);
    // const [otherCameraOn, setOtherCameraOn] = useState(true);
    const [inCallRoom, setInCallRoom] = useState(false);
    const [peer, setPeer] = useState(null);

    const [randomQuestion, setRandomQuestion] = useState(null);

    const fetchRandomEasyQuestion = async () => {
        if (user) {
            try {
                const response = await fetch(`/api/questions/random-${difficultyLevel}`, {
                    headers: { Authorization: `Bearer ${user.tokens.accessToken}` },
                });
                const json = await response.json();

                if (response.ok) {
                    setRandomQuestion(json);
                    socket.emit('newRandomQuestion', { roomId: roomId, randomQuestion: json });
                }
            } catch (error) {
                console.error(`Error fetching random ${difficultyLevel} question:`, error);
            }
        
  
        }
    };

    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();

    useEffect(() => {

        fetchRandomEasyQuestion();
        socket.on('updateRandomQuestion', (newRandomQuestion) => {
            console.log("newRandomQuestion:", newRandomQuestion)
            setRandomQuestion(newRandomQuestion);
          });
      

        socket.on("set-caller-signal", (data) => {
            setCallerSignal(data.signal);
        });

        const getFirstUserMediaWithStatus = async () => {

            try {
                // const userStream = await navigator.mediaDevices.getUserMedia({
                //     video: {
                //         width: { ideal: 1280 }, // Preferred width
                //         height: { ideal: 720 },  // Preferred height
                //     },
                //     audio: micOn,
                // });
                // setStream(userStream);
                // myVideo.current.srcObject = userStream;

                socket.emit("join-room", { roomId: roomId }); // Automatically join the socket.io room

                socket.on("user-connected", (userId) => {
                    // A new user has connected to the room
                    setConnectedUsers((prevUsers) => [...prevUsers, userId]);

                    console.log("Another User connected:", userId);
                    // Create a new Peer connection for the new user
                    const peer = new Peer({
                        initiator: true,
                        trickle: true,
                        // stream: userStream,
                    });

                    setPeer(peer);

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
                    // peer.on("stream", (stream) => {
                    //     userVideo.current.srcObject = stream;
                    // });

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
                        trickle: true,
                        // stream: userStream,
                    });

                    peer.on("signal", (signalData) => {
                        socket.emit("return-signal", { signal: signalData, callerId: data.from });
                    });

                    // peer.on("stream", (stream) => {
                    //     userVideo.current.srcObject = stream;
                    // });

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
                socket.on("language-changed", (language) => {
                    console.log("language changed:", language);
                    setSelectedLanguage(language);

                });
            } catch (err) {
                console.error("Error accessing user media:", err);
                // const userStream = null;
                // setStream(userStream);
                // myVideo.current.srcObject = userStream;
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

    // useEffect(() => {
    //     const getUserMediaWithStatus = async () => {
    //         try {
    //             const userStream = await navigator.mediaDevices.getUserMedia({
    //                 video: cameraOn,
    //                 audio: micOn,
    //             });
    //             setStream(userStream);
    //             myVideo.current.srcObject = userStream;
    //         } catch (err) {
    //             const userStream = null;
    //             setStream(userStream);
    //             myVideo.current.srcObject = userStream;
    //         }
    //     };

    //     getUserMediaWithStatus();
    // }, [micOn, cameraOn]);

    // pause peer video when other user toggled video
    // useEffect(() => {
    //     if (otherCameraOn) {
    //         userVideo.current.srcObject = stream;
    //     } else {
    //         userVideo.current.srcObject = null;
    //     }
    // }, [otherCameraOn]);

    // // pause peer audio when other user toggled mic
    // useEffect(() => {
    //     if (otherMicOn) {
    //         userVideo.current.srcObject = stream;
    //     } else {
    //         userVideo.current.srcObject = null;
    //     }
    // }, [otherMicOn]);

    const handleRefreshQuestion = () => {
        // Call fetchRandomEasyQuestion when "Change Question" button is clicked
        fetchRandomEasyQuestion();
    };

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

    // socket.on("otherUserToggledMic", (userId, toggleMicState) => {
    //     if (userId !== socket.id) {
    //         setOtherMicOn(toggleMicState);
    //         console.log("other user toggled mic:", userId, toggleMicState);
    //     }
    // });

    // socket.on("otherUserToggledCamera", (userId, toggleCameraState) => {
    //     if (userId !== socket.id) {
    //         setOtherCameraOn(toggleCameraState);
    //         console.log("other user toggled camera:", userId, toggleCameraState);
    //     }
    // });

    const handleEditorChange = (newValue) => {
        setEditorText(newValue);
        socket.emit("editor-change", { text: newValue, roomId: roomId });
    };

    const leaveCall = () => {
        // Disconnect from the room
        console.log("Leaving call");
        socket.emit("disconnected", { roomId: roomId });
    };

    // wait for DOM to load before getting elements
    useEffect(() => {
        const chatForm = document.getElementById("chat-form");
        const chatMessages = document.querySelector('.chat-messages');
    //Message submit
    chatForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Get message text
        const msg = e.target.elements.msg.value;

        // Emit message to server
        socket.emit("chatMessage", msg, roomId);
    });

    socket.on("message", (message) => {
        console.log("message:", message);
        outputMessage(message);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });

    // Output message to DOM
    function outputMessage(message) {
        const div = document.createElement("div");
        div.classList.add("message");
        div.innerHTML = `<p class="meta">Brad <span>9:12pm</span></p>
        <p class="text"> 
            ${message} 
        </p>`;
        document.querySelector('.chat-messages').appendChild(div);
    }
    }, []);

    // const toggleMic = () => {
    //     setMicOn((prevMicOn) => !prevMicOn);
    //     socket.emit("toggleMic", !micOn);
    //     console.log("User toggled mic:", socket.id, !micOn);
    // };

    // const toggleMic = () => {
    //     setMicOn((prevMicOn) => !prevMicOn);
    //     if (stream) {
    //         console.log("stream:", stream)
    //         stream.getAudioTracks().forEach((track) => {
    //             track.enabled = micOn;
    //         });
    //     } else {
    //         console.log("no stream:")
    //     }
    //     updatePeerStream();
    // };

    // const toggleCamera = () => {
    //     setCameraOn((prevCameraOn) => !prevCameraOn);
    //     socket.emit("toggleCamera", !cameraOn);
    // };

    // const toggleCamera = () => {
    //     setCameraOn((prevCameraOn) => !prevCameraOn);
    //     if (stream) {
    //         stream.getVideoTracks().forEach((track) => {
    //             track.enabled = cameraOn;
    //         });
    //     }
    //     updatePeerStream();
    // };

    const handleLanguageChange = (selectedOption) => {
        console.log(`Option selected:`, selectedOption);
        setSelectedLanguage(selectedOption);
        socket.emit("language-change", { label: selectedOption.label, value: selectedOption.value, roomId: roomId });
    };

    //Doesnt work
    // const updatePeerStream = () => {
    //     if (peer) {
    //         peer.on("stream", (stream) => {
    //             userVideo.current.srcObject = stream;
    //         });
    //     }
    // };

    return (
        <div className="container">

            <div className="left-panel">
                <main class="chat-main">
                    <div class="chat-messages"></div>
                </main>
                <div class="chat-form-container">
                    <form id="chat-form">
                    <input
                        id="msg"
                        type="text"
                        placeholder="Enter Message"
                        required
                        autocomplete="off"
                    />
                    <button class="btn"><i class="fas fa-paper-plane"></i> Send</button>
                    </form>
                </div>
                {/* <div className="video-container">
                    <video className="video-player" autoPlay playsInline ref={myVideo} />
                    <p>{user ? user.user.username : "me" }</p>
                    <video className="video-player" playsInline ref={userVideo} autoPlay />
                    <p>{matchedUsername}</p>
                </div>
                <div className="video-controls">
                    <button onClick={() => toggleCamera()}>
                        {cameraOn ? <FaVideo /> : <FaVideoSlash className={cameraOn ? "" : "red-icon"} />}
                    </button>
                    <button onClick={() => toggleMic()}>
                        {micOn ? <FaMicrophone /> : <FaMicrophoneSlash className={micOn ? "" : "red-icon"} />}
                    </button>
                    <Link to="/">
                        <button onClick={() => leaveCall()}>
                            <FaHome /> Home
                        </button>
                    </Link>
                </div> */}

            </div>

            <div className="middle-panel">
                <div className="editor-container">
                    <div className="language-dropdown">
                        <label>Select Language:</label>
                        <Select
                            value={selectedLanguage}
                            onChange={handleLanguageChange}
                            options={codeLanguages}
                            isSearchable={true}
                            placeholder="Search for a language..."
                            className="select-language"
                            styles={customSelectStyles}
                            components={{
                                Option: CustomSelectOption, // Use the custom component to render options
                            }}
                        />
                    </div>
                    <div className="editor">
                        <Editor
                            height="100vh"
                            width="100%"
                            theme="vs-dark"
                            language={selectedLanguage.value}
                            value={editorText}
                            onChange={handleEditorChange}
                        />
                    </div>
                </div>
            </div>

            <div className="right-panel">
                <DisplayRandomQuestion
                    user={user}
                    randomQuestion={randomQuestion}
                    handleRefreshQuestion={handleRefreshQuestion}
                />
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


const customSelectStyles = {
    container: (provided) => ({
        ...provided,
        width: '100%', // Adjust the width as needed
        marginBottom: '20px', // Add margin as needed
    }),
    control: (provided) => ({
        ...provided,
        backgroundColor: '#444', // Darker background color
        border: '1px solid #666', // Dark border
        color: '#fff', // White text color
    }),
    singleValue: (provided) => ({
        ...provided,
        color: '#fff', // White text color
    }),
    placeholder: (provided) => ({
        ...provided,
        color: '#ccc', // Placeholder text color
    }),
    menu: (provided) => ({
        ...provided,
        backgroundColor: '#444', // Darker background color
        border: '1px solid #666', // Dark border
    }),
    option: (provided, state) => ({
        ...provided,
        color: '#fff', // White text color
        backgroundColor: state.isFocused ? '#666' : '#444', // Background color for focused/hovered option
    }),
    menuList: (provided) => ({
        ...provided,
        '&::-webkit-scrollbar': {
            width: '8px', // Adjust the scrollbar width as needed
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#666', // Color of the scrollbar thumb
            borderRadius: '4px', // Adjust the scrollbar thumb radius as needed
        },
        '&::-webkit-scrollbar-track': {
            backgroundColor: '#444', // Color of the scrollbar track
        },
    }),
};

const CustomSelectOption = (props) => (
    <components.Option {...props}>
        {props.label}
        <FaCheck style={{ marginLeft: '8px', visibility: props.isSelected ? 'visible' : 'hidden' }} />
    </components.Option>
);
