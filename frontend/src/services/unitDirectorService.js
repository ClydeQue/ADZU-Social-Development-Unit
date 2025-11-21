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
    return await api.get("/api/unit-director/dashboard");
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

  /**
   * Get all activities across all offices for calendar
   */
  async getAllActivities() {
    return await api.get("unit-director/activities");
  }
}

export default new UnitDirectorService();
