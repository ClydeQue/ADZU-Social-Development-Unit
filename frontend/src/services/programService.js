/**
 * Program Service
 * Handles program-related API calls
 * Programs are office-specific and fixed per office
 */

import api from "./api.js";

class ProgramService {
  /**
   * Get all programs (usually for Unit Director)
   */
  async getAllPrograms(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = queryParams ? `program/all?${queryParams}` : "program/all";
    const response = await api.get(endpoint);
    return response.programs;
  }

  /**
   * Get programs for current office user
   */
  async getPrograms() {
    const response = await api.get("api/programs");
    return response.data;
  }

  /**
   * Get programs by office ID
   * Useful for viewing specific office's programs
   */
  async getProgramsByOffice(officeId) {
    const response = await api.get(`api/office/${officeId}/programs`);
    return response.programs;
  }

  /**
   * Get program by ID
   */
  async getProgramById(programId) {
    const response = await api.get(`api/programs/${programId}`);
    return response.program;
  }

  /**
   * Create new program
   * Note: In the future, programs may be fixed per office
   */
  async createProgram(programData) {
    const response = await api.post("api/programs", programData);
    return response.program;
  }

  /**
   * Update program
   */
  async updateProgram(programId, programData) {
    const response = await api.put(`api/programs/${programId}`, programData);
    return response.program;
  }

  /**
   * Delete program
   */
  async deleteProgram(programId) {
    return await api.delete(`api/programs/${programId}`);
  }

  /**
   * Get program statistics
   */
  async getProgramStats(programId) {
    const response = await api.get(`api/programs/${programId}/stats`);
    return response.data;
  }
}

export default new ProgramService();

