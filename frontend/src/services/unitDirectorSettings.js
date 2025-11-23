import api from "./api.js";

class unitDirectorSettings {
  /**
   * Get all offices
   */
  async getAllOffices() {
    const response = await api.get("api/office/all");
    return response.offices;
  }

  /**
   * Get office by ID
   */
  async getOfficeById(officeId) {
    const response = await api.get(`api/office/${officeId}`);
    return response.office;
  }

  /**
   * Add a new program to an office
   */
  async addProgram(officeId, programData) {
    const response = await api.post(`api/office/${officeId}/programs`, programData);
    return response;
  }

  /**
   * Update a program
   */
  async updateProgram(programId, programData) {
    const response = await api.put(`api/office/programs/${programId}`, programData);
    return response;
  }

  /**
   * Delete a program
   */
  async deleteProgram(programId) {
    const response = await api.delete(`api/office/programs/${programId}`);
    return response;
  }

  /**
   * Change office account password
   */
  async changeOfficePassword(officeId, newPassword) {
    const response = await api.put(
      `api/settings/office/${officeId}/change-password`,
      {
        newPassword,
      }
    );
    return response;
  }
}

export default new unitDirectorSettings();
