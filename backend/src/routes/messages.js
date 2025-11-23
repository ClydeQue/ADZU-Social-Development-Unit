const express = require("express");
const router = express.Router();
const supabase = require("../config/database");
const { authenticateToken, requireRole } = require("../middleware/auth");

console.log("✅ Messages route loaded");

// Get ALL messages for current user (complete history)
router.get("/all", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const userType = req.user.userType;

    let query = supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });

    // Filter based on user type
    if (userType === "unit_director") {
      query = query.or(`receiver_id.eq.${userId},sender_id.eq.${userId}`);
    } else {
      // Office users can ONLY see messages where THEY are involved
      // Either they sent it OR they received it
      query = query.or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);
    }

    const { data: messages, error } = await query;

    if (error) throw error;

    // EXTRA SECURITY: For office users, filter out any messages where they are NOT involved
    let filteredMessages = messages;
    if (userType !== "unit_director") {
      filteredMessages = messages?.filter(
        (msg) => msg.sender_id === userId || msg.receiver_id === userId
      );
    }

    // Get user names and office info
    const userIds = new Set();
    filteredMessages?.forEach((msg) => {
      userIds.add(msg.sender_id);
      userIds.add(msg.receiver_id);
    });

    let users = [];
    if (userIds.size > 0) {
      const { data: fetchedUsers } = await supabase
        .from("office_credentials")
        .select("id, name, user_type, office_id, offices(name, acronym)")
        .in("id", Array.from(userIds));
      users = fetchedUsers || [];
    }

    const userMap = {};
    users?.forEach((u) => {
      const displayName =
        u.user_type === "unit_director"
          ? "Unit Director"
          : u.offices?.name || u.name;
      userMap[u.id] = {
        name: displayName,
        user_type: u.user_type,
      };
    });

    // Format all messages
    const formattedMessages =
      filteredMessages?.map((msg) => {
        const isSender = msg.sender_id === userId;

        // Show "Message deleted" if the message is deleted and user is not the one who deleted it
        const isDeletedByOther = msg.is_deleted && msg.deleted_by !== userId;

        return {
          id: msg.id,
          sender: userMap[msg.sender_id]?.name || "Unknown",
          senderId: msg.sender_id,
          senderType: msg.sender_type,
          receiver: userMap[msg.receiver_id]?.name || "Unknown",
          receiverId: msg.receiver_id,
          receiverType: msg.receiver_type,
          subject: isDeletedByOther ? "Message deleted" : msg.subject,
          message: isDeletedByOther
            ? "This message has been deleted"
            : msg.message,
          createdAt: msg.created_at,
          isSent: isSender,
          isRead: msg.is_read,
          isDeleted: msg.is_deleted || false,
          deletedBy: msg.deleted_by || null,
        };
      }) || [];

    res.json({
      messages: formattedMessages,
    });
  } catch (error) {
    console.error("Get all messages error:", error);
    res.status(500).json({
      error: "Error fetching messages",
      details: error.message,
    });
  }
});

// Get messages for current user (Unit Director or Office) - Latest per conversation
router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const userType = req.user.userType;
    const officeId = req.user.office_id;

    console.log("Get messages request:", { userId, userType, officeId });

    let query = supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });

    // Filter based on user type
    if (userType === "unit_director") {
      // Unit Director sees all messages sent to them or sent by them
      query = query.or(`receiver_id.eq.${userId},sender_id.eq.${userId}`);
    } else {
      // Office users can ONLY see messages where THEY are involved
      // Either they sent it OR they received it
      query = query.or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);
    }

    const { data: messages, error } = await query;

    if (error) {
      console.error("Supabase query error:", error);
      throw error;
    }

    console.log(`Found ${messages?.length || 0} messages`);

    // EXTRA SECURITY: For office users, filter out any messages where they are NOT involved
    let filteredMessages = messages;
    if (userType !== "unit_director") {
      filteredMessages = messages?.filter(
        (msg) => msg.sender_id === userId || msg.receiver_id === userId
      );
    }

    // Get sender and receiver names with office info
    const userIds = new Set();
    filteredMessages?.forEach((msg) => {
      userIds.add(msg.sender_id);
      userIds.add(msg.receiver_id);
    });

    // Fetch user names with office details
    let users = [];
    if (userIds.size > 0) {
      const { data: fetchedUsers } = await supabase
        .from("office_credentials")
        .select("id, name, user_type, office_id, offices(name, acronym)")
        .in("id", Array.from(userIds));
      users = fetchedUsers || [];
    }

    const userMap = {};
    users?.forEach((u) => {
      const displayName =
        u.user_type === "unit_director"
          ? "Unit Director"
          : u.offices?.name || u.name;
      userMap[u.id] = {
        name: displayName,
        user_type: u.user_type,
        office: u.offices?.name,
      };
    });

    // Format messages for frontend
    const formattedMessages =
      filteredMessages?.map((msg) => {
        const isSender = msg.sender_id === userId;
        const otherPartyId = isSender ? msg.receiver_id : msg.sender_id;
        const otherParty = userMap[otherPartyId];

        // Show "Message deleted" if the message is deleted and user is not the one who deleted it
        const isDeletedByOther = msg.is_deleted && msg.deleted_by !== userId;

        return {
          id: msg.id,
          sender: otherParty?.name || "Unknown",
          senderId: msg.sender_id,
          senderType: msg.sender_type,
          receiverId: msg.receiver_id,
          receiverType: msg.receiver_type,
          subject: isDeletedByOther ? "Message deleted" : msg.subject,
          preview: isDeletedByOther
            ? "This message has been deleted"
            : msg.message?.substring(0, 100) || "",
          message: isDeletedByOther
            ? "This message has been deleted"
            : msg.message,
          time: getTimeAgo(msg.created_at),
          unread: !isSender && !msg.is_read,
          createdAt: msg.created_at,
          isSent: isSender,
          otherPartyId: otherPartyId,
          office: otherParty?.office,
          isDeleted: msg.is_deleted || false,
          deletedBy: msg.deleted_by || null,
        };
      }) || [];

    // Group by other party and get only the latest message from each
    // Filter out messages where sender and receiver are the same (shouldn't happen but just in case)
    const conversationMap = new Map();
    formattedMessages.forEach((msg) => {
      // Skip if messaging yourself
      if (msg.senderId === msg.receiverId) {
        return;
      }

      const existing = conversationMap.get(msg.otherPartyId);
      if (!existing || new Date(msg.createdAt) > new Date(existing.createdAt)) {
        conversationMap.set(msg.otherPartyId, msg);
      }
    });

    const latestMessages = Array.from(conversationMap.values()).sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    const unreadCount = latestMessages.filter((m) => m.unread).length;

    res.json({
      messages: latestMessages,
      unread: unreadCount,
    });
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({
      error: "Error fetching messages",
      details: error.message,
    });
  }
});

// Send a new message
router.post("/", authenticateToken, async (req, res) => {
  try {
    let { receiverId, receiverType, subject, message, clientTimestamp } =
      req.body;
    const senderId = req.user.id;
    const senderType = req.user.userType;

    console.log("Send message request:", {
      senderId,
      senderType,
      receiverId,
      receiverType,
      subject,
    });

    // Validation
    if (!receiverType || !subject || !message) {
      return res.status(400).json({
        error: "receiverType, subject, and message are required",
      });
    }

    // If office user is sending to unit_director and receiverId is not provided,
    // automatically find the unit director's ID
    if (
      senderType === "office_user" &&
      receiverType === "unit_director" &&
      !receiverId
    ) {
      const { data: unitDirector, error: udError } = await supabase
        .from("office_credentials")
        .select("id")
        .eq("user_type", "unit_director")
        .eq("is_active", true)
        .single();

      if (udError || !unitDirector) {
        return res.status(404).json({
          error: "Unit Director not found",
        });
      }

      receiverId = unitDirector.id;
      console.log("Auto-assigned Unit Director ID:", receiverId);
    }

    // Now validate receiverId is provided
    if (!receiverId) {
      return res.status(400).json({
        error: "receiverId is required",
      });
    }

    // Validate messaging rules:
    // - Office users can ONLY message unit_director
    // - Unit director can message any office user
    // - At least one party must be unit_director
    if (senderType === "office_user" && receiverType !== "unit_director") {
      return res.status(403).json({
        error: "Office users can only send messages to Unit Director",
      });
    }

    if (senderType !== "unit_director" && receiverType !== "unit_director") {
      return res.status(403).json({
        error: "Messages must involve Unit Director",
      });
    }

    // Create message with client timestamp
    const messageData = {
      sender_id: senderId,
      sender_type: senderType,
      receiver_id: receiverId,
      receiver_type: receiverType,
      subject: subject,
      message: message,
      is_read: false,
    };

    // Use client timestamp if provided (ensures correct local time)
    if (clientTimestamp) {
      messageData.created_at = clientTimestamp;
      messageData.updated_at = clientTimestamp;
    }

    const { data: newMessage, error } = await supabase
      .from("messages")
      .insert([messageData])
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      throw error;
    }

    console.log("Message created successfully:", newMessage);

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    console.error("Send message error:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      error: "Error sending message",
      details: error.message,
      hint: error.hint || null,
      code: error.code || null,
    });
  }
});

// Mark message as read
router.put("/:messageId/read", authenticateToken, async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    console.log("Mark message as read:", { messageId, userId });

    // Verify user is the receiver
    const { data: message, error: fetchError } = await supabase
      .from("messages")
      .select("receiver_id")
      .eq("id", messageId)
      .single();

    if (fetchError) throw fetchError;

    if (message.receiver_id !== userId) {
      return res.status(403).json({
        error: "You can only mark your own messages as read",
      });
    }

    // Update message
    const { error } = await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("id", messageId);

    if (error) throw error;

    res.json({
      success: true,
      message: "Message marked as read",
    });
  } catch (error) {
    console.error("Mark message as read error:", error);
    res.status(500).json({
      error: "Error marking message as read",
      details: error.message,
    });
  }
});

// Delete a message
router.delete("/:messageId", authenticateToken, async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    console.log("Delete message:", { messageId, userId });

    // Verify user is sender or receiver
    const { data: message, error: fetchError } = await supabase
      .from("messages")
      .select("sender_id, receiver_id")
      .eq("id", messageId)
      .single();

    if (fetchError) throw fetchError;

    if (message.sender_id !== userId && message.receiver_id !== userId) {
      return res.status(403).json({
        error: "You can only delete your own messages",
      });
    }

    // Try soft delete first (if columns exist), otherwise hard delete
    let deleteError = null;

    // Try soft delete
    const { error: softDeleteError } = await supabase
      .from("messages")
      .update({
        is_deleted: true,
        deleted_by: userId,
        deleted_at: new Date().toISOString(),
      })
      .eq("id", messageId);

    if (softDeleteError) {
      // If soft delete fails (columns don't exist), do hard delete
      console.log(
        "Soft delete failed, performing hard delete:",
        softDeleteError.message
      );
      const { error: hardDeleteError } = await supabase
        .from("messages")
        .delete()
        .eq("id", messageId);

      deleteError = hardDeleteError;
    }

    if (deleteError) throw deleteError;

    res.json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.error("Delete message error:", error);
    res.status(500).json({
      error: "Error deleting message",
      details: error.message,
    });
  }
});

// Get list of offices for Unit Director to send messages to
router.get(
  "/offices",
  authenticateToken,
  requireRole(["unit_director"]),
  async (req, res) => {
    try {
      const { data: credentials, error } = await supabase
        .from("office_credentials")
        .select(
          `
        id,
        name,
        user_type,
        office_id,
        offices(id, name, acronym)
      `
        )
        .eq("user_type", "office_user")
        .eq("is_active", true)
        .order("name");

      if (error) throw error;

      const formattedOffices = credentials.map((cred) => ({
        id: cred.id,
        name: cred.name,
        office: cred.offices?.name || "Unknown Office",
        acronym: cred.offices?.acronym || "N/A",
        officeId: cred.office_id,
      }));

      res.json({
        success: true,
        offices: formattedOffices,
      });
    } catch (error) {
      console.error("Get offices for messaging error:", error);
      res.status(500).json({
        error: "Error fetching offices",
        details: error.message,
      });
    }
  }
);

// Cleanup old messages (older than 3 years) - Unit Director only
router.delete(
  "/cleanup",
  authenticateToken,
  requireRole(["unit_director"]),
  async (req, res) => {
    try {
      console.log("Starting message cleanup...");

      // Calculate date 3 years ago
      const threeYearsAgo = new Date();
      threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);

      // Delete old messages
      const { data, error, count } = await supabase
        .from("messages")
        .delete({ count: "exact" })
        .lt("created_at", threeYearsAgo.toISOString());

      if (error) throw error;

      console.log(`Cleaned up ${count || 0} messages older than 3 years`);

      res.json({
        success: true,
        message: `Successfully cleaned up ${count || 0} old messages`,
        deletedCount: count || 0,
        cutoffDate: threeYearsAgo.toISOString(),
      });
    } catch (error) {
      console.error("Cleanup messages error:", error);
      res.status(500).json({
        error: "Error cleaning up messages",
        details: error.message,
      });
    }
  }
);

// Get message statistics - Unit Director only
router.get(
  "/stats",
  authenticateToken,
  requireRole(["unit_director"]),
  async (req, res) => {
    try {
      // Total messages
      const { count: totalCount, error: totalError } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true });

      if (totalError) throw totalError;

      // Messages older than 3 years
      const threeYearsAgo = new Date();
      threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);

      const { count: oldCount, error: oldError } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .lt("created_at", threeYearsAgo.toISOString());

      if (oldError) throw oldError;

      // Unread messages
      const { count: unreadCount, error: unreadError } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("is_read", false);

      if (unreadError) throw unreadError;

      res.json({
        success: true,
        stats: {
          total: totalCount || 0,
          oldMessages: oldCount || 0,
          unread: unreadCount || 0,
          retentionPeriod: "3 years",
          cutoffDate: threeYearsAgo.toISOString(),
        },
      });
    } catch (error) {
      console.error("Get message stats error:", error);
      res.status(500).json({
        error: "Error fetching message statistics",
        details: error.message,
      });
    }
  }
);

// Helper function to calculate time ago
function getTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// Automatic cleanup check on server start (runs once)
const performStartupCleanup = async () => {
  try {
    const threeYearsAgo = new Date();
    threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);

    const { count } = await supabase
      .from("messages")
      .delete({ count: "exact" })
      .lt("created_at", threeYearsAgo.toISOString());

    if (count && count > 0) {
      console.log(
        `✅ Startup cleanup: Removed ${count} messages older than 3 years`
      );
    }
  } catch (error) {
    console.error("❌ Startup cleanup failed:", error.message);
  }
};

// Run cleanup on module load
performStartupCleanup();

module.exports = router;
