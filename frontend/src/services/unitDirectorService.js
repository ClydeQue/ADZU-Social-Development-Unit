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
    return await api.get("api/unit-director/dashboard");
  }

  /**
   * Get reports with filters
   */
  async getReports(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = queryParams
      ? `api/unit-director/reports?${queryParams}`
      : "api/unit-director/reports";
    return await api.get(endpoint);
  }

  /**
   * Get analytics data
   */
  async getAnalytics() {
    return await api.get("api/unit-director/analytics");
  }

  /**
   * Get all offices with programs
   */
  async getAllOfficesWithPrograms() {
    return await api.get("api/office/all-with-programs");
  }

  /**
   * Get all activities across all offices for calendar
   */
  async getAllActivities() {
    return await api.get("api/unit-director/activities");
  }

  /**
   * Get single activity by ID
   */
  async getActivityById(activityId) {
    return await api.get(`api/unit-director/activities/${activityId}`);
  }

  /**
   * Update activity status
   */
  async updateActivityStatus(activityId, status) {
    return await api.put(`api/unit-director/activities/${activityId}/status`, {
      status,
    });
  }

  /**
   * Get all offices for settings
   */
  async getOffices() {
    return await api.get("api/settings");
  }

  /**
   * Get programs for specific office
   */
  async getOfficePrograms(officeId) {
    return await api.get(`api/office/${officeId}/programs`);
  }
}

export default new UnitDirectorService();
