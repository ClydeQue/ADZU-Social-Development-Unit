/**
 * Base API Configuration
 * Centralized axios instance with interceptors and error handling
 * Auto-fallback to production server if localhost fails
 */

import axios from "axios";
import { getApiBase, switchToProduction, isFallbackActive } from "../config/api.config.js";

// Create axios instance with dynamic baseURL
const axiosInstance = axios.create({
  get baseURL() {
    return `${getApiBase()}/api`;
  },
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // Disable cookies for CORS
  timeout: 10000, // 10 second timeout
});

// Request interceptor - Add access token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("sdu_access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle 401 and auto-refresh, with fallback
axiosInstance.interceptors.response.use(
  (response) => response.data, // Return data directly
  async (error) => {
    const originalRequest = error.config;

    // If connection error and not using fallback yet, try production
    if (
      error.code === 'ECONNABORTED' || 
      error.code === 'ERR_NETWORK' ||
      !error.response
    ) {
      if (!isFallbackActive()) {
        console.warn("🔄 Switching to production server due to connection error");
        switchToProduction();
        
        // Retry with production server
        return axiosInstance(originalRequest);
      }
    }

    // If 401 and haven't retried yet, and not an auth endpoint
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("auth/")
    ) {
      originalRequest._retry = true;

      try {
        // Dynamically import to avoid circular dependency
        const { default: AuthService } = await import("./authService.js");
        await AuthService.refreshToken();

        // Update auth header with new token
        const newToken = localStorage.getItem("sdu_access_token");
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        // Retry original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        window.location.href = "/";
        console.log(refreshError);
        return Promise.reject(new Error("Session expired. Please login again."));
      }
    }

    // Extract error message
    const message =
      error.response?.data?.message || error.message || "Request failed";
    return Promise.reject(new Error(message));
  }
);

// Wrapper class for consistent API
class ApiService {
  // Get current API URL
  getApiUrl() {
    return getApiBase();
  }

  // Check if using fallback server
  isUsingFallbackServer() {
    return isFallbackActive();
  }

  async get(endpoint, options = {}) {
    return axiosInstance.get(endpoint, options);
  }

  async post(endpoint, body, options = {}) {
    return axiosInstance.post(endpoint, body, options);
  }

  async put(endpoint, body, options = {}) {
    return axiosInstance.put(endpoint, body, options);
  }

  async delete(endpoint, options = {}) {
    return axiosInstance.delete(endpoint, options);
  }

  async patch(endpoint, body, options = {}) {
    return axiosInstance.patch(endpoint, body, options);
  }
}

export default new ApiService();
