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
};

export default settingsService;
