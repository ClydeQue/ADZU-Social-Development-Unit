// JWT Authentication Middleware with Access/Refresh Token System
const tokenService = require("../services/tokenService");

// Legacy middleware (keeping for backward compatibility)
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token =
    req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token." });
  }
};

const adminAuthMiddleware = (req, res, next) => {
  authMiddleware(req, res, (err) => {
    if (err) return next(err);

    if (req.user.role !== "unit_director") {
      return res
        .status(403)
        .json({ error: "Access denied. Admin privileges required." });
    }
    next();
  });
};

// New JWT middleware with proper access/refresh token system
// Middleware to verify access token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      error: "Access token required",
      message: "Please provide a valid access token",
    });
  }

  const verification = tokenService.verifyAccessToken(token);

  if (!verification.valid) {
    if (verification.expired) {
      return res.status(401).json({
        error: "Token expired",
        message: "Access token has expired, please refresh",
        code: "TOKEN_EXPIRED",
      });
    }

    return res.status(403).json({
      error: "Invalid token",
      message: "Access token is invalid or malformed",
    });
  }

  // Add user info to request
  req.user = {
    userId: verification.decoded.userId,
    userType: verification.decoded.userType,
    tokenExp: verification.decoded.exp,
  };

  console.log(`✅ Authenticated: ${req.user.userType} ${req.user.userId}`);
  next();
};

// Middleware to check user role
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: "Authentication required",
        message: "Please authenticate first",
      });
    }

    const userRole = req.user.userType;
    const allowed = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    if (!allowed.includes(userRole)) {
      console.log(
        `🚫 Access denied: ${userRole} tried to access ${allowed.join(
          "|"
        )} resource`
      );
      return res.status(403).json({
        error: "Insufficient permissions",
        message: `This resource requires ${allowed.join(" or ")} role`,
        userRole,
        requiredRoles: allowed,
      });
    }

    next();
  };
};

// Middleware to check if user owns resource
const requireOwnership = (userIdField = "userId") => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: "Authentication required",
      });
    }

    const resourceUserId = req.params[userIdField] || req.body[userIdField];

    if (req.user.userId !== resourceUserId) {
      console.log(
        `🚫 Ownership denied: ${req.user.userId} tried to access resource owned by ${resourceUserId}`
      );
      return res.status(403).json({
        error: "Access denied",
        message: "You can only access your own resources",
      });
    }

    next();
  };
};

// Optional authentication (for public endpoints that benefit from user context)
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    req.user = null;
    return next();
  }

  const verification = tokenService.verifyAccessToken(token);

  if (verification.valid) {
    req.user = {
      userId: verification.decoded.userId,
      userType: verification.decoded.userType,
      tokenExp: verification.decoded.exp,
    };
  } else {
    req.user = null;
  }

  next();
};

module.exports = {
  authMiddleware,
  adminAuthMiddleware,
  authenticateToken,
  requireRole,
  requireOwnership,
  optionalAuth,
};
