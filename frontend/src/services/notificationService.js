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
      console.log("Fetching notifications...");
      const response = await api.get("api/notifications");
      console.log("Notifications response:", response);
      // Ensure we always return a valid data structure
      return response || { items: [], unread: 0 };
    } catch (error) {
      console.error("Error fetching notifications:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
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
      console.log("Testing notifications endpoint...");
      // Use POST instead of GET to send user context in body
      const response = await api.post("api/notifications/test", {
        userContext: {
          timestamp: new Date().toISOString(),
          action: "test-notification",
        },
      });
      console.log("Test response:", response);
      return response;
    } catch (error) {
      console.error("Error testing notifications:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      // Include more context in the error
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
