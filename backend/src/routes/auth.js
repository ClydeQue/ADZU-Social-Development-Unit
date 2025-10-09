// Simple Authentication Routes
const express = require("express");
const AuthController = require("../controllers/authController");

const router = express.Router();

// Office user login
router.post("/login/office", AuthController.loginOffice);

// Unit Director login
router.post("/login/unit-director", AuthController.loginUnitDirector);

// Logout
router.post("/logout", AuthController.logout);

// Refresh access token using HttpOnly cookie
router.post("/refresh", AuthController.refreshToken);

module.exports = router;
