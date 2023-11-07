const express = require("express");
const userController = require("../controllers/userController");
const authenticateToken = require("../middleware/authorization");

const router = express.Router();

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.post(
	"/update/:id",
	authenticateToken(["user", "superuser", "admin", "superadmin"]),
	userController.updateUserById
);
router.post(
	"/update_password",
	authenticateToken(["user", "superuser", "admin", "superadmin"]),
	userController.updatePasswordByEmail
);
router.post(
	"/delete",
	authenticateToken(["user", "superuser", "admin", "superadmin"]),
	userController.deleteUserByEmail
);
router.post(
	"/update/type/:id",
	authenticateToken(["user", "superuser", "admin", "superadmin"]),
	userController.updateAccountTypeByEmail
);
router.post("/verifyOTP", userController.verifyOTP);
router.post(
	"/resendOTPVerificationCode",
	userController.resendOTPVerificationCode
);
router.post(
	"/fetch/:id",
	authenticateToken(["user", "superuser", "admin", "superadmin"]),
	userController.fetchUserInfo
);
router.post(
	"/fetch/:id/username",
	authenticateToken(["user", "superuser", "admin", "superadmin"]),
	userController.fetchUserEmail
);
router.post(
	"/user-history/:id",
	authenticateToken(["user", "superuser", "admin", "superadmin"]),
	userController.fetchUserHistory
);

module.exports = router;
