import api from "./api";

/**
 * Message Service
 * Handles messaging between offices and unit director
 */
class MessageService {
  /**
   * Get all messages for current user (grouped by latest)
   */
  async getMessages() {
    try {
      const response = await api.get("messages");
      return response;
    } catch (error) {
      console.error("Get messages error:", error);
      throw error;
    }
  }

  /**
   * Get all messages for current user (complete history)
   */
  async getAllMessages() {
    try {
      const response = await api.get("messages/all");
      return response;
    } catch (error) {
      console.error("Get all messages error:", error);
      throw error;
    }
  }

  /**
   * Send a new message
   * @param {string} receiverId - ID of the receiver
   * @param {string} receiverType - Type of receiver (unit_director or office_user)
   * @param {string} subject - Message subject
   * @param {string} message - Message content
   */
  async sendMessage(receiverId, receiverType, subject, message) {
    try {
      const response = await api.post("messages", {
        receiverId,
        receiverType,
        subject,
        message,
      });
      return response;
    } catch (error) {
      console.error("Send message error:", error);
      throw error;
    }
  }

  /**
   * Mark a message as read
   * @param {string} messageId - ID of the message
   */
  async markAsRead(messageId) {
    try {
      const response = await api.put(`messages/${messageId}/read`);
      return response;
    } catch (error) {
      console.error("Mark message as read error:", error);
      throw error;
    }
  }

  /**
   * Delete a message
   * @param {string} messageId - ID of the message
   */
  async deleteMessage(messageId) {
    try {
      const response = await api.delete(`messages/${messageId}`);
      return response;
    } catch (error) {
      console.error("Delete message error:", error);
      throw error;
    }
  }

  /**
   * Get list of offices (for Unit Director)
   */
  async getOffices() {
    try {
      const response = await api.get("messages/offices");
      return response;
    } catch (error) {
      console.error("Get offices error:", error);
      throw error;
    }
  }
}

export default new MessageService();
