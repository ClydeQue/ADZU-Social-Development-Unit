/**
 * Dashboard Service
 * Handles API calls for Unit Director Dashboard data
 */

import api from './api';

class DashboardService {
  /**
   * Get dashboard statistics (completed, in progress, pending)
   */
  async getDashboardStats() {
    return api.get('api/unit-director/dashboard');
  }

  /**
   * Get upcoming activities (next 3 closest to current date)
   */
  async getUpcomingActivities() {
    return api.get('api/unit-director/upcoming-activities');
  }
}

export default new DashboardService();
