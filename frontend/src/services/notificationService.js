import api from "./api";

/**
 * Service for handling notification-related API calls
 */
const NotificationService = {
  /**
   * Get all notifications
   * @returns {Promise<Object>} Notifications data with items array and unread count
   */
  async getNotifications() {
    try {
      const response = await api.get("api/notifications");
      // Ensure we always return a valid data structure
      return response || { items: [], unread: 0 };
    } catch (error) {
      console.error("Error fetching notifications:", error);
      // Return default data structure on error
      return { items: [], unread: 0 };
    }
  },

  /**
   * Mark a notification as read
   * @param {string} notificationId - The ID of the notification to mark as read
   * @returns {Promise<Object>} Updated notification data
   */
  async markAsRead(notificationId) {
    try {
      const response = await api.put(`api/notifications/${notificationId}/read`);
      return response;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  },

  /**
   * Test notifications endpoint
   * @returns {Promise<Object>} Test response
   */
  async testNotifications() {
    try {
      const response = await api.post("api/notifications/test", {
        userContext: {
          timestamp: new Date().toISOString(),
          action: "test-notification",
        },
      });
      return response;
    } catch (error) {
      console.error("Error testing notifications:", error);
      const enhancedError = new Error(
        error.response?.data?.details || error.message
      );
      enhancedError.originalError = error;
      enhancedError.responseData = error.response?.data;
      throw enhancedError;
    }
  },
};

export default NotificationService;
