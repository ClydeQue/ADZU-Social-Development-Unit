// Imports
import { useState, useEffect, useRef } from "react";
import {
  Search as SearchIcon,
  Email as EmailIcon,
  Notifications as NotificationsIcon,
  MailOutline as MailOutlineIcon,
} from "@mui/icons-material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import NavbarService from "@/services/navbarService";
import NotificationService from "@/services/notificationService";
import Sidebar from "@/components/Sidebar";
import FlagshipUpdateCard from "./FlagshipUpdateCard";
import UpcomingActivitiesCard from "./UpcomingActivitiesCard";
import BudgetCard from "./BudgetCard";
import StatsCards from "./StatsCards";

// Dashboard
export default function UnitDirectorDashboard() {
  // Auth
  const { user } = useAuth();
  // State
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [messagesCount, setMessagesCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationFilter, setNotificationFilter] = useState("all"); // 'all' or 'unread'
  const notificationRef = useRef(null);

  // Query client for mutations
  const queryClient = useQueryClient();

  // Notifications Query
  const {
    data: notificationsData,
    isLoading: notificationsLoading,
    error: notificationsError,
    refetch: refetchNotifications,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: NotificationService.getNotifications,
    select: (data) => data || { items: [], unread: 0 }, // Transform undefined to default data
    refetchInterval: 30000, // Refetch every 30 seconds
    onSuccess: (data) => {
      console.log("Notifications data received:", data);
      setNotificationsCount(data?.unread || 0);
    },
    onError: (error) => {
      console.error("Error in notifications query:", error);
    },
    retry: 2,
  });

  // Handle marking notification as read
  const handleNotificationClick = async (notificationId) => {
    try {
      await NotificationService.markAsRead(notificationId);
      // Invalidate the notifications query to trigger a refetch
      queryClient.invalidateQueries(["notifications"]);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Filter notifications
  const notifications = (notificationsData?.items || []).filter((n) =>
    notificationFilter === "unread" ? n.unread : true
  );

  // Dashboard data
  const [dashboardData] = useState({
    // Hardcoded data for now muna
    completed: { count: 10, trend: "up", change: "Increased from last month" },
    inProgress: { count: 25, trend: "up", change: "Increased from last month" },
    pending: { count: 3, status: "On Discuss" },
    flagshipUpdate: {
      percentage: 85,
      completed: 85,
      inProgress: 10,
      pending: 5,
    },
    upcoming: [
      {
        office: "ACCA",
        activity: "ARTEJOS",
        due: "Oct 5, 2025",
        logo: "/images/acca_logo_small.webp",
      },
      {
        office: "ACES",
        activity: "Inigo Tree Planting",
        due: "Oct 6, 2025",
        logo: "/images/aces_logo_small.webp",
      },
      {
        office: "ALTEC",
        activity: "SUGPAT Program",
        due: "Oct 7, 2025",
        logo: "/images/altec_logo_small.webp",
      },
    ],
    budget: {
      total: 1000000,
      allocated: 750000,
      remaining: 250000,
    },
  });

  // Messages fetch
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const messagesData = await NavbarService.getMessages();
        setMessagesCount(messagesData.unread || 0);
      } catch (error) {
        console.error("Error fetching messages:", error);
        // Fail silently, keep count at 0
      }
    };

    fetchMessages();
  }, []);

  // Dropdown close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  // Date logic
  const currentDate = new Date();
  const day = currentDate.getDate().toString().padStart(2, "0");
  const month = currentDate
    .toLocaleDateString("en-US", { month: "long" })
    .toUpperCase();
  const weekday = currentDate
    .toLocaleDateString("en-US", { weekday: "long" })
    .toUpperCase();

  // Render
  return (
    <div className="flex bg-[#EAE9E9] min-h-screen max-h-screen p-2 sm:p-4 xl:p-[35px] overflow-hidden">
      {/* Container */}
      <div className="bg-white rounded-[20px] flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main */}
        <main className="flex-grow pt-2 sm:pt-4 xl:pt-4 pb-2 sm:pb-6 xl:pb-4 p-1 sm:p-2 flex flex-col overflow-hidden">
          {/* XL Container */}
          <div className="h-full flex flex-col max-w-[1536px] w-full mx-auto">
            {/* Header */}
            <div className="bg-[#F4F4F4] rounded-[15px] p-2 mb-2 xl:mb-3 mx-2 sm:mx-3 xl:mx-4 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2 sm:gap-0 flex-shrink-0">
              {/* Search */}
              <div className="relative ml-0 sm:ml-2 xl:ml-3 w-full sm:w-[400px] xl:w-[450px]">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full h-8 xl:h-9 bg-white text-[#040195] rounded-full pl-9 sm:pl-12
                   text-xs outline-none border 
                   border-transparent focus:border-[#5B6FED] hover:border-[#5B6FED] transition-colors"
                />
                <div className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                  <SearchIcon
                    className="text-[#040195]"
                    sx={{ fontSize: { xs: 20, sm: 24, xl: 26 } }}
                  />
                </div>
              </div>

              {/* Icons */}
              <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
                {/* Test Button */}
                <button
                  onClick={async () => {
                    try {
                      const response =
                        await NotificationService.testNotifications();
                      console.log("Test response:", response);
                    } catch (error) {
                      console.error("Test error:", error);
                    }
                  }}
                  className="px-3 py-1 bg-[#5B6FED] hover:bg-[#4D49FC] text-white text-xs rounded-full transition-colors"
                >
                  Test
                </button>

                {/* Email */}
                <button className="w-7 h-7 sm:w-8 sm:h-8 xl:w-9 xl:h-9 flex items-center justify-center bg-white hover:bg-[#E8EAFF] rounded-full transition-colors relative">
                  <EmailIcon
                    className="text-[#5B6FED]"
                    sx={{ fontSize: { xs: 16, sm: 18, xl: 19 } }}
                  />
                  {messagesCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-semibold text-[9px] xl:text-[10px]">
                      {messagesCount > 9 ? "9+" : messagesCount}
                    </span>
                  )}
                </button>

                {/* Notifications */}
                <div className="relative font-inter" ref={notificationRef}>
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="w-7 h-7 sm:w-8 sm:h-8 xl:w-9 xl:h-9  hover:cursor-pointer flex items-center justify-center bg-white hover:bg-[#E8EAFF] rounded-full transition-colors relative"
                  >
                    <NotificationsIcon
                      className="text-[#5B6FED]"
                      sx={{ fontSize: { xs: 16, sm: 18, xl: 19 } }}
                    />
                    {notificationsCount > 0 && (
                      <span className="absolute bottom-0 right-0 z-50 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-semibold text-[9px] xl:text-[10px] shadow-md border-2 border-white pointer-events-none">
                        {notificationsCount > 9 ? "9+" : notificationsCount}
                      </span>
                    )}
                  </button>

                  {/* Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-2xl shadow-2xl z-50 border border-gray-100">
                      {/* Title */}
                      <div className="px-5 py-4 border-b border-gray-100">
                        <h3 className="text-xl font-bold text-[#040195] mb-3">
                          Notifications
                        </h3>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setNotificationFilter("all")}
                            className={`px-4 py-1.5 rounded-full hover:cursor-pointer text-xs font-semibold transition-colors ${
                              notificationFilter === "all"
                                ? "bg-[#CDCCFF] text-[#040195]"
                                : "text-[#040195]  bg-[#F4F4FF] hover:bg-[#E6E6FF]"
                            }`}
                          >
                            All
                          </button>
                          <button
                            onClick={() => setNotificationFilter("unread")}
                            className={`px-4 py-1.5 hover:cursor-pointer rounded-full text-xs font-semibold transition-colors ${
                              notificationFilter === "unread"
                                ? "bg-[#E8E7FF] text-[#040195]"
                                : "text-[#040195] bg-[#F4F4FF] hover:bg-[#E6E6FF]"
                            }`}
                          >
                            Unread
                          </button>
                        </div>
                      </div>

                      {/* List */}
                      <div className="max-h-[500px] overflow-y-auto">
                        {notificationsLoading ? (
                          <div className="px-5 py-8 text-center text-sm text-gray-400">
                            Loading notifications...
                          </div>
                        ) : notificationsError ? (
                          <div className="px-5 py-8 text-center">
                            <p className="text-sm text-red-500 mb-2">
                              Error loading notifications
                            </p>
                            <button
                              onClick={() => refetchNotifications()}
                              className="text-xs text-[#040195] hover:text-[#4D49FC] transition-colors"
                            >
                              Try again
                            </button>
                          </div>
                        ) : notifications.length > 0 ? (
                          notifications.map((notification) => (
                            <div
                              key={notification.id}
                              onClick={() =>
                                handleNotificationClick(notification.id)
                              }
                              className="px-5 py-4 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-b-0"
                            >
                              <div className="flex items-start gap-3">
                                {/* Logo */}
                                <div className="flex-shrink-0 mt-1">
                                  <img
                                    src={notification.logo}
                                    alt={notification.office}
                                    className="w-10 h-10 object-contain"
                                  />
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1">
                                      <p className="text-xs font-bold text-gray-500 mb-0.5">
                                        {notification.office}
                                      </p>
                                      <p className="text-sm font-black text-[#4D49FC] mb-1">
                                        {notification.activity}
                                      </p>
                                      <p className="text-xs text-gray-400">
                                        {notification.type === "Reminder" ? (
                                          <>
                                            Due:{" "}
                                            <span style={{ color: "#4D49FC" }}>
                                              {notification.dueDate}
                                            </span>
                                          </>
                                        ) : (
                                          <>
                                            Submitted:{" "}
                                            <span style={{ color: "#4D49FC" }}>
                                              {notification.submittedDate}
                                            </span>
                                          </>
                                        )}
                                      </p>
                                    </div>
                                    {/* Badge */}
                                    <div className="flex items-end gap-2 justify-center min-w-[70px]">
                                      <span
                                        className={`px-3 p-1 rounded-full text-[12px] font-semibold bg-[#8988CD] text-[#ffffff]`}
                                      >
                                        {notification.type}
                                      </span>
                                      <div className="flex flex-col items-center ml-1">
                                        <span
                                          className={`w-2.5 h-2.5 rounded-full mb-0.5 ${
                                            notification.unread
                                              ? "bg-red-500"
                                              : "bg-green-500"
                                          }`}
                                        ></span>
                                        <span className="text-[10px] text-gray-400">
                                          {notification.time}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="px-5 py-8 text-center text-sm text-gray-400">
                            No notifications
                          </div>
                        )}
                      </div>
                      {notificationsError && (
                        <div className="px-5 py-3 border-t border-gray-100">
                          <button
                            onClick={() => refetchNotifications()}
                            className="w-full text-center text-sm text-[#040195] hover:text-[#4D49FC] transition-colors"
                          >
                            Retry loading notifications
                          </button>
                        </div>
                      )}
                      {notifications.length > 5 && (
                        <div className="px-5 py-3 border-t border-gray-100">
                          <button
                            onClick={() => {
                              /* TODO: Implement view all notifications */
                            }}
                            className="w-full text-center text-sm text-[#040195] hover:text-[#4D49FC] transition-colors"
                          >
                            View All Notifications
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Avatar */}
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 xl:w-9 xl:h-9 rounded-full bg-white text-[#5B6FED] flex items-center justify-center font-medium text-xs sm:text-sm xl:text-base">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-xs xl:text-sm font-semibold text-[rgba(0,0,0,0.87)]">
                      {user?.name || "Unit Director"}
                    </div>
                    <div className="text-[10px] xl:text-xs text-[rgba(0,0,0,0.6)]">
                      {user?.email}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="bg-[#F4F4F4] rounded-[15px] p-2 sm:p-3 xl:p-4 mx-2 sm:mx-3 xl:mx-4 flex-1 overflow-hidden flex flex-col min-h-0">
              {/* Title */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 xl:mb-3 flex-shrink-0 gap-2 sm:gap-0">
                <h5 className="text-lg sm:text-xl xl:text-2xl font-bold leading-[1.2] text-[#040195]">
                  Overview
                </h5>
                <div className="flex gap-1.5 xl:gap-2 flex-wrap">
                  {/* outline stylesd */}
                  <span className="inline-flex items-center justify-center h-5 xl:h-6 px-2 xl:px-2.5 text-[0.65rem] xl:text-[0.7rem] border border-[#040195] text-[#040195] rounded-full">
                    {day}
                  </span>
                  <span className="inline-flex items-center justify-center h-5 xl:h-6 px-2 xl:px-2.5 text-[0.65rem] xl:text-[0.7rem] border border-[#040195] text-[#040195] rounded-full">
                    {month}
                  </span>
                  <span className="inline-flex items-center justify-center h-5 xl:h-6 px-2 xl:px-2.5 text-[0.65rem] xl:text-[0.7rem] border border-[#040195] text-[#040195] rounded-full">
                    {weekday}
                  </span>
                </div>
              </div>

              {/* Grid */}
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-2 xl:gap-3 min-h-0 overflow-hidden">
                {/* Flagship */}
                <div className="lg:col-span-5 flex flex-col min-h-[300px] sm:min-h-[350px] lg:min-h-0">
                  <FlagshipUpdateCard
                    flagshipData={dashboardData.flagshipUpdate}
                  />
                </div>

                {/* Upcoming */}
                <div className="lg:col-span-4 flex flex-col min-h-0 gap-2 xl:gap-3">
                  {/* Activities */}
                  <div className="flex flex-col min-h-[250px] sm:min-h-[300px] lg:flex-1">
                    <UpcomingActivitiesCard
                      upcomingData={dashboardData.upcoming}
                    />
                  </div>

                  {/* Budget */}
                  <div className="flex flex-col min-h-[200px] sm:min-h-[220px] lg:min-h-0 lg:flex-1">
                    <BudgetCard budgetData={dashboardData.budget} />
                  </div>
                </div>

                {/* Stats */}
                <div className="lg:col-span-3 flex flex-col min-h-0 gap-2 xl:gap-3 lg:gap-0">
                  <StatsCards
                    completed={dashboardData.completed}
                    inProgress={dashboardData.inProgress}
                    pending={dashboardData.pending}
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
