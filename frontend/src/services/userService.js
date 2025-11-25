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
   * Change username
   */
  async changeUsername(usernameData) {
    return await api.post("api/auth/change-username", usernameData);
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

  /**
   * Get program requests for office
   */
  async getProgramRequests() {
    return await api.get("api/office/program-requests");
  }

  /**
   * Submit program request
   */
  async submitProgramRequest(requestData) {
    return await api.post("api/office/program-requests", requestData);
  }

  /**
   * Delete program request
   */
  async deleteProgramRequest(requestId) {
    return await api.delete(`api/office/program-requests/${requestId}`);
  }

  /**
   * Get program change requests for office
   */
  async getProgramChangeRequests() {
    return await api.get("api/office/program-change-requests");
  }

  /**
   * Submit program update request
   */
  async submitProgramUpdateRequest(requestData) {
    return await api.post("api/office/program-change-requests/update", requestData);
  }

  /**
   * Submit program delete request
   */
  async submitProgramDeleteRequest(requestData) {
    return await api.post("api/office/program-change-requests/delete", requestData);
  }

  /**
   * Cancel program change request
   */
  async cancelProgramChangeRequest(requestId) {
    return await api.delete(`api/office/program-change-requests/${requestId}`);
  }
}

export default new UserService();
