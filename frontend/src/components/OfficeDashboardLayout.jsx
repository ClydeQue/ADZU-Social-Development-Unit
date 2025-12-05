import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import OfficeService from "@/services/officeService";
import OfficeSidebar from "@/components/OfficeSidebar";
import UpcomingProgramsList from "@/components/UpcomingProgramsList";
import InboxDropdown from "@/components/InboxDropdown";
import NotificationDropdown from "@/components/NotificationDropdown";
import OfficeSearchBar from "@/components/OfficeSearchBar";
import DashboardSkeleton from "@/components/DashboardSkeleton";

/**
 * Reusable Office Dashboard Layout
 * Provides consistent layout structure for all office dashboards
 */
export default function OfficeDashboardLayout({
  officeColor,
  basePath,
  officeId,
  children,
}) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationFilter, setNotificationFilter] = useState("all");
  const notificationRef = useRef(null);

  // Fetch office dashboard data using React Query
  const { data: dashboardData, isLoading: dashboardLoading } = useQuery({
    queryKey: ["office-dashboard", officeId],
    queryFn: () => OfficeService.getOfficeDashboard(officeId),
    enabled: !!officeId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Navigate to projects with filter
  const handleNavigateToReports = (status) => {
    navigate(`${basePath}/projects?sort=${status}`);
  };

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

  return (
    <div className="flex bg-[#EAE9E9] min-h-screen md:max-h-screen p-2 sm:p-4 xl:p-[35px] md:overflow-hidden">
      {/* Container */}
      <div className="bg-white rounded-[20px] flex flex-1 md:overflow-hidden">
        {/* Sidebar */}
        <OfficeSidebar
          officeColor={officeColor}
          basePath={basePath}
          officeId={officeId}
          officeAcronym={user?.office?.acronym || dashboardData?.office?.acronym}
          officeName={dashboardData?.office?.name}
        />

        {/* Main */}
        <main className="flex-grow pt-2 sm:pt-4 xl:pt-4 pb-16 md:pb-2 sm:md:pb-6 xl:md:pb-4 p-1 sm:p-2 flex flex-col md:overflow-hidden">
          {/* XL Container */}
          <div className="h-full flex flex-col max-w-[1536px] w-full mx-auto">
            {/* Header/Navbar */}
            <div className="bg-[#F4F4F4] rounded-[15px] p-2 mb-2 xl:mb-3 mx-2 sm:mx-3 xl:mx-4 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2 sm:gap-0 flex-shrink-0">
              {/* Search */}
              <div className="relative ml-0 sm:ml-2 xl:ml-3 w-full sm:w-[400px] xl:w-[450px]">
                <OfficeSearchBar
                  basePath={basePath}
                  officeColor={officeColor}
                />
              </div>

              {/* Icons */}
              <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
                {/* Inbox */}
                <InboxDropdown />

                {/* Notifications */}
                <NotificationDropdown />

                {/* Avatar */}
                <div className="flex items-center gap-2">
                  <img
                    src={
                      user?.office?.acronym
                        ? `/images/${user.office.acronym.toLowerCase()}_logo_small.webp`
                        : "/images/default_logo.webp"
                    }
                    alt={user?.office?.acronym || "Office"}
                    className="w-7 h-7 sm:w-8 sm:h-8 xl:w-9 xl:h-9 object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/default_logo.webp";
                    }}
                  />
                  <div className="hidden sm:block">
                    <div className="text-xs xl:text-sm font-semibold text-[rgba(0,0,0,0.87)]">
                      {user?.name || "Office User"}
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
              {/* Date badges - only show on dashboard */}
              {!children && (
                <div className="flex justify-end items-center mb-2 xl:mb-3 flex-shrink-0">
                  <div className="flex gap-1.5 xl:gap-2 flex-wrap">
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
              )}

              {/* Content Section */}
              {children || (
                <div className="flex-1 flex flex-col lg:flex-row gap-3 md:min-h-0 md:overflow-hidden overflow-y-auto pb-2">
                  {dashboardLoading ? (
                    <DashboardSkeleton />
                  ) : (
                    <>
                      {/* Left Section - Upcoming Programs */}
                      <UpcomingProgramsList
                        upcomingPrograms={dashboardData?.upcomingPrograms}
                      />

                      {/* Right Section - Stats and Timeline */}
                      <div className="flex-[3] min-w-0 flex flex-col gap-3">
                        {/* Section Header - Status Cards */}
                        <div className="flex items-center gap-2">
                          <h3 className="text-[#1E0A7A] text-sm font-semibold">Activity Status</h3>
                          <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Unit Director</span>
                        </div>
                        
                        {/* Top Row - Stats Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {/* Completed Card */}
                          <div 
                            className="bg-[#1E0A7A] rounded-[20px] p-4 shadow-md flex flex-col relative overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => handleNavigateToReports("completed")}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-white text-lg font-semibold">
                                Completed
                              </h3>
                            </div>
                            <div className="flex-1 flex items-center">
                              <h2 className="text-white text-5xl font-bold">
                                {dashboardData?.statistics?.completed || 0}
                              </h2>
                            </div>
                            <div className="mt-2">
                              <span className="text-white/70 text-[0.65rem]">
                                Approved by Unit Director
                              </span>
                            </div>
                          </div>

                          {/* In Progress Card */}
                          <div 
                            className="bg-[#8B7AB8] rounded-[20px] p-4 shadow-md flex flex-col relative overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => handleNavigateToReports("in-progress")}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-white text-lg font-semibold">
                                In Progress
                              </h3>
                            </div>
                            <div className="flex-1 flex items-center">
                              <h2 className="text-white text-5xl font-bold">
                                {dashboardData?.statistics?.in_progress || 0}
                              </h2>
                            </div>
                            <div className="mt-2">
                              <span className="text-white/70 text-[0.65rem]">
                                Being reviewed
                              </span>
                            </div>
                          </div>

                          {/* Pending Card */}
                          <div 
                            className="bg-white rounded-[20px] p-4 shadow-md border border-gray-200 flex flex-col relative overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => handleNavigateToReports("pending")}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-[#1E0A7A] text-lg font-semibold">
                                Pending
                              </h3>
                            </div>
                            <div className="flex-1 flex items-center">
                              <h2 className="text-[#5B6FED] text-5xl font-bold">
                                {dashboardData?.statistics?.pending || 0}
                              </h2>
                            </div>
                            <p className="text-gray-500 text-xs mt-2">
                              Awaiting approval
                            </p>
                          </div>
                        </div>

                        {/* Bottom Row - Phase Distribution Chart (Full Width) */}
                        <div className="flex-1 bg-white rounded-[20px] p-5 shadow-md border border-gray-200 overflow-hidden flex flex-col min-h-0">
                          <h3 className="text-[#1E0A7A] text-xl font-bold mb-4">
                            Activity Phases
                          </h3>
                          <div className="flex-1 flex flex-col justify-center gap-2">
                            {(() => {
                              const phases = [
                                { key: 'planning', label: 'Planning', color: '#6366F1' },
                                { key: 'implementation', label: 'Implementation', color: '#8B5CF6' },
                                { key: 'in_progress', label: 'In Progress', color: '#F59E0B' },
                                { key: 'completed', label: 'Completed', color: '#10B981' },
                                { key: 'cancelled', label: 'Cancelled', color: '#EF4444' },
                              ];
                              const total = phases.reduce((sum, p) => sum + (dashboardData?.phaseDistribution?.[p.key] || 0), 0);
                              
                              return phases.map((phase) => {
                                const value = dashboardData?.phaseDistribution?.[phase.key] || 0;
                                const percentage = Math.max((value / Math.max(total, 1)) * 100, value > 0 ? 12 : 0);
                                
                                return (
                                  <div key={phase.key} className="flex items-center gap-2">
                                    <span className="text-xs text-gray-600 w-24 truncate">{phase.label}</span>
                                    <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                                      <div 
                                        className="h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                                        style={{ 
                                          width: `${percentage}%`,
                                          backgroundColor: phase.color
                                        }}
                                      >
                                        {value > 0 && (
                                          <span className="text-[10px] text-white font-semibold">{value}</span>
                                        )}
                                      </div>
                                    </div>
                                    <span className="text-xs text-gray-400 w-6 text-right">{value}</span>
                                  </div>
                                );
                              });
                            })()}

                            {/* Total count */}
                            <div className="mt-2 pt-2 border-t border-gray-100">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Total Activities</span>
                                <span className="font-semibold text-[#040195]">
                                  {(dashboardData?.phaseDistribution?.planning || 0) + 
                                   (dashboardData?.phaseDistribution?.implementation || 0) +
                                   (dashboardData?.phaseDistribution?.in_progress || 0) + 
                                   (dashboardData?.phaseDistribution?.completed || 0) + 
                                   (dashboardData?.phaseDistribution?.cancelled || 0)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

OfficeDashboardLayout.propTypes = {
  officeColor: PropTypes.string,
  basePath: PropTypes.string.isRequired,
  officeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  children: PropTypes.node,
};
