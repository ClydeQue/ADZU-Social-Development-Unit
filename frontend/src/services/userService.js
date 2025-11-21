/**
 * User Service
 * Handles user-related API calls
 */

import api from "./api.js";

class UserService {
  /**
   * Change user password
   */
  async changePassword(passwordData) {
    return await api.post("api/auth/change-password", passwordData);
  }

  /**
   * Get user profile
   */
  async getProfile() {
    return await api.get("api/user/profile");
  }

  /**
   * Update user profile
   */
  async updateProfile(profileData) {
    return await api.put("api/user/profile", profileData);
  }

  /**
   * Create new user (admin only)
   */
  async createUser(userData) {
    return await api.post("api/user/create", userData);
  }

  /**
   * Get all users (admin only)
   */
  async getAllUsers() {
    return await api.get("api/user/all");
  }

  /**
   * Delete user (admin only)
   */
  async deleteUser(userId) {
    return await api.delete(`api/user/${userId}`);
  }
}

export default new UserService();
