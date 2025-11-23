import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Close as CloseIcon } from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import MessageService from "@/services/messageService";
import { useAuth } from "@/context/AuthContext";
import { formatDate } from "@/utils/timeFormat";
import ErrorModal from "@/components/alerts/ErrorModal";

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
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Delete message mutation
  const deleteMessageMutation = useMutation({
    mutationFn: (messageId) => MessageService.deleteMessage(messageId),
    onSuccess: () => {
      queryClient.invalidateQueries(["allMessages"]);
      queryClient.invalidateQueries(["messages"]);
      queryClient.invalidateQueries(["all-messages"]);
    },
    onError: (error) => {
      setErrorMessage(
        `Failed to delete message: ${error.message || "Unknown error"}`
      );
      setShowErrorModal(true);
    },
  });

  // Handle delete message
  const handleDeleteMessage = (messageId) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      deleteMessageMutation.mutate(messageId);
    }
  };

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
      setErrorMessage(
        `Failed to send message: ${error.message || "Unknown error"}`
      );
      setShowErrorModal(true);
    },
  });

  const handleSend = () => {
    if (!messageText.trim()) {
      setErrorMessage("Please enter a message");
      setShowErrorModal(true);
      return;
    }

    // Get device's current time in ISO format
    const clientTimestamp = new Date().toISOString();

    sendMessageMutation.mutate({
      receiverId: contact.id,
      receiverType: contact.type,
      subject: subject.trim() || "Conversation",
      message: messageText.trim(),
      clientTimestamp: clientTimestamp,
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="absolute right-0 top-full mt-2 z-50 w-[90vw] sm:w-[500px] shadow-2xl">
      <div className="bg-white rounded-xl overflow-hidden flex flex-col max-h-[80vh] border border-gray-200">
        {/* Header */}
        <div className="bg-[#E8E7FF] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-[#4D49FC] rounded-full"></div>
            <div>
              <h2
                className="text-base font-bold text-[#040195]"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {contact.office || contact.name}
              </h2>
              {contact.office && contact.name !== contact.office && (
                <p className="text-[10px] text-[#040195] opacity-70">
                  {contact.name}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#040195] hover:bg-white hover:bg-opacity-50 rounded-full p-1 transition-colors"
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </button>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-3 bg-gray-50 min-h-[250px]">
          {conversationMessages.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 text-xs">
                No messages yet. Start the conversation!
              </p>
            </div>
          ) : (
            <div className="space-y-2">
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
                      className={`max-w-[70%] rounded-2xl px-4 py-3 shadow-sm relative group ${
                        isSent
                          ? "bg-[#4D49FC] text-white"
                          : "bg-white text-gray-900 border border-gray-200"
                      }`}
                    >
                      {/* Delete button */}
                      <button
                        onClick={() => handleDeleteMessage(message.id)}
                        disabled={deleteMessageMutation.isPending}
                        className={`absolute -top-2 -right-2 p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 ${
                          isSent
                            ? "bg-red-600 hover:bg-red-700 text-white"
                            : "bg-red-600 hover:bg-red-700 text-white"
                        }`}
                        title="Delete message"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>

                      <div className="mb-1">
                        <p
                          className={`text-[10px] font-bold ${
                            isSent
                              ? "text-white text-opacity-90"
                              : "text-[#4D49FC]"
                          }`}
                          style={{ fontFamily: "Inter, sans-serif" }}
                        >
                          {isSent ? "You" : message.sender}
                        </p>
                      </div>
                      {message.subject && (
                        <div className="mb-1">
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
                          className={`text-xs mb-0.5 whitespace-pre-wrap ${
                            message.isDeleted
                              ? "italic opacity-60"
                              : isSent
                              ? "text-white"
                              : "text-gray-700"
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
        <div className="p-3 bg-white border-t border-gray-200">
          <div className="flex gap-2 items-end">
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              rows="3"
              className="flex-1 px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:border-[#4D49FC]"
              style={{ fontFamily: "Inter, sans-serif" }}
            />
          </div>
          <div className="mt-2 flex justify-start">
            <button
              onClick={handleSend}
              disabled={
                sendMessageMutation.isPending ||
                !messageText.trim()
              }
              className="px-5 py-2 bg-[#4D49FC] text-white rounded-lg text-sm font-semibold hover:bg-[#3D39EC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor"/>
              </svg>
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Error Modal */}
      <ErrorModal
        show={showErrorModal}
        message={errorMessage}
        onClose={() => setShowErrorModal(false)}
      />
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
