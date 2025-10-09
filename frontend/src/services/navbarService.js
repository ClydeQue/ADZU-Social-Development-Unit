import api from './api';

/**
 * Navbar Service
 * Handles fetching navbar-related data like notifications, messages, and user info
 */
const NavbarService = {
  /**
   * Get user profile data for navbar
   * @returns {Promise<Object>} User profile data
   */
  async getUserProfile() {
    try {
      const response = await api.get('/unit-director/profile');
      return response;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  /**
   * Get unread notifications count
   * @returns {Promise<Object>} Notifications data
   */
  async getNotifications() {
    try {
      const response = await api.get('/unit-director/notifications');
      return response;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  /**
   * Get unread messages/emails count
   * @returns {Promise<Object>} Messages data
   */
  async getMessages() {
    try {
      const response = await api.get('/unit-director/messages');
      return response;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  },

  /**
   * Mark notification as read
   * @param {string} notificationId - The notification ID to mark as read
   * @returns {Promise<Object>} Updated notification
   */
  async markNotificationAsRead(notificationId) {
    try {
      const response = await api.put(`/unit-director/notifications/${notificationId}/read`);
      return response;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  /**
   * Mark message as read
   * @param {string} messageId - The message ID to mark as read
   * @returns {Promise<Object>} Updated message
   */
  async markMessageAsRead(messageId) {
    try {
      const response = await api.put(`/unit-director/messages/${messageId}/read`);
      return response;
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  }
};

export default NavbarService;
