/**
 * Professional Frontend Authentication Service
 * - JWT tokens (access + refresh)
 * - Automatic token refresh
 * - All API calls use /api prefix
 * - Clean separation of concerns
 */

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";

class AuthService {
  constructor() {
    this.accessToken = null;
    this.refreshPromise = null;
  }

  // Make authenticated API request with auto-refresh
  async apiCall(endpoint, options = {}) {
    const url = `${API_BASE}/api/${endpoint.replace(/^\/+/, "")}`;

    // Add authorization header if we have a token in memory
    if (this.accessToken) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${this.accessToken}`,
      };
    }

    // Add credentials for cookies (refresh token)
    options.credentials = "include";

    let response = await fetch(url, options);

    // If token expired, try to refresh using HttpOnly cookie
    if (response.status === 401 && !endpoint.includes("auth/")) {
      console.log("🔄 Access token expired, requesting new one...");

      try {
        const refreshResult = await this.refreshToken();
        if (refreshResult?.accessToken) {
          // Update memory token and retry request
          this.accessToken = refreshResult.accessToken;
          options.headers = {
            ...options.headers,
            Authorization: `Bearer ${this.accessToken}`,
          };
          response = await fetch(url, options);
        }
      } catch (error) {
        console.error("Token refresh failed:", error);
        // Let the 401 response pass through
      }
    }

    return response;
  }

  // Office User Login
  async loginOffice(email, password) {
    try {
      console.log(`🔐 Office login: ${email}`);

      const response = await fetch(`${API_BASE}/api/auth/login/office`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      if (data.success) {
        // Store access token in memory only (no localStorage!)
        this.accessToken = data.data.accessToken;

        console.log(
          "✅ Office login successful, refresh token set in HttpOnly cookie"
        );
        return {
          success: true,
          user: data.data.user,
          accessToken: data.data.accessToken,
        };
      }

      throw new Error(data.message || "Login failed");
    } catch (error) {
      console.error("❌ Office login failed:", error.message);
      throw error;
    }
  }

  // Unit Director Login
  async loginUnitDirector(email, password) {
    try {
      console.log(`🔐 Unit Director login: ${email}`);

      const response = await fetch(`${API_BASE}/api/auth/login/unit-director`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      if (data.success) {
        // Store access token in memory only (no localStorage!)
        this.accessToken = data.data.accessToken;

        console.log(
          "✅ Unit Director login successful, refresh token set in HttpOnly cookie"
        );
        return {
          success: true,
          user: data.data.user,
          accessToken: data.data.accessToken,
        };
      }

      throw new Error(data.message || "Login failed");
    } catch (error) {
      console.error("❌ Unit Director login failed:", error.message);
      throw error;
    }
  }

  // Refresh Access Token (returns new token + user data)
  async refreshToken() {
    try {
      console.log("🔄 Requesting new access token using refresh cookie...");

      const response = await fetch(`${API_BASE}/api/auth/refresh`, {
        method: "POST",
        credentials: "include", // This sends the HttpOnly refresh cookie
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        console.log("❌ Token refresh failed - user needs to login again");
        throw new Error(data.message || "Token refresh failed");
      }

      console.log("✅ New access token received");
      return {
        accessToken: data.data.accessToken,
        user: data.data.user,
      };
    } catch (error) {
      console.error("❌ Token refresh error:", error);
      throw error;
    }
  }

  // Legacy method for backwards compatibility
  async refreshAccessToken() {
    // Prevent multiple refresh requests
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this._doRefresh();
    const result = await this.refreshPromise;
    this.refreshPromise = null;
    return result;
  }

  async _doRefresh() {
    try {
      console.log("🔄 Legacy refresh method...");

      const response = await fetch(`${API_BASE}/api/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        console.log("❌ Token refresh failed");
        this.logout();
        return false;
      }

      // Update access token in memory only
      this.accessToken = data.data.accessToken;

      console.log("✅ Access token refreshed (memory only)");
      return true;
    } catch (error) {
      console.error("❌ Token refresh error:", error);
      this.logout();
      return false;
    }
  }

  // Logout
  async logout() {
    try {
      // Call logout endpoint to clear HttpOnly refresh cookie
      await fetch(`${API_BASE}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      console.log("✅ HttpOnly refresh cookie cleared on server");
    } catch (error) {
      console.error("Logout API call failed:", error);
    }

    // Clear access token from memory only
    this.accessToken = null;
    console.log("✅ Access token cleared from memory");
  }

  // Verify Token (memory only)
  async verifyToken() {
    try {
      if (!this.accessToken) {
        console.log("🚫 No access token in memory");
        return false;
      }

      const response = await fetch(`${API_BASE}/api/auth/verify`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
        credentials: "include",
      });

      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error("Token verification failed:", error);
      return false;
    }
  }

  // Get current session (memory only, no localStorage)
  getSession() {
    // Only return session if we have access token in memory
    if (!this.accessToken) return null;

    // Note: We don't store user data in AuthService anymore
    // The AuthContext manages user data persistence
    return {
      accessToken: this.accessToken,
      // User data should come from AuthContext
    };
  }

  // Check if authenticated (memory-based)
  isAuthenticated() {
    return !!this.accessToken;
  }

  // Get access token (memory only)
  getAccessToken() {
    return this.accessToken;
  }

  // Initialize - no localStorage loading
  init() {
    // No initialization needed - tokens are memory-only
    console.log("🚀 AuthService initialized (memory-only mode)");
  }
}

// Create singleton instance
const authService = new AuthService();
authService.init();

export default authService;
