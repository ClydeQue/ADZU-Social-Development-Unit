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

    // Add authorization header if we have a token
    if (this.accessToken || localStorage.getItem("accessToken")) {
      const token = this.accessToken || localStorage.getItem("accessToken");
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    // Add credentials for cookies
    options.credentials = "include";

    let response = await fetch(url, options);

    // If token expired, try to refresh
    if (response.status === 401 && !endpoint.includes("auth/")) {
      console.log("🔄 Access token expired, refreshing...");

      const refreshed = await this.refreshAccessToken();
      if (refreshed) {
        // Retry original request with new token
        options.headers.Authorization = `Bearer ${this.accessToken}`;
        response = await fetch(url, options);
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
        // Store access token
        this.accessToken = data.data.accessToken;
        localStorage.setItem("accessToken", data.data.accessToken);
        localStorage.setItem("user", JSON.stringify(data.data.user));

        console.log("✅ Office login successful");
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
        // Store access token
        this.accessToken = data.data.accessToken;
        localStorage.setItem("accessToken", data.data.accessToken);
        localStorage.setItem("user", JSON.stringify(data.data.user));

        console.log("✅ Unit Director login successful");
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

  // Refresh Access Token
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
      console.log("🔄 Refreshing access token...");

      const response = await fetch(`${API_BASE}/api/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        console.log("❌ Token refresh failed, logging out");
        this.logout();
        return false;
      }

      // Update access token
      this.accessToken = data.data.accessToken;
      localStorage.setItem("accessToken", data.data.accessToken);

      console.log("✅ Access token refreshed");
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
      // Call logout endpoint to revoke refresh token
      await fetch(`${API_BASE}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout API call failed:", error);
    }

    // Clear local data
    this.accessToken = null;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    console.log("✅ Logged out");
  }

  // Verify Token
  async verifyToken() {
    try {
      const token = this.accessToken || localStorage.getItem("accessToken");
      if (!token) return false;

      const response = await fetch(`${API_BASE}/api/auth/verify`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
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

  // Get current session
  getSession() {
    const token = this.accessToken || localStorage.getItem("accessToken");
    const userStr = localStorage.getItem("user");

    if (!token || !userStr) return null;

    try {
      const user = JSON.parse(userStr);
      return {
        accessToken: token,
        user,
      };
    } catch (error) {
      console.error("Error parsing user data:", error);
      this.logout();
      return null;
    }
  }

  // Check if authenticated
  isAuthenticated() {
    return !!this.getSession();
  }

  // Get current user
  getCurrentUser() {
    const session = this.getSession();
    return session ? session.user : null;
  }

  // Get user type
  getUserType() {
    const user = this.getCurrentUser();
    return user ? user.userType : null;
  }

  // Initialize - load token from storage
  init() {
    const token = localStorage.getItem("accessToken");
    if (token) {
      this.accessToken = token;
    }
  }
}

// Create singleton instance
const authService = new AuthService();
authService.init();

export default authService;
