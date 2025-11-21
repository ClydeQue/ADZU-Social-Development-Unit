/**
 * Activity Service
 * Handles activity-related API calls
 * Activities are user-specific and program-specific
 */

import api from "./api.js";

class ActivityService {
  /**
   * Get activities for a program
   */
  async getActivitiesByProgram(programId) {
    const response = await api.get(`/api/programs/${programId}/activities`);
    return response.data;
  }

  /**
   * Get activity by ID
   */
  async getActivityById(programId, activityId) {
    const response = await api.get(`/api/programs/${programId}/activities/${activityId}`);
    return response.data;
  }

  /**
   * Create activity for a program
   * @param {string} programId - The program ID
   * @param {object} activityData - Activity data with office-specific attributes
   */
  async createActivity(programId, activityData) {
    const response = await api.post(`/api/programs/${programId}/activities`, activityData);
    return response.data;
  }

  /**
   * Update activity
   * @param {string} programId - The program ID
   * @param {string} activityId - The activity ID
   * @param {object} activityData - Updated activity data
   */
  async updateActivity(programId, activityId, activityData) {
    const response = await api.put(
      `/api/programs/${programId}/activities/${activityId}`, 
      activityData
    );
    return response.data;
  }

  /**
   * Delete activity
   */
  async deleteActivity(programId, activityId) {
    return await api.delete(`/api/programs/${programId}/activities/${activityId}`);
  }

  /**
   * Get activities by user (current logged-in user)
   */
  async getMyActivities(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = queryParams ? `/api/activities/my?${queryParams}` : "/api/activities/my";
    const response = await api.get(endpoint);
    return response.data;
  }

  /**
   * Get activities by office
   * Useful for office-specific activity views
   */
  async getActivitiesByOffice(officeId, filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = queryParams 
      ? `/api/office/${officeId}/activities?${queryParams}` 
      : `/api/office/${officeId}/activities`;
    const response = await api.get(endpoint);
    return response.data;
  }

  /**
   * Bulk create activities (for batch operations)
   */
  async bulkCreateActivities(programId, activitiesArray) {
    const response = await api.post(
      `/api/programs/${programId}/activities/bulk`, 
      { activities: activitiesArray }
    );
    return response.data;
  }
}

export default new ActivityService();
