/**
 * Base API Configuration
 * Centralized axios instance with interceptors and error handling
 */

import axios from "axios";

// Determine API base URL based on environment
const getAPIBaseURL = () => {
  // If VITE_API_URL is explicitly set, use it
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // In production (Vercel), use the production backend URL
  if (import.meta.env.PROD) {
    return "https://adzu-sdu-backend-delta.vercel.app";
  }

  // Local development fallback
  return "http://localhost:5001";
};

const API_BASE = getAPIBaseURL();

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE, // Remove /api since Express routes already include it
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Send cookies with requests
});

// Log API configuration in development
if (import.meta.env.DEV) {
  console.log("[API Config] Base URL:", API_BASE);
}

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

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

// Response interceptor - Handle 401 and auto-refresh
axiosInstance.interceptors.response.use(
  (response) => response.data, // Return data directly
  async (error) => {
    const originalRequest = error.config;

    // If 401 and haven't retried yet, and not an auth endpoint
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("auth/")
    ) {
      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Dynamically import to avoid circular dependency
        const { default: AuthService } = await import("./authService.js");
        await AuthService.refreshToken();

        // Update auth header with new token
        const newToken = localStorage.getItem("sdu_access_token");
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        // Process any queued requests
        processQueue(null, newToken);
        isRefreshing = false;

        // Retry original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh failed, process queue with error
        processQueue(refreshError, null);
        isRefreshing = false;

        // Clear auth data and redirect to login
        const { default: AuthService } = await import("./authService.js");
        AuthService.clearAuth();

        // Only redirect if not already on login page
        if (window.location.pathname !== "/") {
          window.location.href = "/";
        }

        return Promise.reject(
          new Error("Session expired. Please login again.")
        );
      }
    }

    // Log errors for debugging
    if (import.meta.env.DEV) {
      console.error("[API Error]", {
        status: error.response?.status,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        method: error.config?.method,
        data: error.response?.data,
      });
    }

    // Preserve the original error structure so components can access response.data
    return Promise.reject(error);
  }
);

// Wrapper class for consistent API
class ApiService {
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
