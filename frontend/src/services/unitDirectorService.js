/**
 * Unit Director Service
 * Handles unit director-specific API calls
 */

import api from "./api.js";

class UnitDirectorService {
  /**
   * Get unit director dashboard data
   */
  async getDashboard() {
    return await api.get("unit-director/dashboard");
  }

  /**
   * Get reports with filters
   */
  async getReports(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = queryParams
      ? `unit-director/reports?${queryParams}`
      : "unit-director/reports";
    return await api.get(endpoint);
  }

  /**
   * Get analytics data
   */
  async getAnalytics() {
    return await api.get("unit-director/analytics");
  }

  /**
   * Get all offices with programs
   */
  async getAllOfficesWithPrograms() {
    return await api.get("office/all-with-programs");
  }
}

export default new UnitDirectorService();
