// Imports
import { useState, useEffect } from "react";
import {
  Search as SearchIcon,
  Email as EmailIcon,
} from "@mui/icons-material";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import NavbarService from "@/services/navbarService";
import Sidebar from "@/components/Sidebar";
import NotificationDropdown from "@/components/NotificationDropdown";
import FlagshipUpdateCard from "./FlagshipUpdateCard";
import UpcomingActivitiesCard from "./UpcomingActivitiesCard";
import BudgetCard from "./BudgetCard";
import StatsCards from "./StatsCards";

// Dashboard
export default function UnitDirectorDashboard() {
  // Auth
  const { user } = useAuth();
  // State
  const [messagesCount, setMessagesCount] = useState(0);
  const [, setTimeUpdate] = useState(0); // Force re-render for time updates

  // Query client for mutations
  const queryClient = useQueryClient();

  // Handle marking notification as read
  const handleNotificationClick = async (notificationId) => {
    try {
      // Invalidate the notifications query to trigger a refetch in the dropdown
      queryClient.invalidateQueries(["notifications"]);
      console.log("Notification clicked:", notificationId);
    } catch (error) {
      console.error("Error handling notification click:", error);
    }
  };

  // Dashboard data - using hardcoded budget for now (will be updated later)
  const [dashboardData] = useState({
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

  // Update time display every minute without refetching
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeUpdate(prev => prev + 1);
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);



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
                <NotificationDropdown onNotificationClick={handleNotificationClick} />

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
                  <FlagshipUpdateCard />
                </div>

                {/* Upcoming */}
                <div className="lg:col-span-4 flex flex-col min-h-0 gap-2 xl:gap-3">
                  {/* Activities */}
                  <div className="flex flex-col min-h-[250px] sm:min-h-[300px] lg:flex-1">
                    <UpcomingActivitiesCard />
                  </div>

                  {/* Budget */}
                  <div className="flex flex-col min-h-[200px] sm:min-h-[220px] lg:min-h-0 lg:flex-1">
                    <BudgetCard budgetData={dashboardData.budget} />
                  </div>
                </div>

                {/* Stats */}
                <div className="lg:col-span-3 flex flex-col min-h-0 gap-2 xl:gap-3 lg:gap-0">
                  <StatsCards />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
