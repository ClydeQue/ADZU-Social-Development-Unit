import { useState, useRef, useEffect } from "react";
import { Email as EmailIcon } from "@mui/icons-material";

/**
 * Inbox Dropdown Component
 * Displays inbox messages with filtering options
 */
function InboxDropdown() {
  const [showInbox, setShowInbox] = useState(false);
  const [inboxFilter, setInboxFilter] = useState("all"); // 'all' or 'unread'
  const inboxRef = useRef(null);

  // Mock data - will be replaced with actual API call later
  const [messages] = useState([
    // This will be populated from API
  ]);

  const unreadCount = messages.filter(m => m.unread).length;

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

  // Filter messages
  const filteredMessages = inboxFilter === "unread" 
    ? messages.filter(m => m.unread) 
    : messages;

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
            <h3 className="text-base font-bold text-[#040195] mb-2">
              Inbox
            </h3>
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
            {filteredMessages.length > 0 ? (
              filteredMessages.map((message) => (
                <div
                  key={message.id}
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
                          <p className="text-xs text-gray-600 line-clamp-2 mb-1">
                            {message.subject}
                          </p>
                          <p className="text-[10px] text-gray-400">
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
                  {inboxFilter === "unread" ? "No unread messages" : "No messages"}
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
    </div>
  );
}

export default InboxDropdown;
