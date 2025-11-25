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
   * Get SDG analytics by office
   */
  async getSDGAnalytics() {
    return await api.get("api/unit-director/sdg-analytics");
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

  /**
   * Add program to office
   */
  async addProgram(officeId, programData) {
    return await api.post(
      `api/settings/office/${officeId}/program`,
      programData
    );
  }

  /**
   * Delete program
   */
  async deleteProgram(programId) {
    return await api.delete(`api/settings/program/${programId}`);
  }

  /**
   * Get conversation count for specific office
   */
  async getOfficeConversationCount(officeId) {
    return await api.get(`api/messages/office/${officeId}/conversation-count`);
  }

  /**
   * Delete conversations older than 1 year for specific office
   */
  async deleteOldConversations(officeId) {
    return await api.delete(
      `api/messages/delete-old-conversations?officeId=${officeId}`
    );
  }

  /**
   * Get all program requests
   */
  async getProgramRequests() {
    return await api.get("api/unit-director/program-requests");
  }

  /**
   * Get program create requests only
   */
  async getProgramCreateRequests() {
    return await api.get("api/unit-director/program-requests?type=create");
  }

  /**
   * Get program edit/update requests only
   */
  async getProgramEditRequests() {
    return await api.get("api/unit-director/program-requests?type=update");
  }

  /**
   * Get program delete requests only
   */
  async getProgramDeleteRequests() {
    return await api.get("api/unit-director/program-requests?type=delete");
  }

  /**
   * Approve program request
   */
  async approveProgramRequest(requestId) {
    return await api.put(`api/unit-director/program-requests/${requestId}/approve`);
  }

  /**
   * Reject program request
   */
  async rejectProgramRequest(requestId, rejectionReason = "") {
    return await api.put(`api/unit-director/program-requests/${requestId}/reject`, {
      rejection_reason: rejectionReason,
    });
  }
}

export default new UnitDirectorService();
