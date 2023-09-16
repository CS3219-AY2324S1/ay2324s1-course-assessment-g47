const express = require("express");
const router = express.Router();

const EmailVerificationRoutes = require("../email_verification/routes");
const OTPRoutes = require("../otp/routes");

// console.log("here");
router.use("/email_verification", EmailVerificationRoutes);
router.use("/otp", OTPRoutes);
// console.log("here2");

module.exports = router;