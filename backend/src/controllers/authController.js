// Professional Authentication Controller with JWT
const bcrypt = require("bcryptjs");
const supabase = require("../config/database");
const jwtService = require("../services/jwtService");

class AuthController {
  // Office User Login
  static async loginOffice(req, res) {
    try {
      const { email, password } = req.body;

      // Validation
      if (!email || !password) {
        return res.status(400).json({
          success: false,
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
          success: false,
          message: "Database error",
        });
      }

      if (!users || users.length === 0) {
        console.log(`❌ Office user not found: ${email}`);
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      const user = users[0];
      console.log(`👤 Found office user: ${user.name}`);

      // Verify password with bcrypt
      const isValidPassword = await bcrypt.compare(password, user.password);
      console.log(`🔑 Password verification: ${isValidPassword}`);

      if (!isValidPassword) {
        console.log(`❌ Invalid password for: ${email}`);
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // Generate JWT tokens
      const accessToken = jwtService.generateAccessToken({
        userId: user.id,
        email: user.email,
        userType: "office_user",
        name: user.name,
        office_id: user.office_id,
      });

      const refreshToken = jwtService.generateRefreshToken(user.id);

      console.log(`✅ Office login successful: ${user.email}`);

      // Set refresh token as httpOnly cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // Return success response
      res.json({
        success: true,
        message: "Login successful",
        data: {
          accessToken,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            office_id: user.office_id,
            userType: "office_user",
          },
        },
      });
    } catch (error) {
      console.error("❌ Office login error:", error);
      res.status(500).json({
        success: false,
        message: "Authentication failed",
      });
    }
  }

  // Unit Director Login
  static async loginUnitDirector(req, res) {
    try {
      const { email, password } = req.body;

      // Validation
      if (!email || !password) {
        return res.status(400).json({
          success: false,
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
          success: false,
          message: "Database error",
        });
      }

      if (!directors || directors.length === 0) {
        console.log(`❌ Unit Director not found: ${email}`);
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      const director = directors[0];
      console.log(`👤 Found director: ${director.name}`);

      // Verify password with bcrypt
      const isValidPassword = await bcrypt.compare(password, director.password);
      console.log(`🔑 Password verification: ${isValidPassword}`);

      if (!isValidPassword) {
        console.log(`❌ Invalid password for: ${email}`);
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // Generate JWT tokens
      const accessToken = jwtService.generateAccessToken({
        userId: director.id,
        email: director.email,
        userType: "unit_director",
        name: director.name,
      });

      const refreshToken = jwtService.generateRefreshToken(director.id);

      console.log(`✅ Unit Director login successful: ${director.email}`);

      // Set refresh token as httpOnly cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // Return success response
      res.json({
        success: true,
        message: "Login successful",
        data: {
          accessToken,
          user: {
            id: director.id,
            email: director.email,
            name: director.name,
            userType: "unit_director",
          },
        },
      });
    } catch (error) {
      console.error("❌ Unit Director login error:", error);
      res.status(500).json({
        success: false,
        message: "Authentication failed",
      });
    }
  }

  // Refresh Token
  static async refreshToken(req, res) {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          message: "No refresh token provided",
        });
      }

      console.log("🔄 Refreshing access token...");

      // Verify refresh token
      const verification = jwtService.verifyRefreshToken(refreshToken);

      if (!verification.valid) {
        console.log("❌ Invalid refresh token");
        return res.status(401).json({
          success: false,
          message: "Invalid refresh token",
        });
      }

      const { userId } = verification.payload;

      // Get user data from database (you'd implement this based on userType)
      // For now, we'll fetch from both tables
      let userData = null;

      // Try office_users first
      const { data: officeUsers } = await supabase
        .from("office_users")
        .select("*")
        .eq("id", userId)
        .limit(1);

      if (officeUsers && officeUsers.length > 0) {
        const user = officeUsers[0];
        userData = {
          userId: user.id,
          email: user.email,
          userType: "office_user",
          name: user.name,
          office_id: user.office_id,
        };
      } else {
        // Try unit_directors
        const { data: directors } = await supabase
          .from("unit_directors")
          .select("*")
          .eq("id", userId)
          .limit(1);

        if (directors && directors.length > 0) {
          const director = directors[0];
          userData = {
            userId: director.id,
            email: director.email,
            userType: "unit_director",
            name: director.name,
          };
        }
      }

      if (!userData) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }

      // Generate new access token
      const newAccessToken = jwtService.generateAccessToken(userData);

      console.log("✅ Access token refreshed successfully");

      res.json({
        success: true,
        message: "Token refreshed",
        data: {
          accessToken: newAccessToken,
        },
      });
    } catch (error) {
      console.error("❌ Token refresh error:", error);
      res.status(500).json({
        success: false,
        message: "Token refresh failed",
      });
    }
  }

  // Logout
  static async logout(req, res) {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (refreshToken) {
        // Revoke refresh token
        jwtService.revokeRefreshToken(refreshToken);
        console.log("🔓 Refresh token revoked");
      }

      // Clear cookie
      res.clearCookie("refreshToken");

      console.log("✅ Logout successful");

      res.json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error) {
      console.error("❌ Logout error:", error);
      res.status(500).json({
        success: false,
        message: "Logout failed",
      });
    }
  }

  // Verify Token (for protected routes)
  static async verifyToken(req, res) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          success: false,
          message: "No valid token provided",
        });
      }

      const token = authHeader.substring(7);
      const verification = jwtService.verifyAccessToken(token);

      if (!verification.valid) {
        return res.status(401).json({
          success: false,
          message: verification.error,
        });
      }

      res.json({
        success: true,
        message: "Token is valid",
        data: {
          user: verification.payload,
        },
      });
    } catch (error) {
      console.error("❌ Token verification error:", error);
      res.status(500).json({
        success: false,
        message: "Token verification failed",
      });
    }
  }
}

module.exports = AuthController;
