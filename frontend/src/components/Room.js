import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import "./css/room.css";
import Editor from "@monaco-editor/react";
import Peer from "simple-peer";
import io from "socket.io-client";
import { codeLanguages } from "./constants";
import { FaCheck } from 'react-icons/fa';
import { useLocation } from 'react-router-dom'
import DisplayRandomQuestion from "./DisplayRandomQuestion"

import Select, { components } from "react-select";

const IO_PORT = 4002;
const HISTORY_PORT = 4005;
const socket = io.connect(`http://localhost:${IO_PORT}`); // Connect to the backend socket.io server


function Room({ user }) {
    console.log("user:", user);
    const location = useLocation();
    const difficultyLevel = location.state?.difficultyLevel || 'easy'; // Get the difficultyLevel from location state
    const matchedUsername = location.state?.matchedUsername || 'Peer2'; // Stores the matched user's email
    const currUsername = user.user.email; // Stores current user's email
    // Code language settings 
    const [selectedLanguage, setSelectedLanguage] = useState(
        codeLanguages.find((language) => language.value === "python")
    );

    const { roomId } = useParams(); // Stores the Room ID
    const [me, setMe] = useState("");
    const [connectedUsers, setConnectedUsers] = useState([]); //no use for now
    const [callerSignal, setCallerSignal] = useState();
    const [peerSocketId, setPeerSocketId] = useState(null);
    const [editorText, setEditorText] = useState(""); // Stores the code
    const [peer, setPeer] = useState(null);
    const [randomQuestion, setRandomQuestion] = useState(null); // Stores the question

    const updateData = async (codeText, language, question) => {
        try {
            const response = await fetch(
				`http://localhost:${HISTORY_PORT}/history/manage-code-attempt`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ currUsername, matchedUsername, question, roomId, codeText, language }),
				}
			);

			if (response.status === 200) {
				// Successful update of Code Attempt History
				const data = await response.json();
                console.log(data);
				console.log(`Saved the progress for ${question.title} for ${currUsername} and ${matchedUsername}.`);
			} else {
				// Handle Unexpected Errors caused from the Server
				console.log("Server error");
			}

        } catch (err) {
            console.error("Unexpected error occurred while updating data:", err);
        }
    };

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
                    return json; // Return the fetched question
                }
            } catch (error) {
                console.error(`Error fetching random ${difficultyLevel} question:`, error);
            }
        }
    };

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

                socket.emit("join-room", { roomId: roomId }); // Automatically join the socket.io room

                socket.on("user-connected", (userId) => {
                    // A new user has connected to the room
                    setConnectedUsers((prevUsers) => [...prevUsers, userId]);
                    console.log("Another User connected:", userId);

                    // Create a new Peer connection for the new user
                    const peer = new Peer({
                        initiator: true,
                        trickle: true,
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
                        setPeerSocketId(userId);
                    });

                    socket.on("signal-recieved", (signal) => {
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
                        trickle: true,
                    });

                    peer.on("signal", (signalData) => {
                        socket.emit("return-signal", { signal: signalData, callerId: data.from });
                    });

                    console.log("Signal received2:", callerSignal);
                    console.log("Signal received23:", data.signal);
                    peer.signal(data.signal);
                    connectionRef.current = peer;
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
            }
        };

        socket.on("me", (id) => {
            setMe(id);
        });

        socket.on("user-disconnected", (userId) => {
            setConnectedUsers((prevUsers) =>
                prevUsers.filter((prevUserId) => prevUserId !== userId)
            );
            socket.disconnect();
            window.location.href = "/roomexit";
        });

        function myBeforeUnloadListener(event) {
            window.addEventListener('unload', () => {
                socket.emit("disconnected", { roomId: roomId });
                socket.disconnect();
            });
        }
    
        window.addEventListener('unload', myBeforeUnloadListener);

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
            socket.off("language-changed");
            socket.off("set-caller-signal");
            socket.off("newRandomQuestion");
            socket.off("updateRandomQuestion");
            socket.off("disconnected");
            window.removeEventListener('unload', myBeforeUnloadListener);

            socket.disconnect();

            console.log("Disconnected from socket.io");

            console.log("Destroyed user media stream");
        };
    }, []);

    const handleRefreshQuestion = async () => {
        // Call fetchRandomEasyQuestion when "Change Question" button is clicked
        const newQuestion = await fetchRandomEasyQuestion(); // Use async and await so that randomQuestion will be updated FIRST!
        updateData(editorText, selectedLanguage, newQuestion);
    };

    socket.on("editor-changed", (text) => {
        if (editorText !== text) {
            setEditorText(text);
        }
    });

    const handleEditorChange = (newValue) => {
        setEditorText(newValue);
        updateData(newValue, selectedLanguage, randomQuestion);
        socket.emit("editor-change", { text: newValue, roomId: roomId });
    };

    const leaveCall = () => {
        // Disconnect from the room
        console.log("Leaving call");
        socket.emit("disconnected", { roomId: roomId });
        socket.disconnect();
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

            // Emit message to server and the current time
            socket.emit("chatMessage", msg, roomId, user.user.username, new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
            e.target.elements.msg.value = "";
        });

        socket.on("message", (data) => {
            console.log("message:", data.message);
            outputMessage(data);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        });

        // Output message to DOM
        function outputMessage(data) {
            const div = document.createElement("div");
            div.classList.add("message");
            div.innerHTML = `
                <div class="message-content">
                    <p class="meta">${data.time}</p>
                    <p class="username">${data.username}:</p>
                    <p class="message-text">${data.message}</p>
                </div>
            `;
            document.querySelector('.chat-messages').appendChild(div);
        }

        return () => {
            socket.off("message");
            socket.off("chatMessage");
        };
    }, []);

    const handleLanguageChange = (selectedOption) => {
        console.log(`Option selected:`, selectedOption);
        setSelectedLanguage(selectedOption);
        updateData(editorText, selectedOption, randomQuestion);
        socket.emit("language-change", { label: selectedOption.label, value: selectedOption.value, roomId: roomId });
    };

    const handleExit = () => {
        leaveCall();
        window.location.href = "/";
    };

    return (
        <div className="room-container">
            <div className="container">
                <div className="right-panel">
                    <div className="editor-container">
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
                    </div>
                </div>
            <div className="middle-panel">
                <div className="question-container">
                    <button className="exit-button" onClick={handleExit}>
                        Exit
                    </button>
                    <DisplayRandomQuestion
                        user={user}
                        randomQuestion={randomQuestion}
                        handleRefreshQuestion={handleRefreshQuestion}
                    />
                </div>
            </div>
        </div>
        <div className="bottom-container">
            <main class="chat-main">
                        <div class="chat-messages"></div>
                    </main>
                    <div class="chat-form-container">
                        <form id="chat-form" class="chat-form">
                        <input
                            id="msg"
                            type="text"
                            placeholder="Enter Message"
                            required
                            autocomplete="off"
                        />
                        <button class="btn"><i class="fas fa-paper-plane"></i></button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Room;

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
