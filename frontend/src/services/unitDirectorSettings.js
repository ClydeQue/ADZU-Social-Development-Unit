import api from "./api.js";

class unitDirectorSettings {
  /**
   * Get all offices
   */
  async getAllOffices() {
    const response = await api.get("office/all");
    return response.offices;
  }

  /**
   * Get office by ID
   */
  async getOfficeById(officeId) {
    const response = await api.get(`office/${officeId}`);
    return response.office;
  }

  }

export default new unitDirectorSettings();