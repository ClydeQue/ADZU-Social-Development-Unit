import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { Email as EmailIcon } from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import MessageService from "@/services/messageService";
import ComposeMessageDialog from "./ComposeMessageDialog";
import MessageThreadDialog from "./MessageThreadDialog";

/**
 * Inbox Dropdown Component
 * Displays inbox messages with filtering options
 */
function InboxDropdown({ onMessageClick }) {
  const [showInbox, setShowInbox] = useState(false);
  const [inboxFilter, setInboxFilter] = useState("all"); // 'all' or 'unread'
  const [showCompose, setShowCompose] = useState(false);
  const [showThread, setShowThread] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const inboxRef = useRef(null);

  // Fetch messages (only when component is mounted)
  const {
    data: messagesData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["messages"],
    queryFn: MessageService.getMessages,
    select: (data) => data || { messages: [], unread: 0 },
    staleTime: 10 * 60 * 1000, // Consider data fresh for 10 minutes
    gcTime: 15 * 60 * 1000, // Keep in cache for 15 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: false, // Don't refetch on component mount if data exists
    retry: false, // Don't retry on error to avoid blocking login
  });

  const messages = messagesData?.messages || [];
  const unreadCount = messagesData?.unread || 0;

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (inboxRef.current && !inboxRef.current.contains(event.target)) {
        setShowInbox(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle conversation click
  const handleConversationClick = async (message) => {
    // Mark as read
    try {
      if (message.unread) {
        await MessageService.markAsRead(message.id);
        refetch();
      }
    } catch (error) {
      console.error("Error marking message as read:", error);
    }

    // Open thread dialog
    setSelectedContact({
      id: message.otherPartyId,
      name: message.sender,
      type: message.isSent ? message.receiverType : message.senderType,
      office: message.office,
    });
    setShowThread(true);
    setShowInbox(false);
  };

  // Filter messages
  const filteredMessages =
    inboxFilter === "unread" ? messages.filter((m) => m.unread) : messages;

  return (
    <div className="relative font-inter" ref={inboxRef}>
      {/* Email Button */}
      <button
        onClick={() => setShowInbox(!showInbox)}
        className="w-7 h-7 sm:w-8 sm:h-8 xl:w-9 xl:h-9 hover:cursor-pointer flex items-center justify-center bg-white hover:bg-[#E8EAFF] rounded-full transition-colors relative"
      >
        <EmailIcon
          className="text-[#5B6FED]"
          sx={{ fontSize: { xs: 16, sm: 18, xl: 19 } }}
        />
        {unreadCount > 0 && (
          <span className="absolute bottom-0 right-0 z-50 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-semibold text-[9px] xl:text-[10px] shadow-md border-2 border-white pointer-events-none">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {showInbox && (
        <div className="absolute right-0 top-full mt-2 w-100 bg-white rounded-xl shadow-2xl z-50 border border-gray-100">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-[#040195]">Inbox</h3>

              <button
                onClick={() => {
                  setShowCompose(true);
                  setShowInbox(false);
                }}
                className="p-1.5 bg-[#4D49FC] flex items-center gap-1.5 text-white rounded-lg - 8px px-3 py-1 hover:bg-[#3D39EC] transition-colors"
                title="Compose message"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 000-1.41l-2.34-2.34a.996.996 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                    fill="currentColor"
                  />
                </svg>
                <span className="text-xs font-semibold">Compose</span>
              </button>
            </div>
            <div className="flex gap-1.5">
              <button
                onClick={() => setInboxFilter("all")}
                className={`px-3 py-1 rounded-full hover:cursor-pointer text-[10px] font-semibold transition-colors ${
                  inboxFilter === "all"
                    ? "bg-[#CDCCFF] text-[#040195]"
                    : "text-[#040195] bg-[#F4F4FF] hover:bg-[#E6E6FF]"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setInboxFilter("unread")}
                className={`px-3 py-1 hover:cursor-pointer rounded-full text-[10px] font-semibold transition-colors ${
                  inboxFilter === "unread"
                    ? "bg-[#E8E7FF] text-[#040195]"
                    : "text-[#040195] bg-[#F4F4FF] hover:bg-[#E6E6FF]"
                }`}
              >
                Unread
              </button>
            </div>
          </div>

          {/* Messages List */}
          <div className="max-h-[400px] overflow-y-auto">
            {isLoading ? (
              <div className="px-4 py-8 text-center">
                <p className="text-xs text-gray-400">Loading messages...</p>
              </div>
            ) : error ? (
              <div className="px-4 py-8 text-center">
                <p className="text-xs text-red-500">Error loading messages</p>
              </div>
            ) : filteredMessages.length > 0 ? (
              filteredMessages.map((message) => (
                <div
                  key={message.id}
                  onClick={() => handleConversationClick(message)}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-b-0"
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar or Icon */}
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="w-8 h-8 rounded-full bg-[#E8EAFF] flex items-center justify-center">
                        <span className="text-xs font-semibold text-[#5B6FED]">
                          {message.sender?.charAt(0) || "?"}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-xs font-bold text-gray-900 mb-0.5">
                            {message.sender}
                          </p>
                          <p className="text-[10px] text-gray-400 line-clamp-2">
                            {message.preview}
                          </p>
                        </div>

                        {/* Time and Indicator */}
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-[9px] text-gray-400 whitespace-nowrap">
                            {message.time}
                          </span>
                          {message.unread && (
                            <span className="w-2 h-2 bg-[#5B6FED] rounded-full"></span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-8 text-center">
                <EmailIcon
                  className="text-gray-300 mx-auto mb-2"
                  sx={{ fontSize: 48 }}
                />
                <p className="text-xs text-gray-400">
                  {inboxFilter === "unread"
                    ? "No unread messages"
                    : "No messages"}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          {filteredMessages.length > 5 && (
            <div className="px-4 py-2 border-t border-gray-100">
              <button className="w-full text-center text-xs text-[#040195] hover:text-[#4D49FC] transition-colors font-semibold">
                View all messages
              </button>
            </div>
          )}
        </div>
      )}

      {/* Compose Message Dialog */}
      {showCompose && (
        <ComposeMessageDialog onClose={() => setShowCompose(false)} />
      )}

      {/* Message Thread Dialog */}
      {showThread && selectedContact && (
        <MessageThreadDialog
          contact={selectedContact}
          onClose={() => {
            setShowThread(false);
            setSelectedContact(null);
            refetch();
          }}
        />
      )}
    </div>
  );
}

// PropTypes validation
InboxDropdown.propTypes = {
  onMessageClick: PropTypes.func,
};

export default InboxDropdown;
