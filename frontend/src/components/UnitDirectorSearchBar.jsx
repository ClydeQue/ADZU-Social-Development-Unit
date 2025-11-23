import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Search as SearchIcon,
  Close as CloseIcon,
  Dashboard as DashboardIcon,
  Assessment as ProjectsIcon,
  Settings as SettingsIcon,
  HelpOutline as HelpIcon,
} from "@mui/icons-material";
import { useAuth } from "@/context/AuthContext";
import UnitDirectorService from "@/services/unitDirectorService";
import MessageService from "@/services/messageService";
import NotificationService from "@/services/notificationService";
import ActivityDetailModal from "./ActivityDetailModal";
import NotificationDropdown from "./NotificationDropdown";

/**
 * Unit Director Search Bar Component
 * Search bar with dropdown results that opens modal on click
 * Also includes navigation pages, notifications, and messages
 */
export default function UnitDirectorSearchBar({ basePath }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState(null);
  const [showNotificationDropdown, setShowNotificationDropdown] =
    useState(false);
  const searchRef = useRef(null);
  const notificationDropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Define searchable pages
  const pages = [
    { name: "Overview", path: `${basePath}/dashboard`, icon: DashboardIcon },
    { name: "Calendar", path: `${basePath}/calendar`, icon: ProjectsIcon },
    { name: "Reports", path: `${basePath}/reports`, icon: ProjectsIcon },
    { name: "Settings", path: `${basePath}/settings`, icon: SettingsIcon },
    { name: "Help", path: `${basePath}/help`, icon: HelpIcon },
  ];

  // Fetch all activities data
  const { data: activitiesData, isLoading: isLoadingActivities } = useQuery({
    queryKey: ["unit-director-activities"],
    queryFn: UnitDirectorService.getAllActivities,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch messages data
  const { data: messagesData, isLoading: isLoadingMessages } = useQuery({
    queryKey: ["messages"],
    queryFn: MessageService.getMessages,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch notifications data
  const { data: notificationsData, isLoading: isLoadingNotifications } =
    useQuery({
      queryKey: ["notifications"],
      queryFn: NotificationService.getNotifications,
      staleTime: 5 * 60 * 1000,
    });

  // Fetch detailed activity data when an activity is selected
  const { data: selectedActivity, isLoading: isLoadingActivity } = useQuery({
    queryKey: ["activity", selectedActivityId],
    queryFn: () => UnitDirectorService.getActivityById(selectedActivityId),
    enabled: !!selectedActivityId,
  });

  // Transform data into activities format
  const activities =
    activitiesData?.activities?.map((activity) => ({
      id: activity.id,
      type: "activity",
      programTitle: activity.program_title || "Program",
      activityName: activity.title || activity.activity_name || "Activity",
      officeName: activity.office_name || activity.office_acronym || "Office",
      image: activity.image_url || "/reports/default.webp",
      status: activity.status,
      startDate: activity.start || activity.start_date,
      endDate: activity.end || activity.end_date,
    })) || [];

  // Transform messages
  const messages =
    messagesData?.messages?.map((msg) => ({
      id: msg.id,
      type: "message",
      name: msg.sender,
      subject: msg.subject,
      preview: msg.preview,
      time: msg.time,
      unread: msg.unread,
    })) || [];

  // Transform notifications
  const notifications =
    notificationsData?.items?.map((notif) => ({
      id: notif.id,
      type: "notification",
      activity: notif.activity,
      office: notif.office || notif.officeAcronym,
      notifType: notif.type,
      logo: notif.logo,
      unread: notif.unread,
      createdAt: notif.createdAt,
    })) || [];

  // Filter all searchable items
  const query = searchQuery.toLowerCase().trim();

  const filteredPages = query
    ? pages.filter((page) => page.name.toLowerCase().includes(query))
    : [];

  const filteredActivities = query
    ? activities.filter(
        (activity) =>
          activity.activityName?.toLowerCase().includes(query) ||
          activity.programTitle?.toLowerCase().includes(query) ||
          activity.officeName?.toLowerCase().includes(query)
      )
    : [];

  const filteredMessages = query
    ? messages.filter(
        (msg) =>
          msg.name?.toLowerCase().includes(query) ||
          msg.subject?.toLowerCase().includes(query) ||
          msg.preview?.toLowerCase().includes(query)
      )
    : [];

  const filteredNotifications = query
    ? notifications.filter(
        (notif) =>
          notif.activity?.toLowerCase().includes(query) ||
          notif.office?.toLowerCase().includes(query) ||
          notif.notifType?.toLowerCase().includes(query)
      )
    : [];

  const hasResults =
    filteredPages.length > 0 ||
    filteredActivities.length > 0 ||
    filteredMessages.length > 0 ||
    filteredNotifications.length > 0;

  const isLoading =
    isLoadingActivities || isLoadingMessages || isLoadingNotifications;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (
        notificationDropdownRef.current &&
        !notificationDropdownRef.current.contains(event.target)
      ) {
        setShowNotificationDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Show dropdown when there's a search query
  useEffect(() => {
    setShowDropdown(searchQuery.trim().length > 0);
  }, [searchQuery]);

  const handleViewActivity = (activityId) => {
    setSelectedActivityId(activityId);
    setShowDropdown(false);
  };

  const handleNavigate = (path) => {
    navigate(path);
    setShowDropdown(false);
    setSearchQuery("");
  };

  const handleCloseModal = () => {
    setSelectedActivityId(null);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setShowDropdown(false);
  };

  const handleNotificationClick = () => {
    setShowDropdown(false);
    setSearchQuery("");
    setShowNotificationDropdown(true);
  };

  return (
    <>
      <div className="relative" ref={searchRef}>
        {/* Search Input */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search activities, pages, messages, notifications..."
          className="w-full h-8 xl:h-9 bg-white text-[#040195] rounded-full pl-9 sm:pl-12 pr-8
           text-xs outline-none border 
           border-transparent focus:border-[#5B6FED] hover:border-[#5B6FED] transition-colors"
        />
        <div className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
          <SearchIcon
            className="text-[#040195]"
            sx={{ fontSize: { xs: 20, sm: 24, xl: 26 } }}
          />
        </div>

        {searchQuery && (
          <button
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#040195] hover:text-[#5B6FED]"
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </button>
        )}

        {/* Dropdown Results */}
        {showDropdown && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
            {isLoading ? (
              <div className="p-4 text-center text-[#040195] text-sm">
                Loading...
              </div>
            ) : hasResults ? (
              <div className="py-2">
                {/* Pages Section */}
                {filteredPages.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase bg-gray-50">
                      Pages
                    </div>
                    {filteredPages.map((page) => {
                      const IconComponent = page.icon;
                      return (
                        <button
                          key={page.path}
                          onClick={() => handleNavigate(page.path)}
                          className="w-full px-4 py-3 hover:bg-gray-50 text-left border-b transition-colors flex items-center gap-3"
                        >
                          <div className="w-8 h-8 flex items-center justify-center">
                            <IconComponent
                              className="text-[#5B6FED]"
                              sx={{ fontSize: 24 }}
                            />
                          </div>
                          <div>
                            <div className="font-semibold text-sm text-[#040195]">
                              {page.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              Navigate to {page.name}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Activities Section */}
                {filteredActivities.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase bg-gray-50">
                      Activities
                    </div>
                    {filteredActivities.map((activity) => (
                      <button
                        key={activity.id}
                        onClick={() => handleViewActivity(activity.id)}
                        className="w-full px-4 py-3 hover:bg-gray-50 text-left border-b transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                            <img
                              src={activity.image}
                              alt={activity.activityName}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/reports/default.webp";
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm text-[#040195] truncate">
                              {activity.activityName}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              <span className="font-medium">
                                {activity.programTitle}
                              </span>
                              {" • "}
                              <span>{activity.officeName}</span>
                            </div>
                            {activity.status && (
                              <div className="mt-1">
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full ${
                                    activity.status.toLowerCase() ===
                                    "completed"
                                      ? "bg-green-100 text-green-700"
                                      : activity.status.toLowerCase() ===
                                          "in progress" ||
                                        activity.status.toLowerCase() ===
                                          "in-progress"
                                      ? "bg-blue-100 text-blue-700"
                                      : "bg-yellow-100 text-yellow-700"
                                  }`}
                                >
                                  {activity.status}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Notifications Section */}
                {filteredNotifications.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase bg-gray-50">
                      Notifications
                    </div>
                    {filteredNotifications.map((notif) => (
                      <button
                        key={notif.id}
                        onClick={handleNotificationClick}
                        className="w-full px-4 py-3 hover:bg-gray-50 text-left border-b transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 flex-shrink-0">
                            <img
                              src={
                                notif.logo ||
                                "/logos/officeLogoTransparent/default.png"
                              }
                              alt={notif.office}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                e.target.src =
                                  "/logos/officeLogoTransparent/default.png";
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <div className="font-semibold text-sm text-[#040195] truncate">
                                {notif.activity}
                              </div>
                              {notif.unread && (
                                <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></span>
                              )}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              {notif.office}
                            </div>
                            {notif.notifType && (
                              <div className="mt-1">
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full font-semibold text-white ${
                                    notif.notifType === "Reminder"
                                      ? "bg-red-500"
                                      : notif.notifType === "Report"
                                      ? "bg-green-500"
                                      : notif.notifType === "Updated"
                                      ? "bg-blue-500"
                                      : "bg-gray-500"
                                  }`}
                                >
                                  {notif.notifType}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Messages Section */}
                {filteredMessages.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase bg-gray-50">
                      Messages
                    </div>
                    {filteredMessages.map((msg) => (
                      <button
                        key={msg.id}
                        onClick={() => handleNavigate(`${basePath}/dashboard`)}
                        className="w-full px-4 py-3 hover:bg-gray-50 text-left border-b last:border-b-0 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-blue-600 font-semibold text-sm">
                              {msg.name?.charAt(0) || "M"}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <div className="font-semibold text-sm text-[#040195] truncate">
                                {msg.subject}
                              </div>
                              {msg.unread && (
                                <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                              )}
                            </div>
                            <div className="text-xs text-gray-600 truncate">
                              From: {msg.name}
                            </div>
                            <div className="text-xs text-gray-500 truncate mt-1">
                              {msg.preview}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500 text-sm">
                No results found for &quot;{searchQuery}&quot;
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedActivityId && selectedActivity && !isLoadingActivity && (
        <ActivityDetailModal
          activity={selectedActivity}
          onClose={handleCloseModal}
          officeColor="#4D49FC"
          basePath={basePath}
        />
      )}

      {/* Notification Dropdown */}
      {showNotificationDropdown && (
        <div
          ref={notificationDropdownRef}
          className="fixed top-20 right-8 z-50"
        >
          <NotificationDropdown />
        </div>
      )}
    </>
  );
}
