// Professional JWT Token Service
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

class JWTService {
  constructor() {
    // JWT secrets from environment
    this.ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET;
    this.REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET;
    if (!this.ACCESS_TOKEN_SECRET?.trim() || !this.REFRESH_TOKEN_SECRET?.trim()) {
      throw new Error("JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be configured");
    }

    // Token expiration times
    this.ACCESS_TOKEN_EXPIRY = "15m"; // 15 minutes
    this.REFRESH_TOKEN_EXPIRY = "7d"; // 7 days

    // In-memory refresh token store (use Redis in production)
    this.refreshTokens = new Set();
  }

  // Generate Access Token (short-lived)
  generateAccessToken(payload) {
    return jwt.sign(
      {
        userId: payload.userId,
        username: payload.username,
        userType: payload.userType,
        name: payload.name,
        office_id: payload.office_id || null,
        type: "access",
      },
      this.ACCESS_TOKEN_SECRET,
      {
        expiresIn: this.ACCESS_TOKEN_EXPIRY,
        issuer: "adzu-sdu-api",
        audience: "adzu-sdu-client",
        subject: payload.userId.toString(),
      }
    );
  }

  // Generate Refresh Token (long-lived)
  generateRefreshToken(userId) {
    const tokenId = crypto.randomUUID();
    const refreshToken = jwt.sign(
      {
        userId,
        tokenId,
        type: "refresh",
      },
      this.REFRESH_TOKEN_SECRET,
      {
        expiresIn: this.REFRESH_TOKEN_EXPIRY,
        issuer: "adzu-sdu-api",
        audience: "adzu-sdu-client",
        subject: userId.toString(),
      }
    );

    // Store refresh token
    this.refreshTokens.add(refreshToken);
    return refreshToken;
  }

  // Verify Access Token
  verifyAccessToken(token) {
    try {
      const decoded = jwt.verify(token, this.ACCESS_TOKEN_SECRET, {
        algorithms: ["HS256"],
        issuer: "adzu-sdu-api",
        audience: "adzu-sdu-client",
      });
      if (decoded.type !== "access") {
        throw new Error("Invalid token type");
      }
      return { valid: true, payload: decoded };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }

  // Verify Refresh Token
  verifyRefreshToken(token) {
    try {
      // Check if token exists in store
      if (!this.refreshTokens.has(token)) {
        throw new Error("Refresh token not found");
      }

      const decoded = jwt.verify(token, this.REFRESH_TOKEN_SECRET, {
        algorithms: ["HS256"],
        issuer: "adzu-sdu-api",
        audience: "adzu-sdu-client",
      });
      if (decoded.type !== "refresh") {
        throw new Error("Invalid token type");
      }
      return { valid: true, payload: decoded };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }

  // Revoke Refresh Token
  revokeRefreshToken(token) {
    this.refreshTokens.delete(token);
  }
}

module.exports = new JWTService();
