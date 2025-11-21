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
   * Get office dashboard data
   */
  async getOfficeDashboard(officeId) {
    return await api.get(`api/office/${officeId}/dashboard`);
  }

  /**
   * Get office programs
   */
  async getOfficePrograms(officeId) {
    const response = await api.get(`api/office/${officeId}/programs`);
    return response.programs;
  }

  /**
   * Get office reports data
   */
  async getOfficeReports(officeId) {
    return await api.get(`api/office/${officeId}/reports`);
  }

  /**
   * Get office activities for calendar
   */
  async getOfficeActivities(officeId) {
    return await api.get(`api/office/${officeId}/activities`);
  }

  /**
   * Delete activities by IDs
   */
  async deleteActivities(activityIds) {
    return await api.delete('api/office/activities', { 
      data: { activity_ids: activityIds } 
    });
  }

  /**
   * Get single activity by ID
   */
  async getActivity(activityId) {
    const response = await api.get(`api/office/activities/${activityId}`);
    return response.activity;
  }

  /**
   * Update activity by ID
   */
  async updateActivity(activityId, activityData) {
    return await api.put(`api/office/activities/${activityId}`, activityData);
  }

  /**
   * Create new activity
   */
  async createActivity(activityData) {
    return await api.post('/api/office/activities', activityData);
  }
}

export default new OfficeService();
