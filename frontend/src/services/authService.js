/**
 * Authentication Service
 * Handles login, logout, token refresh
 */

import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";
const ACCESS_TOKEN_KEY = "sdu_access_token";

// Create a separate axios instance for auth (no interceptors)
const authAxios = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Send cookies
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

    const response = await authAxios.post(endpoint, { email, password });

    if (!response.data.success) {
      throw new Error(response.data.message || "Login failed");
    }

    this.setAccessToken(response.data.data.accessToken);
    return response.data.data; // { accessToken, user }
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
