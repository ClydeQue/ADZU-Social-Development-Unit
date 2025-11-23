// ========================================
// UNIFIED AUTHENTICATION CONTROLLER
// One credential per office (6 offices) + 1 Unit Director = 7 total credentials
// Strict access control: Each office can ONLY access their own data
// ========================================
const bcrypt = require("bcryptjs");
const supabase = require("../config/database");
const jwtService = require("../services/jwtService");

class AuthController {
  // ========================================
  // UNIFIED LOGIN - Handles both Office Users and Unit Director
  // Uses office_credentials table
  // ========================================
  static async loginOffice(req, res) {
    try {
      const { username, password } = req.body;

      // Validation
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: "Username and password are required",
        });
      }

      console.log(`Login attempt: ${username}`);

      // Get user from unified office_credentials table
      // Note: offices join is LEFT JOIN (office_id can be NULL for unit_director)
      const { data: users, error } = await supabase
        .from("office_credentials")
        .select(
          `
          *,
          offices (
            id,
            name,
            acronym,
            description
          )
        `
        )
        .ilike("username", username)
        .limit(1);

      if (error) {
        console.error("Database error:", error);
        console.error("   Error details:", JSON.stringify(error, null, 2));
        return res.status(500).json({
          success: false,
          message: "Database error",
          error:
            process.env.NODE_ENV === "development" ? error.message : undefined,
        });
      }

      if (!users || users.length === 0) {
        console.log(`User not found: ${username}`);

        // Record failed attempt
        if (req.loginRateLimiter) {
          const attemptInfo = req.loginRateLimiter.recordFailedAttempt();
          return res.status(401).json({
            success: false,
            message: "Invalid credentials",
            remainingAttempts: attemptInfo.remainingAttempts,
            attemptsUsed: attemptInfo.attempts,
          });
        }

        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      const user = users[0];
      console.log(`Found user: ${user.name} (${user.user_type})`);

      // Verify password with bcrypt (salt rounds 12)
      const isValidPassword = await bcrypt.compare(password, user.password);
      console.log(`Password verification: ${isValidPassword}`);

      if (!isValidPassword) {
        console.log(`Invalid password for: ${username}`);

        // Record failed attempt
        if (req.loginRateLimiter) {
          const attemptInfo = req.loginRateLimiter.recordFailedAttempt();

          if (attemptInfo.isLocked) {
            return res.status(429).json({
              success: false,
              message:
                "Too many failed login attempts. Please try again in 1 minute.",
              locked: true,
              remainingAttempts: 0,
            });
          }

          return res.status(401).json({
            success: false,
            message: "Invalid credentials",
            remainingAttempts: attemptInfo.remainingAttempts,
            attemptsUsed: attemptInfo.attempts,
          });
        }

        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // Reset attempts on successful login
      if (req.loginRateLimiter) {
        req.loginRateLimiter.resetAttempts();
      }

      // Update last_login timestamp and set user as active
      await supabase
        .from("office_credentials")
        .update({
          last_login: new Date().toISOString(),
          is_active: true,
        })
        .eq("id", user.id);

      // Build JWT token payload
      const tokenPayload = {
        userId: user.id,
        username: user.username,
        userType: user.user_type,
        name: user.name,
      };

      // Add office information for office users (STRICT: one office per user)
      if (user.user_type === "office_user" && user.offices) {
        tokenPayload.office_id = user.office_id; // CRITICAL: This enforces single office access
        tokenPayload.office = {
          id: user.offices.id,
          name: user.offices.name,
          acronym: user.offices.acronym,
        };
      }

      // Generate JWT tokens
      const accessToken = jwtService.generateAccessToken(tokenPayload);
      const refreshToken = jwtService.generateRefreshToken(user.id);

      console.log(`Login successful: ${user.username} (${user.user_type})`);

      // Set refresh token as httpOnly cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // "none" for cross-site in production
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        domain:
          process.env.NODE_ENV === "production" ? ".vercel.app" : undefined, // Allow subdomain access
      });

      // Build response user object
      const responseUser = {
        id: user.id,
        username: user.username,
        name: user.name,
        userType: user.user_type,
      };

      // Add office info for office users
      if (user.user_type === "office_user" && user.offices) {
        responseUser.office_id = user.office_id;
        responseUser.office = {
          id: user.offices.id,
          name: user.offices.name,
          acronym: user.offices.acronym,
          description: user.offices.description,
        };
      }

      // Return success response
      res.json({
        success: true,
        message: "Login successful",
        data: {
          accessToken,
          user: responseUser,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        message: "Authentication failed",
      });
    }
  }

  // ========================================
  // UNIT DIRECTOR LOGIN - Uses same unified login
  // ========================================
  static async loginUnitDirector(req, res) {
    console.log("Using unified login for Unit Director");
    return AuthController.loginOffice(req, res);
  }

  // ========================================
  // REFRESH TOKEN
  // ========================================
  static async refreshToken(req, res) {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          message: "No refresh token provided",
        });
      }

      console.log("Refreshing access token...");

      // Verify refresh token
      const verification = jwtService.verifyRefreshToken(refreshToken);

      if (!verification.valid) {
        console.log("Invalid refresh token");
        return res.status(401).json({
          success: false,
          message: "Invalid refresh token",
        });
      }

      const { userId } = verification.payload;

      // Get user from unified office_credentials table
      const { data: users, error } = await supabase
        .from("office_credentials")
        .select(
          `
          *,
          offices (
            id,
            name,
            acronym
          )
        `
        )
        .eq("id", userId)
        .limit(1);

      if (error || !users || users.length === 0) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }

      const user = users[0];

      // Build token payload
      const tokenPayload = {
        userId: user.id,
        username: user.username,
        userType: user.user_type,
        name: user.name,
      };

      // Add office_id for office users (STRICT access control)
      if (user.user_type === "office_user" && user.offices) {
        tokenPayload.office_id = user.office_id;
        tokenPayload.office = {
          id: user.offices.id,
          name: user.offices.name,
          acronym: user.offices.acronym,
        };
      }

      // Generate new access token
      const newAccessToken = jwtService.generateAccessToken(tokenPayload);

      console.log("Access token refreshed successfully");

      // Prepare user data to send back (same structure as login)
      const userData = {
        id: user.id,
        username: user.username,
        name: user.name,
        userType: user.user_type,
      };

      // Add office info for office users
      if (user.user_type === "office_user" && user.offices) {
        userData.office = {
          id: user.offices.id,
          name: user.offices.name,
          acronym: user.offices.acronym,
        };
      }

      res.json({
        success: true,
        message: "Token refreshed",
        data: {
          accessToken: newAccessToken,
          user: userData,
        },
      });
    } catch (error) {
      console.error("Token refresh error:", error);
      res.status(500).json({
        success: false,
        message: "Token refresh failed",
      });
    }
  }

  // Logout
  static async logout(req, res) {
    try {
      console.log("=== LOGOUT REQUEST ===");

      // STEP 1: Update database FIRST - Set user as inactive
      const authHeader = req.headers.authorization;
      console.log("Authorization header present:", !!authHeader);

      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.substring(7);
        const verification = jwtService.verifyAccessToken(token);
        console.log("Token verification valid:", verification.valid);

        if (verification.valid && verification.payload.userId) {
          console.log(
            "🔄 Setting user to inactive:",
            verification.payload.userId
          );

          // CRITICAL: Update database and WAIT for completion
          const { data: updateData, error: updateError } = await supabase
            .from("office_credentials")
            .update({ is_active: false })
            .eq("id", verification.payload.userId)
            .select();

          if (updateError) {
            console.error("❌ Error updating is_active:", updateError);
            // Continue with logout even if update fails
          } else {
            console.log(
              "✅ User set to inactive in database:",
              verification.payload.userId
            );
            console.log("✅ Updated data:", updateData);
          }
        } else {
          console.log("⚠️ Token invalid or no userId in payload");
        }
      } else {
        console.log("⚠️ No Authorization header found in logout request");
      }

      // STEP 2: Revoke refresh token
      const refreshToken = req.cookies.refreshToken;
      if (refreshToken) {
        jwtService.revokeRefreshToken(refreshToken);
        console.log("Refresh token revoked");
      }

      // STEP 3: Clear cookie
      res.clearCookie("refreshToken");

      console.log("Logout successful");

      // STEP 4: Send response
      res.json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({
        success: false,
        message: "Logout failed",
      });
    }
  }

  // ========================================
  // CHANGE PASSWORD - For both office users and unit director
  // Requires authentication via JWT token
  // ========================================
  static async changePassword(req, res) {
    try {
      // Extract token from Authorization header
      const authHeader = req.headers.authorization;
      console.log("Authorization header:", authHeader ? "Present" : "Missing");

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log("No valid authorization header");
        return res.status(401).json({
          success: false,
          error: "Authentication required",
        });
      }

      const token = authHeader.substring(7);
      console.log("Token extracted, length:", token.length);

      const verification = jwtService.verifyAccessToken(token);
      console.log(
        "Token verification result:",
        verification.valid,
        verification.error
      );

      if (!verification.valid) {
        console.log("Token verification failed:", verification.error);
        return res.status(401).json({
          success: false,
          error: "Invalid or expired token",
          details: verification.error,
        });
      }

      const userId = verification.payload.userId;
      const { currentPassword, newPassword } = req.body;

      console.log("Change password request for user:", userId);

      // Validation
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          error: "Current password and new password are required",
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          error: "New password must be at least 6 characters",
        });
      }

      // Get current user credentials
      const { data: user, error: fetchError } = await supabase
        .from("office_credentials")
        .select("id, username, password, user_type")
        .eq("id", userId)
        .single();

      if (fetchError || !user) {
        console.error("Error fetching user:", fetchError);
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!isValidPassword) {
        console.log("Invalid current password for:", user.username);
        return res.status(401).json({
          success: false,
          error: "Current password is incorrect",
        });
      }

      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(newPassword, salt);

      console.log("Updating password for:", user.username);

      // Update password
      const { error: updateError } = await supabase
        .from("office_credentials")
        .update({ password: passwordHash })
        .eq("id", userId);

      if (updateError) {
        console.error("Update error:", updateError);
        throw updateError;
      }

      console.log("Password updated successfully for:", user.username);

      res.json({
        success: true,
        message: "Password updated successfully",
      });
    } catch (error) {
      console.error("Change password error:", error);
      res.status(500).json({
        success: false,
        error: "Error changing password",
        details: error.message,
      });
    }
  }

  // ========================================
  // CHANGE USERNAME - For both office users and unit director
  // Requires authentication via JWT token
  // ========================================
  static async changeUsername(req, res) {
    try {
      // Extract token from Authorization header
      const authHeader = req.headers.authorization;
      console.log("Authorization header:", authHeader ? "Present" : "Missing");

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log("No valid authorization header");
        return res.status(401).json({
          success: false,
          error: "Authentication required",
        });
      }

      const token = authHeader.substring(7);
      const verification = jwtService.verifyAccessToken(token);

      if (!verification.valid) {
        console.log("Token verification failed:", verification.error);
        return res.status(401).json({
          success: false,
          error: "Invalid or expired token",
          details: verification.error,
        });
      }

      const userId = verification.payload.userId;
      const { newUsername, currentPassword } = req.body;

      console.log("Change username request for user:", userId);

      // Validation
      if (!newUsername || !currentPassword) {
        return res.status(400).json({
          success: false,
          error: "New username and current password are required",
        });
      }

      if (newUsername.length < 3) {
        return res.status(400).json({
          success: false,
          error: "Username must be at least 3 characters",
        });
      }

      // Get current user credentials
      const { data: user, error: fetchError } = await supabase
        .from("office_credentials")
        .select("id, username, password, user_type")
        .eq("id", userId)
        .single();

      if (fetchError || !user) {
        console.error("Error fetching user:", fetchError);
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!isValidPassword) {
        console.log("Invalid current password for:", user.username);
        return res.status(401).json({
          success: false,
          error: "Current password is incorrect",
        });
      }

      // Check if new username already exists
      const { data: existingUser } = await supabase
        .from("office_credentials")
        .select("id")
        .eq("username", newUsername.trim().toLowerCase())
        .neq("id", userId)
        .single();

      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: "Username already exists",
        });
      }

      console.log("Updating username for:", user.username, "->", newUsername);

      // Update username
      const { error: updateError } = await supabase
        .from("office_credentials")
        .update({ username: newUsername.trim().toLowerCase() })
        .eq("id", userId);

      if (updateError) {
        console.error("Update error:", updateError);
        throw updateError;
      }

      console.log("Username updated successfully");

      res.json({
        success: true,
        message: "Username updated successfully",
      });
    } catch (error) {
      console.error("Change username error:", error);
      res.status(500).json({
        success: false,
        error: "Error changing username",
        details: error.message,
      });
    }
  }

  // ========================================
  // FORGOT PASSWORD - Submit password reset request
  // No authentication required (this is for users who can't log in)
  // ========================================
  static async forgotPassword(req, res) {
    try {
      const { username } = req.body;

      console.log("Forgot password request for username:", username);

      // Validation
      if (!username || username.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: "Username is required",
        });
      }

      // Check if username exists in office_credentials (only office_user, not unit_director)
      const { data: user, error: fetchError } = await supabase
        .from("office_credentials")
        .select("id, username, office_id, user_type")
        .eq("username", username.trim().toLowerCase())
        .eq("user_type", "office_user")
        .single();

      if (fetchError || !user) {
        console.log("User not found:", username);
        // Return user-friendly message
        return res.status(404).json({
          success: false,
          error: "No user exists with this username",
        });
      }

      console.log("User found:", user.username, "Office ID:", user.office_id);

      // Check if there's already a pending request for this user
      const { data: existingRequest, error: checkError } = await supabase
        .from("password_reset_requests")
        .select("id, status")
        .eq("username", user.username)
        .eq("status", "pending")
        .single();

      if (existingRequest) {
        console.log("Pending request already exists for:", user.username);
        return res.status(400).json({
          success: false,
          error: "A password reset request is already pending for this account",
        });
      }

      // Create password reset request
      const { data: resetRequest, error: createError } = await supabase
        .from("password_reset_requests")
        .insert({
          username: user.username,
          office_id: user.office_id,
          status: "pending",
        })
        .select()
        .single();

      if (createError) {
        console.error("Error creating reset request:", createError);
        throw createError;
      }

      console.log("Password reset request created:", resetRequest.id);

      res.json({
        success: true,
        message: "Password reset request submitted successfully",
      });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({
        success: false,
        error: "Error submitting password reset request",
        details: error.message,
      });
    }
  }
}

module.exports = AuthController;
