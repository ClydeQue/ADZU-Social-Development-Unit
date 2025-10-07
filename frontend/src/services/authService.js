/**
 * Professional Frontend Authentication Service
 * - JWT tokens (access + refresh)
 * - Automatic token refresh
 * - All API calls use /api prefix
 * - Clean separation of concerns
 */

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";

const ACCESS_TOKEN_KEY = 'adzu_sdu_access_token';

class AuthService {
  constructor() {
    // Try to restore access token from localStorage on initialization
    this.accessToken = localStorage.getItem(ACCESS_TOKEN_KEY) || null;
    this.refreshPromise = null;
    
    if (this.accessToken) {
      console.log('🔑 Access token restored from localStorage');
    }
  }

  // Store access token in localStorage
  setAccessToken(token) {
    this.accessToken = token;
    if (token) {
      localStorage.setItem(ACCESS_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
    }
  }

  // Get current access token
  getAccessToken() {
    return this.accessToken;
  }

  // Make authenticated API request with auto-refresh
  async apiCall(endpoint, options = {}) {
    const url = `${API_BASE}/api/${endpoint.replace(/^\/+/, "")}`;

    // Add authorization header if we have a token
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
          // Update token and retry request
          this.setAccessToken(refreshResult.accessToken);
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
        // Store access token in localStorage for persistence
        this.setAccessToken(data.data.accessToken);

        console.log(
          "✅ Office login successful, tokens stored"
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
        // Store access token in localStorage for persistence
        this.setAccessToken(data.data.accessToken);

        console.log(
          "✅ Unit Director login successful, tokens stored"
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

      // Store new access token in localStorage
      this.setAccessToken(data.data.accessToken);

      console.log("✅ New access token received and stored");
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

      // Update access token in localStorage
      this.setAccessToken(data.data.accessToken);

      console.log("✅ Access token refreshed and stored");
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

    // Clear access token from localStorage
    this.setAccessToken(null);
    console.log("✅ Access token cleared from storage");
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

  // Check if authenticated
  isAuthenticated() {
    return !!this.accessToken;
  }

  // Initialize - restore token from localStorage
  init() {
    // Token is already restored in constructor
    if (this.accessToken) {
      console.log("🚀 AuthService initialized with stored access token");
    } else {
      console.log("🚀 AuthService initialized (no stored token)");
    }
  }
}

// Create singleton instance
const authService = new AuthService();
authService.init();

export default authService;
