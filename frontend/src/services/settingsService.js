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
};

export default settingsService;
