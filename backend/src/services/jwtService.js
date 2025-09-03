// Professional JWT Token Service
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

class JWTService {
  constructor() {
    // JWT secrets from environment
    this.ACCESS_TOKEN_SECRET =
      process.env.JWT_ACCESS_SECRET ||
      "your-super-secure-access-secret-key-2024";
    this.REFRESH_TOKEN_SECRET =
      process.env.JWT_REFRESH_SECRET ||
      "your-super-secure-refresh-secret-key-2024";

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
        email: payload.email,
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
      const decoded = jwt.verify(token, this.ACCESS_TOKEN_SECRET);
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

      const decoded = jwt.verify(token, this.REFRESH_TOKEN_SECRET);
      if (decoded.type !== "refresh") {
        throw new Error("Invalid token type");
      }
      return { valid: true, payload: decoded };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }

  // Refresh Access Token
  async refreshAccessToken(refreshToken) {
    const verification = this.verifyRefreshToken(refreshToken);

    if (!verification.valid) {
      throw new Error("Invalid refresh token");
    }

    // Here you would typically fetch user data from database
    // For now, return basic payload structure
    const { userId } = verification.payload;

    return {
      userId,
      // You'd fetch other user data from DB here
    };
  }

  // Revoke Refresh Token
  revokeRefreshToken(token) {
    this.refreshTokens.delete(token);
  }

  // Revoke all refresh tokens for a user
  revokeAllRefreshTokens(userId) {
    for (const token of this.refreshTokens) {
      try {
        const decoded = jwt.verify(token, this.REFRESH_TOKEN_SECRET);
        if (decoded.userId === userId) {
          this.refreshTokens.delete(token);
        }
      } catch (error) {
        // Token is invalid, remove it
        this.refreshTokens.delete(token);
      }
    }
  }

  // Get token info without verification (for debugging)
  decodeToken(token) {
    try {
      return jwt.decode(token, { complete: true });
    } catch (error) {
      return null;
    }
  }
}

module.exports = new JWTService();
