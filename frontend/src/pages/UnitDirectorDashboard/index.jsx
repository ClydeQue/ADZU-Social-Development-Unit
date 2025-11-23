// Imports
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";
import NotificationDropdown from "@/components/NotificationDropdown";
import InboxDropdown from "@/components/InboxDropdown";
import UnitDirectorSearchBar from "@/components/UnitDirectorSearchBar";
import FlagshipUpdateCard from "./FlagshipUpdateCard";
import UpcomingActivitiesCard from "./UpcomingActivitiesCard";
import BudgetCard from "./BudgetCard";
import StatsCards from "./StatsCards";

// Dashboard
export default function UnitDirectorDashboard() {
  // Auth
  const { user } = useAuth();

  // State
  const [, setTimeUpdate] = useState(0); // Force re-render for time updates

  // Query client for mutations
  const queryClient = useQueryClient(); // Handle marking notification as read
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

  // Update time display every minute without refetching
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeUpdate((prev) => prev + 1);
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
    <div className="flex bg-[#EAE9E9] min-h-screen md:max-h-screen p-2 sm:p-4 xl:p-[35px] md:overflow-hidden">
      {/* Container */}
      <div className="bg-white rounded-[20px] flex flex-1 md:overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main */}
        <main className="flex-grow pt-2 sm:pt-4 xl:pt-4 pb-16 md:pb-2 sm:md:pb-6 xl:md:pb-4 p-1 sm:p-2 flex flex-col md:overflow-hidden">
          {/* XL Container */}
          <div className="h-full flex flex-col max-w-[1536px] w-full mx-auto">
            {/* Header */}
            <div className="bg-[#F4F4F4] rounded-[15px] p-2 mb-2 xl:mb-3 mx-2 sm:mx-3 xl:mx-4 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2 sm:gap-0 flex-shrink-0">
              {/* Search */}
              <div className="relative ml-0 sm:ml-2 xl:ml-3 w-full sm:w-[400px] xl:w-[450px]">
                <UnitDirectorSearchBar basePath="/unit-director" />
              </div>

              {/* Icons */}
              <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
                {/* Inbox */}
                <InboxDropdown />

                {/* Notifications */}
                <NotificationDropdown
                  onNotificationClick={handleNotificationClick}
                />

                {/* Avatar */}
                <div className="flex items-center gap-2">
                  <img
                    src="/logos/sdu-logo-colored.webp"
                    alt="Unit Director"
                    className="w-7 h-7 sm:w-8 sm:h-8 xl:w-9 xl:h-9 object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/default_logo.webp";
                    }}
                  />
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
            <div className="bg-[#F4F4F4] rounded-[15px] p-2 sm:p-3 xl:p-4 mx-2 sm:mx-3 xl:mx-4 flex-1 md:overflow-hidden flex flex-col md:min-h-0">
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
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-2 xl:gap-3 md:min-h-0 md:overflow-hidden overflow-y-auto pb-2">
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
