// Secure Authentication Controller with JWT Access/Refresh Tokens
const bcryptjs = require("bcryptjs");
const { createClient } = require("@supabase/supabase-js");
const tokenService = require("../services/tokenService");

// Supabase client - Using environment variables for security
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

class SecureAuthController {
  // Office user login
  static async loginOffice(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          error: "Missing credentials",
          message: "Email and password are required",
        });
      }

      console.log(`🔐 Office login attempt: ${email}`);

      // Get user from database
      const { data: users, error } = await supabase
        .from("office_users")
        .select("*")
        .eq("email", email.trim().toLowerCase())
        .limit(1);

      if (error) {
        console.error("Database error:", error);
        return res.status(500).json({
          error: "Database error",
          message: "Unable to verify credentials",
        });
      }

      if (!users || users.length === 0) {
        return res.status(401).json({
          error: "Invalid credentials",
          message: "Email or password is incorrect",
        });
      }

      const user = users[0];

      // Verify password
      const isValidPassword = await bcryptjs.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          error: "Invalid credentials",
          message: "Email or password is incorrect",
        });
      }

      // Generate tokens
      const accessToken = tokenService.generateAccessToken({
        userId: user.id,
        userType: "office_user",
        email: user.email,
        name: user.name,
        office_id: user.office_id,
      });

      const refreshToken = tokenService.generateRefreshToken(
        user.id,
        "office_user"
      );

      console.log(`✅ Office login successful: ${user.email}`);

      // Set refresh token in httpOnly cookie
      res.cookie("refreshToken", refreshToken.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // HTTPS in production
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.json({
        success: true,
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          office_id: user.office_id,
          userType: "office_user",
        },
        accessToken,
        tokenExpiry: "15m",
      });
    } catch (error) {
      console.error("Office login error:", error);
      res.status(500).json({
        error: "Login failed",
        message: "An unexpected error occurred",
      });
    }
  }

  // Unit director login
  static async loginUnitDirector(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          error: "Missing credentials",
          message: "Email and password are required",
        });
      }

      console.log(`🔐 Unit Director login attempt: ${email}`);

      // Get director from database
      const { data: directors, error } = await supabase
        .from("unit_directors")
        .select("*")
        .eq("email", email.trim().toLowerCase())
        .limit(1);

      if (error) {
        console.error("Database error:", error);
        return res.status(500).json({
          error: "Database error",
          message: "Unable to verify credentials",
        });
      }

      if (!directors || directors.length === 0) {
        return res.status(401).json({
          error: "Invalid credentials",
          message: "Email or password is incorrect",
        });
      }

      const director = directors[0];

      // Verify password
      const isValidPassword = await bcryptjs.compare(
        password,
        director.password
      );
      if (!isValidPassword) {
        return res.status(401).json({
          error: "Invalid credentials",
          message: "Email or password is incorrect",
        });
      }

      // Generate tokens
      const accessToken = tokenService.generateAccessToken({
        userId: director.id,
        userType: "unit_director",
        email: director.email,
        name: director.name,
      });

      const refreshToken = tokenService.generateRefreshToken(
        director.id,
        "unit_director"
      );

      console.log(`✅ Unit Director login successful: ${director.email}`);

      // Set refresh token in httpOnly cookie
      res.cookie("refreshToken", refreshToken.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.json({
        success: true,
        message: "Login successful",
        user: {
          id: director.id,
          email: director.email,
          name: director.name,
          userType: "unit_director",
        },
        accessToken,
        tokenExpiry: "15m",
      });
    } catch (error) {
      console.error("Unit Director login error:", error);
      res.status(500).json({
        error: "Login failed",
        message: "An unexpected error occurred",
      });
    }
  }

  // Refresh access token
  static async refreshToken(req, res) {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        return res.status(401).json({
          error: "Refresh token required",
          message: "No refresh token provided",
        });
      }

      const result = tokenService.refreshAccessToken(refreshToken);

      if (!result.success) {
        // Clear invalid refresh token
        res.clearCookie("refreshToken");
        return res.status(401).json({
          error: "Invalid refresh token",
          message: result.error,
        });
      }

      // Set new refresh token in cookie
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({
        success: true,
        accessToken: result.accessToken,
        tokenExpiry: "15m",
      });
    } catch (error) {
      console.error("Token refresh error:", error);
      res.status(500).json({
        error: "Token refresh failed",
        message: "An unexpected error occurred",
      });
    }
  }

  // Logout
  static async logout(req, res) {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (refreshToken) {
        // Try to revoke the refresh token
        const verification = tokenService.verifyRefreshToken(refreshToken);
        if (verification.valid) {
          tokenService.revokeRefreshToken(verification.decoded.tokenId);
        }
      }

      // Clear refresh token cookie
      res.clearCookie("refreshToken");

      console.log("✅ User logged out successfully");
      res.json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear cookie even if there's an error
      res.clearCookie("refreshToken");
      res.json({
        success: true,
        message: "Logged out successfully",
      });
    }
  }

  // Logout from all devices
  static async logoutAll(req, res) {
    try {
      const refreshToken = req.cookies.refreshToken;
      let userId = null;

      if (refreshToken) {
        const verification = tokenService.verifyRefreshToken(refreshToken);
        if (verification.valid) {
          userId = verification.decoded.userId;
          tokenService.revokeAllUserTokens(userId);
        }
      }

      // If we have access token info from middleware
      if (req.user && req.user.userId) {
        tokenService.revokeAllUserTokens(req.user.userId);
      }

      res.clearCookie("refreshToken");

      console.log(
        `✅ All sessions revoked for user: ${userId || req.user?.userId}`
      );
      res.json({
        success: true,
        message: "Logged out from all devices successfully",
      });
    } catch (error) {
      console.error("Logout all error:", error);
      res.clearCookie("refreshToken");
      res.json({
        success: true,
        message: "Logged out from all devices successfully",
      });
    }
  }

  // Get current user profile
  static async getProfile(req, res) {
    try {
      const { userId, userType } = req.user;

      let user;
      if (userType === "office_user") {
        const { data, error } = await supabase
          .from("office_users")
          .select("id, name, email, office_id, created_at")
          .eq("id", userId)
          .single();

        if (error) throw error;
        user = data;
      } else if (userType === "unit_director") {
        const { data, error } = await supabase
          .from("unit_directors")
          .select("id, name, email, created_at")
          .eq("id", userId)
          .single();

        if (error) throw error;
        user = data;
      }

      if (!user) {
        return res.status(404).json({
          error: "User not found",
          message: "User profile not found",
        });
      }

      res.json({
        success: true,
        user: {
          ...user,
          userType,
        },
      });
    } catch (error) {
      console.error("Get profile error:", error);
      res.status(500).json({
        error: "Profile fetch failed",
        message: "Unable to fetch user profile",
      });
    }
  }

  // Get token statistics (admin only)
  static async getTokenStats(req, res) {
    try {
      const stats = tokenService.getTokenStats();
      res.json({
        success: true,
        stats,
      });
    } catch (error) {
      console.error("Token stats error:", error);
      res.status(500).json({
        error: "Stats fetch failed",
        message: "Unable to fetch token statistics",
      });
    }
  }
}

module.exports = SecureAuthController;
