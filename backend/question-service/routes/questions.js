const express = require("express");
const {
	getQuestions,
	getQuestion,
	createQuestion,
	deleteQuestion,
	updateQuestion,
} = require("../controllers/questionController");

const router = express.Router();
const authenticateToken = require("../middleware/authorization"); // Import the middleware

// All authenticated users can access this route
router.get(
	"/",
	authenticateToken(["user", "superuser", "admin", "superadmin"]),
	getQuestions
);

// All authenticated can access this route
router.get(
	"/:id",
	authenticateToken(["user", "superuser", "admin", "superadmin"]),
	getQuestion
);

// Only superuser, admin and superadmin can access this route
router.post(
	"/",
	authenticateToken(["superuser", "admin", "superadmin"]),
	createQuestion
);

// Only superuser, admin and superadmin can access this route
router.delete(
	"/:id",
	authenticateToken(["superuser", "admin", "superadmin"]),
	deleteQuestion
);

// Only superuser, admin and superadmin can access this route
router.patch(
	"/:id",
	authenticateToken(["superuser", "admin", "superadmin"]),
	updateQuestion
);

module.exports = router;
