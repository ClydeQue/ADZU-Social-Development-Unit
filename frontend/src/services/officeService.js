/**
 * Office Service
 * Handles office-related API calls
 */

import api from "./api.js";

class OfficeService {
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
   * Get office dashboard data
   */
  async getOfficeDashboard(officeId) {
    return await api.get(`office/${officeId}/dashboard`);
  }

  /**
   * Get office programs
   */
  async getOfficePrograms(officeId) {
    const response = await api.get(`office/${officeId}/programs`);
    return response.programs;
  }

  /**
   * Get office reports data
   */
  async getOfficeReports(officeId) {
    return await api.get(`office/${officeId}/reports`);
  }

  /**
   * Get office activities for calendar
   */
  async getOfficeActivities(officeId) {
    return await api.get(`office/${officeId}/activities`);
  }

  /**
   * Delete activities by IDs
   */
  async deleteActivities(activityIds) {
    return await api.delete('office/activities', { 
      data: { activity_ids: activityIds } 
    });
  }
}

export default new OfficeService();
