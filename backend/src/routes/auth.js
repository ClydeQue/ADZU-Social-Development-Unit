// Simple Authentication Routes
const express = require("express");
const AuthController = require("../controllers/authController");
const { checkLoginRateLimit } = require("../middleware/loginRateLimiter");

const router = express.Router();

// Office user login (with rate limiting)
router.post("/login/office", checkLoginRateLimit, AuthController.loginOffice);

// Unit Director login (with rate limiting)
router.post(
  "/login/unit-director",
  checkLoginRateLimit,
  AuthController.loginUnitDirector
);

// Logout
router.post("/logout", AuthController.logout);

// Refresh access token using HttpOnly cookie
router.post("/refresh", AuthController.refreshToken);

// Change password (for office users and unit director)
router.post("/change-password", AuthController.changePassword);

// Change username (for office users and unit director)
router.post("/change-username", AuthController.changeUsername);

// Forgot password - submit reset request
router.post("/forgot-password", AuthController.forgotPassword);

module.exports = router;
