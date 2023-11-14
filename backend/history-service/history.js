require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./database");
let historyPort;

if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'ci') {
    historyPort = 8093;
} else {
    historyPort = process.env.HISTORYPORT || 8085;
}

const appForHistory = express();

// Middleware setup for both Express instances
appForHistory.use(express.json());
appForHistory.use(cors());

// Edit the code attempt entry in the database
appForHistory.post("/api/history/manage-code-attempt", async (req, res) => {
	res.setHeader("Content-Type", "application/json");

	const { currUsername, matchedEmail, question, roomId, codeText, language, currDateTime } = req.body;


	// Extract out relevant information about the question
	const questionName = question.title;
    const questionDifficulty = question.complexity;
    const questionCategory = question.category;
    const dateTimeInfo = currDateTime;
    const questionDescription = question.description;
    const questionCreatedTime = question.createdAt;
    const questionUpdatedTime = question.updatedAt;

	try {
		// Check if the code attempt exists in the database already
		const codeAttemptExistsQuery = `
            SELECT *
            FROM code_attempts
            WHERE (
                (user1_email = $1 OR user2_email = $1)
                AND (user1_email = $2 OR user2_email = $2)
                AND room_id = $3
            );
        `;
		const codeAttemptExistsResult = await pool.query(
			codeAttemptExistsQuery,
			[currUsername, matchedEmail, roomId]
		);

		// Modify the entry in the database if code attempt exists
		if (codeAttemptExistsResult.rowCount > 0) {
			const updateQuery = `
                UPDATE code_attempts
                SET question_name = $1, question_difficulty = $2, question_category = $3, question_description = $4, code = $5, timestamp = $6, language = $10
                WHERE (
                    (user1_email = $7 OR user2_email = $7)
                    AND (user1_email = $8 OR user2_email = $8)
                    AND room_id = $9
                );
            `;
			await pool.query(updateQuery, [questionName, questionDifficulty, questionCategory, questionDescription, codeText, dateTimeInfo, currUsername, matchedEmail, roomId, language]);
            return res.status(200).json({ message: "Code attempt updated successfully into the database for storage.", data: req.body });
		} else { // Else add the code attempt into the database as a new entry
            const insertQuery = `
                INSERT INTO code_attempts (user1_email, user2_email, room_id, question_name, question_difficulty, question_category, question_description, code, timestamp, language, question_created_timestamp, question_updated_timestamp)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            `;
            await pool.query(insertQuery, [currUsername, matchedEmail, roomId, questionName, questionDifficulty, questionCategory, questionDescription, codeText, dateTimeInfo, language, questionCreatedTime, questionUpdatedTime]);
            return res.status(200).json({ message: "Code attempt inserted successfully into the database for storage." });
        }
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: err.message });
	}
});

// For History Service
appForHistory.listen(historyPort, () => {
	console.log(`History service running on port ${historyPort}`);
});

module.exports = appForHistory;