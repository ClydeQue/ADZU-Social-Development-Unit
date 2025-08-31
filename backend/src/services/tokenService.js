// JWT Token Service with Access/Refresh Token System
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

class TokenService {
  constructor() {
    // Use environment variables in production
    this.ACCESS_TOKEN_SECRET =
      process.env.ACCESS_TOKEN_SECRET || "your-super-secret-access-key-2024";
    this.REFRESH_TOKEN_SECRET =
      process.env.REFRESH_TOKEN_SECRET || "your-super-secret-refresh-key-2024";

    // Token lifetimes
    this.ACCESS_TOKEN_LIFETIME = "15m"; // 15 minutes
    this.REFRESH_TOKEN_LIFETIME = "7d"; // 7 days

    // In-memory refresh token store (use Redis in production)
    this.refreshTokenStore = new Map();
  }

  // Generate access token (short-lived)
  generateAccessToken(payload) {
    return jwt.sign(
      {
        ...payload,
        type: "access",
        iat: Math.floor(Date.now() / 1000),
      },
      this.ACCESS_TOKEN_SECRET,
      {
        expiresIn: this.ACCESS_TOKEN_LIFETIME,
        issuer: "adzu-sdu",
        audience: "adzu-sdu-users",
      }
    );
  }

  // Generate refresh token (long-lived)
  generateRefreshToken(userId, userType) {
    const tokenId = crypto.randomUUID();
    const token = jwt.sign(
      {
        userId,
        userType,
        tokenId,
        type: "refresh",
        iat: Math.floor(Date.now() / 1000),
      },
      this.REFRESH_TOKEN_SECRET,
      {
        expiresIn: this.REFRESH_TOKEN_LIFETIME,
        issuer: "adzu-sdu",
        audience: "adzu-sdu-users",
      }
    );

    // Store refresh token with metadata
    this.refreshTokenStore.set(tokenId, {
      userId,
      userType,
      token,
      createdAt: new Date(),
      lastUsed: new Date(),
      isRevoked: false,
    });

    return { token, tokenId };
  }

  // Verify access token
  verifyAccessToken(token) {
    try {
      const decoded = jwt.verify(token, this.ACCESS_TOKEN_SECRET, {
        issuer: "adzu-sdu",
        audience: "adzu-sdu-users",
      });

      if (decoded.type !== "access") {
        throw new Error("Invalid token type");
      }

      return { valid: true, decoded };
    } catch (error) {
      return {
        valid: false,
        error: error.message,
        expired: error.name === "TokenExpiredError",
      };
    }
  }

  // Verify refresh token
  verifyRefreshToken(token) {
    try {
      const decoded = jwt.verify(token, this.REFRESH_TOKEN_SECRET, {
        issuer: "adzu-sdu",
        audience: "adzu-sdu-users",
      });

      if (decoded.type !== "refresh") {
        throw new Error("Invalid token type");
      }

      // Check if token exists in store and is not revoked
      const storedToken = this.refreshTokenStore.get(decoded.tokenId);
      if (!storedToken || storedToken.isRevoked) {
        throw new Error("Token revoked or not found");
      }

      // Update last used timestamp
      storedToken.lastUsed = new Date();

      return { valid: true, decoded, storedToken };
    } catch (error) {
      return {
        valid: false,
        error: error.message,
        expired: error.name === "TokenExpiredError",
      };
    }
  }

  // Refresh access token using refresh token
  refreshAccessToken(refreshToken) {
    const verification = this.verifyRefreshToken(refreshToken);

    if (!verification.valid) {
      return { success: false, error: verification.error };
    }

    const { decoded, storedToken } = verification;

    // Generate new access token
    const newAccessToken = this.generateAccessToken({
      userId: decoded.userId,
      userType: decoded.userType,
    });

    // Generate new refresh token (rotate)
    const newRefreshToken = this.generateRefreshToken(
      decoded.userId,
      decoded.userType
    );

    // Revoke old refresh token
    this.revokeRefreshToken(decoded.tokenId);

    console.log(`✅ Token refreshed for user: ${decoded.userId}`);

    return {
      success: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken.token,
      refreshTokenId: newRefreshToken.tokenId,
    };
  }

  // Revoke refresh token
  revokeRefreshToken(tokenId) {
    const storedToken = this.refreshTokenStore.get(tokenId);
    if (storedToken) {
      storedToken.isRevoked = true;
      storedToken.revokedAt = new Date();
      console.log(`🚫 Refresh token revoked: ${tokenId}`);
    }
  }

  // Revoke all refresh tokens for a user
  revokeAllUserTokens(userId) {
    let revokedCount = 0;
    for (const [tokenId, tokenData] of this.refreshTokenStore.entries()) {
      if (tokenData.userId === userId && !tokenData.isRevoked) {
        tokenData.isRevoked = true;
        tokenData.revokedAt = new Date();
        revokedCount++;
      }
    }
    console.log(`🚫 Revoked ${revokedCount} tokens for user: ${userId}`);
    return revokedCount;
  }

  // Clean up expired tokens (run periodically)
  cleanupExpiredTokens() {
    let cleanedCount = 0;
    const now = new Date();

    for (const [tokenId, tokenData] of this.refreshTokenStore.entries()) {
      try {
        jwt.verify(tokenData.token, this.REFRESH_TOKEN_SECRET);
      } catch (error) {
        if (error.name === "TokenExpiredError") {
          this.refreshTokenStore.delete(tokenId);
          cleanedCount++;
        }
      }
    }

    if (cleanedCount > 0) {
      console.log(`🧹 Cleaned up ${cleanedCount} expired refresh tokens`);
    }
  }

  // Get token statistics
  getTokenStats() {
    const activeTokens = Array.from(this.refreshTokenStore.values()).filter(
      (token) => !token.isRevoked
    );

    return {
      totalTokens: this.refreshTokenStore.size,
      activeTokens: activeTokens.length,
      revokedTokens: this.refreshTokenStore.size - activeTokens.length,
    };
  }
}

// Singleton instance
const tokenService = new TokenService();

// Clean up expired tokens every hour
setInterval(() => {
  tokenService.cleanupExpiredTokens();
}, 60 * 60 * 1000);

module.exports = tokenService;
