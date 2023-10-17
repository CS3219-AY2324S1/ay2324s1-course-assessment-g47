require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios"); // Import Axios
const pool = require("./database");
const historyPort = process.env.HISTORYPORT;
const postgresqlPort = process.env.POSTGRESQLPORT;
const http = require("http");

const appForHistory = express();

// Middleware setup for both Express instances
appForHistory.use(express.json());
appForHistory.use(cors());

appForHistory.post("/history/manage-code-attempt", async (req, res) => {
    res.setHeader("Content-Type", "application/json");

    const { currUsername, matchedUsername, randomQuestion, roomId, codeText } = req.body;

    console.log("Current User: ", currUsername);
    console.log("Matched User: ", matchedUsername);
    console.log("Question: ", randomQuestion);
    console.log("Room ID: ", roomId);
    console.log("Code: ", codeText);

    try {
        const postData = JSON.stringify(req.body);

        // Use Axios to send the POST request
        const axiosOptions = {
            baseURL: `http://localhost:${postgresqlPort}`, // Adjust the base URL
            url: "/code-attempt-management/manage-code-attempt",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            data: postData,
        };

        const response = await axios(axiosOptions);

        if (response.status === 200) {
            // Successful update of Code Attempt History
            const data = response.data;
            console.log(data);
            console.log(`Updated the code attempt in the database for ${randomQuestion.title} for ${currUsername} and ${matchedUsername}.`);
            res.status(200).json(data); // Send a JSON response to the frontend
        } else {
            // Handle other error cases
            console.error("Server error");
            res.status(response.status).json({ message: "Server error" }); // Send an error response
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message }); // Send an error response
    }
    // try {
    //     const postData = JSON.stringify(req.body);

    //     const options = {
    //         hostname: "localhost",
    //         port: postgresqlPort, // Replace with the port of your PostgreSQL service
    //         path: "/code-attempt-management/manage-code-attempt",
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //             "Content-Length": Buffer.byteLength(postData),
    //         },
    //     };

    //     const request = http.request(options, (response) => {
    //         let responseData = "";

    //         response.on("data", (chunk) => {
    //             responseData += chunk;
    //         });

    //         response.on("end", () => {
    //             if (response.statusCode === 200) {
    //                 // Successful update of Code Attempt History
    //                 const data = JSON.parse(responseData);
    //                 console.log(data);
    //                 console.log(`Updated the code attempt in the database for ${randomQuestion.title} for ${currUsername} and ${matchedUsername}.`);
    //                 res.status(200).json(data); // Send a JSON response to the frontend
    //             } else {
    //                 // Handle other error cases
    //                 console.log("Server error");
    //                 res.status(response.statusCode).json({ message: "Server error" }); // Send an error response
    //             }
    //         });
    //     });

    //     request.on("error", (error) => {
    //         console.error(error);
    //         res.status(500).json({ message: error.message }); // Send an error response
    //     });

    //     request.write(postData);
    //     request.end();
    // } catch (err) {
    //     console.error(err);
    //     res.status(500).json({ message: err.message }); // Send an error response
    // }
});
// For History Service
appForHistory.listen(historyPort, () => {
    console.log(`History service running on port ${historyPort}`);
});
