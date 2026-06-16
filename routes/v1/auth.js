const express = require("express");
const router = express.Router();

const authController = require("../../controllers/v1/auth");

const authMiddleware = require("../../middleware/authMiddleware");

router.post("/send-otp", authController.sendOtp);
router.post("/verify-otp", authController.verifyOtp);
router.get("/profile", authController.profile);
router.post("/resend-otp", authController.resendOtp);

module.exports = router;
