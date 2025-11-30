import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Notifications as NotificationsIcon } from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import NotificationService from "@/services/notificationService";
import { getTimeAgo, formatDate } from "@/utils/timeFormat";
import NotificationModal from "@/components/NotificationModal";
import UnitDirectorService from "@/services/unitDirectorService";

/**
 * Reusable Notification Dropdown Component
 * Displays notifications with filtering, color-coded badges, and dot indicators
 */
function NotificationDropdown({ onNotificationClick }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationFilter, setNotificationFilter] = useState("all"); // 'all' or 'unread'
  const [selectedNotification, setSelectedNotification] = useState(null);
  const notificationRef = useRef(null);

  // Logo mapping for offices
  const logoMap = {
    acca: "/images/acca_logo_small.webp",
    aces: "/images/aces_logo_small.webp",
    aclg: "/images/aclg_logo_small.webp",
    altec: "/images/altec_logo_small.webp",
    apc: "/images/apc_logo_small.webp",
    cces: "/images/cces_logo_small.webp",
  };

  // Program Create Requests Query
  const { data: rawCreateRequestsData, isLoading: createRequestsLoading } =
    useQuery({
      queryKey: ["program-create-requests"],
      queryFn: UnitDirectorService.getProgramCreateRequests,
      staleTime: 5000,
      refetchOnMount: true,
    });

  // Only show requests with 'pending' status
  const createRequestsData = {
    ...rawCreateRequestsData,
    requests:
      rawCreateRequestsData?.requests?.filter((r) => r.status === "pending") ||
      [],
  };

  // Notifications Query
  const {
    data: notificationsData,
    isLoading: notificationsLoading,
    error: notificationsError,
    refetch: refetchNotifications,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: NotificationService.getNotifications,
    select: (data) => data || { items: [], unread: 0 },
    staleTime: 10 * 60 * 1000, // Consider data fresh for 10 minutes
    gcTime: 15 * 60 * 1000, // Keep in cache for 15 minutes
    refetchOnWindowFocus: false, // Don't refetch when user returns to window
    refetchOnMount: false, // Don't refetch on component mount if data exists
    refetchInterval: false, // Disable automatic polling
    retry: 2,
  });

  // Extract notifications and count
  const notifications =
    notificationFilter === "unread"
      ? notificationsData?.items?.filter((n) => n.unread) || []
      : notificationsData?.items || [];
  const notificationsCount = notificationsData?.unread || 0;

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle notification click
  const handleNotificationClick = async (notification) => {
    // Open modal
    setSelectedNotification(notification);

    // Close dropdown
    setShowNotifications(false);

    // Call parent handler if provided
    if (onNotificationClick) {
      onNotificationClick(notification.id);
    }

    // Mark as read and move to "all" filter
    if (notification.unread) {
      try {
        await NotificationService.markAsRead(notification.id);
        // Switch to "all" filter to show the notification was moved there
        setNotificationFilter("all");
        refetchNotifications();
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    }
  };

  // Close modal handler
  const closeModal = () => {
    setSelectedNotification(null);
  };

  return (
    <div className="relative font-inter" ref={notificationRef}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="w-7 h-7 sm:w-8 sm:h-8 xl:w-9 xl:h-9 hover:cursor-pointer flex items-center justify-center bg-white hover:bg-[#E8EAFF] rounded-full transition-colors relative"
      >
        <NotificationsIcon
          className="text-[#5B6FED]"
          sx={{ fontSize: { xs: 16, sm: 18, xl: 19 } }}
        />
        {notificationsCount > 0 && (
          <span className="absolute bottom-0 right-0 z-50 bg-red-500 text-white rounded-full min-w-[16px] max-w-[22px] h-4 flex items-center justify-center font-semibold text-[9px] xl:text-[10px] shadow-md border-2 border-white pointer-events-none px-0.5">
            {notificationsCount > 9 ? "9+" : notificationsCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {showNotifications && (
        <div className="absolute right-0 top-full mt-2 w-[90vw] sm:w-96 md:w-[400px] bg-white rounded-xl shadow-2xl z-50 border border-gray-100 max-w-[calc(100vw-2rem)]">
          {/* Header */}
          <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-100">
            <h3 className="text-sm sm:text-base font-bold text-[#040195] mb-2">
              Notifications
            </h3>
            <div className="flex gap-1 sm:gap-1.5">
              <button
                onClick={() => setNotificationFilter("all")}
                className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full hover:cursor-pointer text-[9px] sm:text-[10px] font-semibold transition-colors ${
                  notificationFilter === "all"
                    ? "bg-[#CDCCFF] text-[#040195]"
                    : "text-[#040195] bg-[#F4F4FF] hover:bg-[#E6E6FF]"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setNotificationFilter("unread")}
                className={`px-2 sm:px-3 py-0.5 sm:py-1 hover:cursor-pointer rounded-full text-[9px] sm:text-[10px] font-semibold transition-colors ${
                  notificationFilter === "unread"
                    ? "bg-[#E8E7FF] text-[#040195]"
                    : "text-[#040195] bg-[#F4F4FF] hover:bg-[#E6E6FF]"
                }`}
              >
                Unread
              </button>
            </div>
          </div>

          {/* Content Sections */}
          <div className="max-h-[60vh] sm:max-h-[400px] overflow-y-auto">
            {/* Activities Section */}
            <div className="border-b border-gray-100">
              <div className="px-3 sm:px-4 py-2 bg-gray-50 sticky top-0 z-10">
                <h4 className="text-[10px] sm:text-xs font-bold text-[#040195]">
                  Activities
                </h4>
              </div>

              <div className="max-h-[25vh] sm:max-h-[180px] overflow-y-auto">
                {notificationsLoading ? (
                  <div className="px-4 py-6 text-center text-xs text-gray-400">
                    Loading notifications...
                  </div>
                ) : notificationsError ? (
                  <div className="px-4 py-6 text-center">
                    <p className="text-xs text-red-500 mb-2">
                      Error loading notifications
                    </p>
                    <button
                      onClick={() => refetchNotifications()}
                      className="text-[10px] text-[#040195] hover:text-[#4D49FC] transition-colors"
                    >
                      Try again
                    </button>
                  </div>
                ) : notifications.length > 0 ? (
                  notifications.map((notification) => {
                    // Calculate dynamic time ago
                    const timeAgo = getTimeAgo(
                      notification.createdAt || new Date()
                    );

                    // Determine what date to display based on type
                    let dateLabel = "";
                    let dateValue = "";

                    if (notification.type === "Reminder") {
                      dateLabel = "Due";
                      dateValue = notification.dueDate
                        ? formatDate(notification.dueDate)
                        : "No due date";
                    } else if (notification.type === "Report") {
                      dateLabel = "Submitted";
                      dateValue = notification.submittedDate
                        ? formatDate(notification.submittedDate)
                        : "No submission date";
                    } else if (notification.type === "Updated") {
                      dateLabel = "Updated";
                      dateValue =
                        notification.updatedTime ||
                        notification.time ||
                        "Recently";
                    }

                    return (
                      <div
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`px-2 sm:px-3 py-2 sm:py-2.5 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-b-0 ${
                          notification.unread ? "bg-[#F0EFFF]" : ""
                        }`}
                      >
                        <div className="flex items-start gap-1.5 sm:gap-2">
                          {/* Office Logo */}
                          <div className="flex-shrink-0 mt-0.5">
                            <img
                              src={
                                notification.logo ||
                                "/logos/officeLogoTransparent/default.png"
                              }
                              alt={
                                notification.officeAcronym ||
                                notification.office
                              }
                              className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                              loading="eager"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  "/logos/officeLogoTransparent/default.png";
                              }}
                            />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-1 sm:gap-1.5">
                              <div className="flex-1 min-w-0">
                                <p className="text-[9px] sm:text-[10px] font-bold text-gray-500 mb-0.5 truncate">
                                  {notification.officeAcronym ||
                                    notification.office}
                                </p>
                                <p className="text-[10px] sm:text-xs font-black text-[#4D49FC] mb-0.5 line-clamp-2">
                                  {notification.activity}
                                </p>
                                <p className="text-[9px] sm:text-[10px] text-gray-400 truncate">
                                  {dateLabel}:{" "}
                                  <span style={{ color: "#4D49FC" }}>
                                    {dateValue}
                                  </span>
                                </p>
                              </div>

                              {/* Badge and Indicator */}
                              <div className="flex items-end gap-1 sm:gap-1.5 justify-center min-w-[50px] sm:min-w-[60px] flex-shrink-0">
                                {/* Type Badge - Standardized to #8988CD */}
                                <span
                                  style={{
                                    backgroundColor: "#8988CD",
                                  }}
                                  className="px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold text-[#ffffff]"
                                >
                                  {notification.type}
                                </span>

                                {/* Dot Indicator and Time */}
                                <div className="flex flex-col items-center">
                                  <span
                                    style={{
                                      backgroundColor:
                                        notification.indicatorColor ||
                                        (notification.unread
                                          ? "#ef4444"
                                          : "#22c55e"),
                                      boxShadow: `0 0 4px ${
                                        notification.indicatorColor ||
                                        (notification.unread
                                          ? "#ef4444"
                                          : "#22c55e")
                                      }60`,
                                    }}
                                    className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full mb-0.5"
                                  />
                                  <span className="text-[8px] sm:text-[9px] text-gray-400">
                                    {timeAgo}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="px-4 py-6 text-center text-xs text-gray-400">
                    No notifications
                  </div>
                )}
              </div>
            </div>

            if 

            {/* Program Requests Section */}
            <div>
              <div className="px-3 sm:px-4 py-2 bg-gray-50 sticky top-0 z-10">
                <h4 className="text-[10px] sm:text-xs font-bold text-[#040195]">
                  Program Requests
                </h4>
              </div>

              <div className="max-h-[25vh] sm:max-h-[180px] overflow-y-auto">
                {createRequestsLoading ? (
                  <div className="px-4 py-6 text-center text-xs text-gray-400">
                    Loading program requests...
                  </div>
                ) : createRequestsData?.requests?.length > 0 ? (
                  createRequestsData.requests.map((request) => (
                    <div
                      key={request.id}
                      className="px-2 sm:px-3 py-2 sm:py-2.5 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-b-0"
                    >
                      <div className="flex items-start gap-1.5 sm:gap-2">
                        {/* Office Logo */}
                        <div className="flex-shrink-0 mt-0.5">
                          <img
                            src={
                              logoMap[
                                request.offices?.acronym?.toLowerCase()
                              ] || "/logos/officeLogoTransparent/default.png"
                            }
                            alt={request.offices?.acronym || "Office"}
                            className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                            loading="eager"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "/logos/officeLogoTransparent/default.png";
                            }}
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-1 sm:gap-1.5">
                            <div className="flex-1 min-w-0">
                              <p className="text-[9px] sm:text-[10px] font-bold text-gray-500 mb-0.5 truncate">
                                {request.offices?.acronym || "Office"}
                              </p>
                              <p className="text-[10px] sm:text-xs font-black text-[#4D49FC] mb-0.5 line-clamp-2">
                                {request.title}
                              </p>
                              <p className="text-[9px] sm:text-[10px] text-gray-400 truncate">
                                Type:{" "}
                                <span style={{ color: "#4D49FC" }}>
                                  {request.request_type}
                                </span>
                              </p>
                            </div>

                            {/* Badge and Indicator */}
                            <div className="flex items-end gap-1 sm:gap-1.5 justify-center min-w-[50px] sm:min-w-[60px] flex-shrink-0">
                              {/* Status Badge */}
                              <span
                                style={{ backgroundColor: "#8988CD" }}
                                className="px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold text-[#ffffff]"
                              >
                                {request.status}
                              </span>

                              {/* Dot Indicator */}
                              <div className="flex flex-col items-center">
                                <span
                                  style={{
                                    backgroundColor:
                                      request.status === "pending"
                                        ? "#ef4444"
                                        : request.status === "approved"
                                        ? "#22c55e"
                                        : "#a1a1aa", // gray for rejected
                                    boxShadow:
                                      request.status === "pending"
                                        ? "0 0 4px #ef444460"
                                        : request.status === "approved"
                                        ? "0 0 4px #22c55e40"
                                        : "0 0 4px #a1a1aa40",
                                  }}
                                  className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full mb-0.5"
                                />
                                <span className="text-[8px] sm:text-[9px] text-gray-400">
                                  {request.status === "pending"
                                    ? "New"
                                    : request.status === "approved"
                                    ? "Approved"
                                    : "Rejected"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-6 text-center text-xs text-gray-400">
                    No program requests
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer - Retry button if error */}
          {notificationsError && (
            <div className="px-4 py-2 border-t border-gray-100">
              <button
                onClick={() => refetchNotifications()}
                className="w-full text-center text-xs text-[#040195] hover:text-[#4D49FC] transition-colors"
              >
                Retry loading notifications
              </button>
            </div>
          )}
        </div>
      )}

      {/* Notification Modal */}
      {selectedNotification && (
        <NotificationModal
          notification={selectedNotification}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

// PropTypes validation
NotificationDropdown.propTypes = {
  onNotificationClick: PropTypes.func,
};

export default NotificationDropdown;
