import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {
  Close as CloseIcon,
  Send as SendIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import MessageService from "@/services/messageService";
import { useAuth } from "@/context/AuthContext";
import { formatDate } from "@/utils/timeFormat";

/**
 * Message Thread Dialog
 * Shows full conversation history like a messaging app
 */
export default function MessageThreadDialog({ contact, onClose }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef(null);
  const [messageText, setMessageText] = useState("");
  const [subject, setSubject] = useState("");

  // Fetch all messages
  const { data: allMessagesData } = useQuery({
    queryKey: ["allMessages"],
    queryFn: MessageService.getAllMessages,
    refetchOnWindowFocus: true,
  });

  // Filter messages for this conversation
  const conversationMessages = (allMessagesData?.messages || [])
    .filter(
      (msg) => msg.senderId === contact.id || msg.receiverId === contact.id
    )
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversationMessages.length]);

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: (data) =>
      MessageService.sendMessage(
        data.receiverId,
        data.receiverType,
        data.subject,
        data.message,
        data.clientTimestamp
      ),
    onSuccess: () => {
      queryClient.invalidateQueries(["allMessages"]);
      queryClient.invalidateQueries(["messages"]);
      setMessageText("");
      setSubject("");
    },
    onError: (error) => {
      alert(`Failed to send message: ${error.message || "Unknown error"}`);
    },
  });

  // Delete message mutation
  const deleteMessageMutation = useMutation({
    mutationFn: (messageId) => MessageService.deleteMessage(messageId),
    onSuccess: () => {
      queryClient.invalidateQueries(["allMessages"]);
      queryClient.invalidateQueries(["messages"]);
    },
    onError: (error) => {
      alert(`Failed to delete message: ${error.message || "Unknown error"}`);
    },
  });

  const handleSend = () => {
    if (!messageText.trim()) {
      alert("Please enter a message");
      return;
    }

    if (!subject.trim()) {
      alert("Please enter a subject");
      return;
    }

    // Get device's current time in ISO format
    const clientTimestamp = new Date().toISOString();

    sendMessageMutation.mutate({
      receiverId: contact.id,
      receiverType: contact.type,
      subject: subject.trim(),
      message: messageText.trim(),
      clientTimestamp: clientTimestamp,
    });
  };

  const handleDelete = (messageId) => {
    if (confirm("Delete this message?")) {
      deleteMessageMutation.mutate(messageId);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl h-[85vh] shadow-2xl flex flex-col">
        {/* Header */}
        <div className="bg-[#4D49FC] text-white px-6 py-4 flex items-center justify-between rounded-t-xl">
          <div>
            <h2
              className="text-xl font-bold"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {contact.office || contact.name}
            </h2>
            {contact.office && contact.name !== contact.office && (
              <p className="text-xs text-white text-opacity-80">
                {contact.name}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {conversationMessages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-sm">
                No messages yet. Start the conversation!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {conversationMessages.map((message) => {
                const isSent = message.senderId === user?.id;
                return (
                  <div
                    key={message.id}
                    className={`flex ${
                      isSent ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-3 shadow-sm ${
                        isSent
                          ? "bg-[#4D49FC] text-white"
                          : "bg-white text-gray-900"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <p
                          className={`text-xs font-bold ${
                            isSent
                              ? "text-white text-opacity-90"
                              : "text-[#4D49FC]"
                          }`}
                          style={{ fontFamily: "Inter, sans-serif" }}
                        >
                          {isSent ? "You" : message.sender}
                        </p>
                        {isSent && (
                          <button
                            onClick={() => handleDelete(message.id)}
                            className="text-white text-opacity-70 hover:text-opacity-100 transition-opacity"
                            title="Delete message"
                          >
                            <DeleteIcon sx={{ fontSize: 14 }} />
                          </button>
                        )}
                      </div>
                      {message.subject && (
                        <div className="mb-2">
                          <p
                            className={`text-[9px] uppercase tracking-wide mb-0.5 ${
                              isSent
                                ? "text-white text-opacity-60"
                                : "text-gray-400"
                            }`}
                            style={{ fontFamily: "Inter, sans-serif" }}
                          >
                            Subject:
                          </p>
                          <p
                            className={`text-xs font-semibold ${
                              isSent
                                ? "text-white text-opacity-90"
                                : "text-gray-700"
                            }`}
                            style={{ fontFamily: "Inter, sans-serif" }}
                          >
                            {message.subject}
                          </p>
                        </div>
                      )}
                      <div>
                        <p
                          className={`text-[9px] uppercase tracking-wide mb-0.5 ${
                            isSent
                              ? "text-white text-opacity-60"
                              : "text-gray-400"
                          }`}
                          style={{ fontFamily: "Inter, sans-serif" }}
                        >
                          Message:
                        </p>
                        <p
                          className={`text-sm mb-1 whitespace-pre-wrap ${
                            isSent ? "text-white" : "text-gray-700"
                          }`}
                          style={{ fontFamily: "Inter, sans-serif" }}
                        >
                          {message.message}
                        </p>
                      </div>
                      <p
                        className={`text-[9px] ${
                          isSent
                            ? "text-white text-opacity-60"
                            : "text-gray-400"
                        }`}
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        {formatDate(message.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="p-4 bg-white border-t border-gray-200 rounded-b-xl">
          <div className="mb-2">
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4D49FC] focus:border-transparent"
              style={{ fontFamily: "Inter, sans-serif" }}
            />
          </div>
          <div className="flex gap-2">
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              rows="2"
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#4D49FC] focus:border-transparent"
              style={{ fontFamily: "Inter, sans-serif" }}
            />
            <button
              onClick={handleSend}
              disabled={
                sendMessageMutation.isPending ||
                !messageText.trim() ||
                !subject.trim()
              }
              className="px-6 py-2 bg-[#4D49FC] text-white rounded-lg font-semibold hover:bg-[#3D39EC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              <SendIcon sx={{ fontSize: 18 }} />
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

MessageThreadDialog.propTypes = {
  contact: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    office: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};
