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

  /**
   * Add a new program to an office
   */
  async addProgram(officeId, programData) {
    const response = await api.post(`office/${officeId}/programs`, programData);
    return response;
  }

  /**
   * Update a program
   */
  async updateProgram(programId, programData) {
    const response = await api.put(`office/programs/${programId}`, programData);
    return response;
  }

  /**
   * Delete a program
   */
  async deleteProgram(programId) {
    const response = await api.delete(`office/programs/${programId}`);
    return response;
  }

  /**
   * Change office account password
   */
  async changeOfficePassword(officeId, newPassword) {
    const response = await api.put(
      `settings/office/${officeId}/change-password`,
      {
        newPassword,
      }
    );
    return response;
  }
}

export default new unitDirectorSettings();
