// Secure Authentication Routes with Rate Limiting
const express = require("express");
const SecureAuthController = require("../controllers/secureAuthController");
const {
  loginLimiter,
  apiLimiter,
  anomalyDetection,
} = require("../middleware/rateLimiter");
const { authenticateToken, requireRole } = require("../middleware/auth");

const router = express.Router();

// Apply anomaly detection to all auth routes
router.use(anomalyDetection);

// Login routes with rate limiting
router.post("/login/office", loginLimiter, SecureAuthController.loginOffice);
router.post(
  "/login/unit-director",
  loginLimiter,
  SecureAuthController.loginUnitDirector
);

// Token management routes
router.post("/refresh", apiLimiter, SecureAuthController.refreshToken);
router.post("/logout", apiLimiter, SecureAuthController.logout);
router.post("/logout-all", authenticateToken, SecureAuthController.logoutAll);

// User profile route (requires authentication)
router.get("/profile", authenticateToken, SecureAuthController.getProfile);

// Admin-only token statistics
router.get(
  "/token-stats",
  authenticateToken,
  requireRole("unit_director"),
  SecureAuthController.getTokenStats
);

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Secure auth service is running",
    timestamp: new Date().toISOString(),
    rateLimiting: "enabled",
    security: "enhanced",
  });
});

module.exports = router;
