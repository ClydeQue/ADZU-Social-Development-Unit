
const jwtService = require("../services/jwtService");

// ========================================
// AUTHENTICATE TOKEN - Verify JWT
// ========================================
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      error: "Access token required",
      message: "Please provide a valid access token",
    });
  }

  const verification = jwtService.verifyAccessToken(token);

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

  // Add user info to request (includes office_id for office users)
  // Note: jwtService returns 'payload' not 'decoded'
  const decoded = verification.payload || verification.decoded;
  req.user = {
    userId: decoded.userId,
    userType: decoded.userType,
    email: decoded.email,
    name: decoded.name,
    office_id: decoded.office_id || null, // CRITICAL: Office ID for access control
    office: decoded.office || null,
    tokenExp: decoded.exp,
  };

  console.log(`✅ Authenticated: ${req.user.userType} - ${req.user.name} ${req.user.office_id ? `(Office: ${req.user.office_id})` : '(All Offices)'}`);
  next();
};

// ========================================
// REQUIRE ROLE - Check user type
// ========================================
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

// ========================================
// STRICT OFFICE ACCESS CONTROL
// Office users can ONLY access their own office data
// Unit Director can access ALL offices
// ========================================
const requireOfficeAccess = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: "Authentication required",
      message: "Please authenticate first",
    });
  }

  const { userType, office_id: userOfficeId } = req.user;

  // Unit Director has access to ALL offices
  if (userType === "unit_director") {
    console.log("✅ Unit Director: Access granted to all offices");
    req.canAccessAllOffices = true;
    return next();
  }

  // Office user: Check office_id in params or body
  const requestedOfficeId = req.params.office_id || req.body.office_id;

  if (requestedOfficeId && requestedOfficeId !== userOfficeId) {
    console.log(
      `🚫 Access denied: Office user ${userOfficeId} cannot access office ${requestedOfficeId}`
    );
    return res.status(403).json({
      error: "Access denied",
      message: "You can only access your own office data",
      userOffice: userOfficeId,
      requestedOffice: requestedOfficeId,
    });
  }

  console.log(`✅ Office user: Access granted to office ${userOfficeId}`);
  req.canAccessAllOffices = false;
  req.userOfficeId = userOfficeId;
  next();
};

// ========================================
// FILTER BY OFFICE - Automatically filter queries by office
// Adds office_id filter for office users, no filter for Unit Director
// ========================================
const filterByOffice = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: "Authentication required",
    });
  }

  const { userType, office_id: userOfficeId } = req.user;

  if (userType === "office_user") {
    // Force office_id filter for office users
    req.officeFilter = userOfficeId;
    // Also set in body for create/update operations
    if (req.method === "POST" || req.method === "PUT" || req.method === "PATCH") {
      req.body.office_id = userOfficeId;
    }
    console.log(`🔒 Query filtered to office: ${userOfficeId}`);
  } else if (userType === "unit_director") {
    // No filter for Unit Director (access all offices)
    req.officeFilter = null;
    console.log("🔓 No office filter (Unit Director)");
  }

  next();
};

// ========================================
// REQUIRE OWNERSHIP - Check resource ownership
// ========================================
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

// ========================================
// OPTIONAL AUTHENTICATION
// For public endpoints that benefit from user context
// ========================================
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    req.user = null;
    return next();
  }

  const verification = jwtService.verifyAccessToken(token);

  if (verification.valid) {
    const decoded = verification.payload || verification.decoded;
    req.user = {
      userId: decoded.userId,
      userType: decoded.userType,
      email: decoded.email,
      name: decoded.name,
      office_id: decoded.office_id || null,
      office: decoded.office || null,
      tokenExp: decoded.exp,
    };
  } else {
    req.user = null;
  }

  next();
};

// ========================================
// REQUIRE UNIT DIRECTOR
// Shorthand for requireRole(["unit_director"])
// ========================================
const requireUnitDirector = requireRole(["unit_director"]);

// ========================================
// REQUIRE OFFICE USER
// Shorthand for requireRole(["office_user"])
// ========================================
const requireOfficeUser = requireRole(["office_user"]);

module.exports = {
  authenticateToken,
  requireRole,
  requireOfficeAccess,
  filterByOffice,
  requireOwnership,
  optionalAuth,
  requireUnitDirector,
  requireOfficeUser,
};
