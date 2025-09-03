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

// Verify session (for protected routes)
router.get("/verify", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "No valid token provided",
    });
  }

  const token = authHeader.substring(7);
  const validation = AuthController.validateSession(token);

  if (validation.valid) {
    res.json({
      success: true,
      message: "Session valid",
      session: validation.session,
    });
  } else {
    res.status(401).json({
      success: false,
      message: validation.reason,
    });
  }
});

module.exports = router;
