/**
 * Authentication Service
 * Handles login, logout, token refresh
 * Auto-fallback to production server if localhost fails
 */

import axios from "axios";
import { getApiBase, switchToProduction, isFallbackActive } from "../config/api.config.js";

const ACCESS_TOKEN_KEY = "sdu_access_token";

// Create a separate axios instance for auth (no interceptors)
const authAxios = axios.create({
  get baseURL() {
    return getApiBase();
  },
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // Disable cookies for CORS
  timeout: 10000,
});

class AuthService {
  constructor() {
    this.accessToken = localStorage.getItem(ACCESS_TOKEN_KEY) || null;
  }

  // Store access token
  setAccessToken(token) {
    this.accessToken = token;
    if (token) {
      localStorage.setItem(ACCESS_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
    }
  }

  // Get access token
  getAccessToken() {
    return this.accessToken;
  }

  // Clear all auth data
  clearAuth() {
    this.setAccessToken(null);
  }

  /**
   * Login - Works for both office and unit director
   */
  async login({ email, password, userType }) {
    const endpoint = userType === "unit_director" 
      ? "/api/auth/login/unit-director"
      : "/api/auth/login/office";

    try {
      const response = await authAxios.post(endpoint, { email, password });

      if (!response.data.success) {
        throw new Error(response.data.message || "Login failed");
      }

      this.setAccessToken(response.data.data.accessToken);
      return response.data.data; // { accessToken, user }
    } catch (error) {
      console.error('Login error details:', error);
      
      // Handle network errors (no response from server)
      if (!error.response) {
        // Try production server if not already using it
        if (!isFallbackActive()) {
          console.warn("🔄 Retrying login with production server...");
          switchToProduction();
          
          try {
            const retryResponse = await authAxios.post(endpoint, { email, password });
            if (!retryResponse.data.success) {
              throw new Error(retryResponse.data.message || "Login failed");
            }
            this.setAccessToken(retryResponse.data.data.accessToken);
            return retryResponse.data.data;
          } catch (retryError) {
            console.error("Production server also failed:", retryError);
          }
        }
        
        const networkError = new Error("Network error. Please check your connection and backend server.");
        networkError.isNetworkError = true;
        throw networkError;
      }
      
      // Handle rate limiting errors (429)
      if (error.response?.status === 429) {
        const data = error.response.data;
        const errorObj = new Error(data.message || "Too many login attempts");
        errorObj.locked = data.locked;
        errorObj.throttled = data.throttled;
        errorObj.waitSeconds = data.waitSeconds;
        errorObj.remainingMinutes = data.remainingMinutes;
        errorObj.remainingSeconds = data.remainingSeconds;
        throw errorObj;
      }
      
      // Handle invalid credentials with attempt tracking (401)
      if (error.response?.status === 401) {
        const data = error.response.data;
        const errorObj = new Error(data.message || "Invalid credentials");
        errorObj.remainingAttempts = data.remainingAttempts;
        errorObj.attemptsUsed = data.attemptsUsed;
        throw errorObj;
      }
      
      // Handle other server errors
      if (error.response?.status >= 500) {
        throw new Error("Server error. Please try again later.");
      }
      
      // Generic error
      throw new Error(error.response?.data?.message || error.message || "Login failed");
    }
  }

  /**
   * Refresh access token using HttpOnly cookie
   */
  async refreshToken() {
    const response = await authAxios.post("/api/auth/refresh");

    if (!response.data.success) {
      throw new Error(response.data.message || "Token refresh failed");
    }

    this.setAccessToken(response.data.data.accessToken);
    return response.data.data; // { accessToken, user }
  }

  /**
   * Logout - Clear tokens and session
   */
  async logout() {
    try {
      await authAxios.post("/api/auth/logout");
    } catch (error) {
      // Ignore logout errors
      console.error("Logout error:", error);
    }

    this.clearAuth();
  }
}

export default new AuthService();
