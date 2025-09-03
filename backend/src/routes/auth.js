// Professional Authentication Routes
const express = require("express");
const AuthController = require("../controllers/authController");

const router = express.Router();

// Authentication endpoints
router.post("/login/office", AuthController.loginOffice);
router.post("/login/unit-director", AuthController.loginUnitDirector);
router.post("/refresh", AuthController.refreshToken);
router.post("/logout", AuthController.logout);
router.get("/verify", AuthController.verifyToken);

module.exports = router;
