import api from "./api";

const settingsService = {
  /**
   * Change Unit Director password
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise} Response with success status
   */
  changeUnitDirectorPassword: async (currentPassword, newPassword) => {
    // api.put already returns response.data due to interceptor
    const response = await api.put(
      "api/settings/unit-director/change-password",
      {
        currentPassword,
        newPassword,
      }
    );
    return response;
  },

  /**
   * Change Unit Director username
   * @param {string} newUsername - New username
   * @param {string} currentPassword - Current password for verification
   * @returns {Promise} Response with success status
   */
  changeUnitDirectorUsername: async (newUsername, currentPassword) => {
    const response = await api.put(
      "api/settings/unit-director/change-username",
      {
        newUsername,
        currentPassword,
      }
    );
    return response;
  },

  /**
   * Change office account password (by Unit Director)
   * @param {number} officeId - Office ID
   * @param {string} newPassword - New password
   * @returns {Promise} Response with success status
   */
  changeOfficePassword: async (officeId, newPassword) => {
    // api.put already returns response.data due to interceptor
    const response = await api.put(
      `api/settings/office/${officeId}/change-password`,
      {
        newPassword,
      }
    );
    return response;
  },

  /**
   * Get all offices with their programs
   * @returns {Promise} Response with offices data
   */
  getOfficesWithPrograms: async () => {
    // api.get already returns response.data due to interceptor
    const response = await api.get("api/settings");
    return response;
  },

  /**
   * Get all office users (for user management)
   * @returns {Promise} Response with users data
   */
  getOfficeUsers: async () => {
    try {
      const response = await api.get("api/unit-director/users");
      return response;
    } catch (error) {
      console.error("Get office users error:", error);
      throw error;
    }
  },

  /**
   * Get password reset requests
   * @returns {Promise} Response with reset requests data
   */
  getPasswordResetRequests: async () => {
    try {
      const response = await api.get("api/unit-director/password-reset-requests");
      return response;
    } catch (error) {
      console.error("Get password reset requests error:", error);
      throw error;
    }
  },

  /**
   * Approve password reset request
   * @param {number} requestId - Reset request ID
   * @returns {Promise} Response with success status
   */
  approvePasswordReset: async (requestId) => {
    try {
      const response = await api.post(`api/unit-director/password-reset-requests/${requestId}/approve`);
      return response;
    } catch (error) {
      console.error("Approve password reset error:", error);
      throw error;
    }
  },

  /**
   * Reject password reset request
   * @param {number} requestId - Reset request ID
   * @returns {Promise} Response with success status
   */
  rejectPasswordReset: async (requestId) => {
    try {
      const response = await api.post(`api/unit-director/password-reset-requests/${requestId}/reject`);
      return response;
    } catch (error) {
      console.error("Reject password reset error:", error);
      throw error;
    }
  },
};

export default settingsService;
