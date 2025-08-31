/**
 * 🔒 JWT-BASED SECURE AUTHENTICATION
 * - Access tokens (15 min) + Refresh tokens (7 days)
 * - Rate limiting (5 attempts per minute)
 * - HttpOnly cookies for refresh tokens
 * - Auto token refresh functionality
 */

// API base URL
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const JWTAuth = {
  // 🏢 Office Login with JWT tokens
  async loginOffice(email, password) {
    console.log(`🔐 JWT Office Login: ${email}`);

    try {
      const response = await fetch(`${API_BASE}/secure-auth/login/office`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for refresh token
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        // Handle rate limiting
        if (response.status === 429) {
          throw new Error(
            `Too many login attempts. Please wait ${errorData.retryAfter} seconds before trying again.`
          );
        }

        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();

      if (data.success) {
        // Store access token and user data in localStorage
        const session = {
          token: data.accessToken,
          userType: data.user.userType,
          user: data.user,
        };

        localStorage.setItem("auth_token", session.token);
        localStorage.setItem("auth_user_type", session.userType);
        localStorage.setItem("auth_user_data", JSON.stringify(session.user));

        console.log("✅ Office login successful with JWT");
        return session;
      }

      throw new Error("Login failed");
    } catch (error) {
      console.error("❌ JWT Office login failed:", error.message);
      throw error;
    }
  },

  // 👔 Unit Director Login with JWT tokens
  async loginUnitDirector(email, password) {
    console.log(`🔐 JWT Unit Director Login: ${email}`);

    try {
      const response = await fetch(
        `${API_BASE}/secure-auth/login/unit-director`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include cookies for refresh token
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();

        // Handle rate limiting
        if (response.status === 429) {
          throw new Error(
            `Too many login attempts. Please wait ${errorData.retryAfter} seconds before trying again.`
          );
        }

        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();

      if (data.success) {
        // Store access token and user data in localStorage
        const session = {
          token: data.accessToken,
          userType: data.user.userType,
          user: data.user,
        };

        localStorage.setItem("auth_token", session.token);
        localStorage.setItem("auth_user_type", session.userType);
        localStorage.setItem("auth_user_data", JSON.stringify(session.user));

        console.log("✅ Unit Director login successful with JWT");
        return session;
      }

      throw new Error("Login failed");
    } catch (error) {
      console.error("❌ JWT Unit Director login failed:", error.message);
      throw error;
    }
  },

  // 🔄 Refresh access token automatically
  async refreshAccessToken() {
    try {
      const response = await fetch(`${API_BASE}/secure-auth/refresh`, {
        method: "POST",
        credentials: "include", // Send refresh token cookie
      });

      if (!response.ok) {
        throw new Error("Token refresh failed");
      }

      const data = await response.json();

      if (data.success) {
        // Update access token in localStorage
        localStorage.setItem("auth_token", data.accessToken);
        console.log("✅ Access token refreshed automatically");
        return data.accessToken;
      }

      throw new Error("Token refresh failed");
    } catch (error) {
      console.error("❌ Token refresh failed:", error.message);
      // Clear invalid session
      this.logout();
      throw error;
    }
  },

  // 📋 Get current session
  getSession() {
    try {
      const token = localStorage.getItem("auth_token");
      const userType = localStorage.getItem("auth_user_type");
      const userData = localStorage.getItem("auth_user_data");

      if (!token || !userType || !userData) {
        return null;
      }

      return {
        token,
        userType,
        user: JSON.parse(userData),
        isAuthenticated: true,
      };
    } catch (error) {
      console.error("❌ Session error:", error);
      return null;
    }
  },

  // 🚪 Logout (clears both access token and refresh token)
  async logout() {
    try {
      // Call logout endpoint to revoke refresh token
      await fetch(`${API_BASE}/secure-auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.warn("⚠️ Logout endpoint failed, clearing local storage anyway");
    }

    // Clear localStorage
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user_type");
    localStorage.removeItem("auth_user_data");
    console.log("✅ Logged out - JWT tokens cleared");
  },

  // 🛡️ Check if user is authenticated
  isAuthenticated() {
    return this.getSession() !== null;
  },

  // 🔄 Logout from all devices
  async logoutAll() {
    try {
      await fetch(`${API_BASE}/secure-auth/logout-all`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        credentials: "include",
      });
    } catch (error) {
      console.warn("⚠️ Logout all endpoint failed");
    }

    // Clear localStorage
    this.logout();
    console.log("✅ Logged out from all devices");
  },

  // 📊 Make authenticated API request with auto token refresh
  async authenticatedRequest(url, options = {}) {
    const token = localStorage.getItem("auth_token");

    if (!token) {
      throw new Error("No authentication token");
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    // If token expired, try to refresh and retry
    if (response.status === 401) {
      const errorData = await response.json();

      if (errorData.code === "TOKEN_EXPIRED") {
        console.log("🔄 Token expired, attempting refresh...");

        try {
          const newToken = await this.refreshAccessToken();

          // Retry original request with new token
          return fetch(url, {
            ...options,
            headers: {
              ...options.headers,
              Authorization: `Bearer ${newToken}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
          });
        } catch (refreshError) {
          console.error("❌ Token refresh failed, logging out");
          this.logout();
          throw new Error("Session expired, please login again");
        }
      }
    }

    return response;
  },

  // 👤 Get user profile
  async getUserProfile() {
    try {
      const response = await this.authenticatedRequest(
        `${API_BASE}/secure-auth/profile`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error("❌ Failed to fetch user profile:", error.message);
      throw error;
    }
  },
};

export default JWTAuth;
