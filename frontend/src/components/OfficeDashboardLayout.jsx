import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@tanstack/react-query';
import { 
  Search as SearchIcon,
  Email as EmailIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { useAuth } from '@/context/AuthContext';
import OfficeService from '@/services/officeService';
import OfficeSidebar from '@/components/OfficeSidebar';
import UpcomingProgramsList from '@/components/UpcomingProgramsList';

/**
 * Reusable Office Dashboard Layout
 * Provides consistent layout structure for all office dashboards
 */
export default function OfficeDashboardLayout({ 
  officeColor, 
  basePath,
  officeId,
  children 
}) {
  const { user } = useAuth();
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [messagesCount, setMessagesCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationFilter, setNotificationFilter] = useState('all');
  const notificationRef = useRef(null);

  // Fetch office dashboard data using React Query
  const { data: dashboardData, isLoading: dashboardLoading } = useQuery({
    queryKey: ['office-dashboard', officeId],
    queryFn: () => OfficeService.getOfficeDashboard(officeId),
    enabled: !!officeId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Mock notifications
  const allNotifications = [
    { 
      id: 1, 
      office: 'Office', 
      activity: 'Sample Activity', 
      type: 'Reminder',
      dueDate: 'Oct 20, 2025',
      time: '1m',
      unread: true,
      logo: '/images/acca_logo_small.webp'
    },
  ];

  const notifications = notificationFilter === 'unread' 
    ? allNotifications.filter(n => n.unread)
    : allNotifications;

  // Navbar fetch
  useEffect(() => {
    const fetchNavbarData = async () => {
      try {
        // TODO: Implement office-specific notifications and messages endpoints
        // For now, using mock data to avoid calling unit-director endpoints
        setNotificationsCount(0);
        setMessagesCount(0);
      } catch (error) {
        console.error('Error fetching navbar data:', error);
      }
    };

    fetchNavbarData();
  }, []);

  // Dropdown close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  // Date logic
  const currentDate = new Date();
  const day = currentDate.getDate().toString().padStart(2, '0');
  const month = currentDate.toLocaleDateString('en-US', { month: 'long' }).toUpperCase();
  const weekday = currentDate.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();

  return (
    <div className="flex bg-[#EAE9E9] min-h-screen max-h-screen p-2 sm:p-4 xl:p-[35px] overflow-hidden">
      {/* Container */}
      <div className="bg-white rounded-[20px] flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <OfficeSidebar 
          officeColor={officeColor}
          basePath={basePath}
          officeId={officeId}
          officeName={dashboardData?.office?.name}
        />

        {/* Main */}
        <main className="flex-grow pt-2 sm:pt-4 xl:pt-4 pb-2 sm:pb-6 xl:pb-4 p-1 sm:p-2 flex flex-col overflow-hidden">
          {/* XL Container */}
          <div className="h-full flex flex-col max-w-[1536px] w-full mx-auto">
            {/* Header/Navbar */}
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
                  <SearchIcon className="text-[#040195]" sx={{ fontSize: { xs: 20, sm: 24, xl: 26 } }} />
                </div>
              </div>

              {/* Icons */}
              <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
                {/* Email */}
                <button className="w-7 h-7 sm:w-8 sm:h-8 xl:w-9 xl:h-9 flex items-center justify-center bg-white hover:bg-[#E8EAFF] rounded-full transition-colors relative">
                  <EmailIcon className="text-[#5B6FED]" sx={{ fontSize: { xs: 16, sm: 18, xl: 19 } }} />
                  {messagesCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-semibold text-[9px] xl:text-[10px]">
                      {messagesCount > 9 ? '9+' : messagesCount}
                    </span>
                  )}
                </button>

                {/* Notifications */}
                <div className="relative font-inter" ref={notificationRef}>
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="w-7 h-7 sm:w-8 sm:h-8 xl:w-9 xl:h-9 hover:cursor-pointer flex items-center justify-center bg-white hover:bg-[#E8EAFF] rounded-full transition-colors relative"
                  >
                    <NotificationsIcon className="text-[#5B6FED]" sx={{ fontSize: { xs: 16, sm: 18, xl: 19 } }} />
                    {notificationsCount > 0 && (
                      <span className="absolute bottom-0 right-0 z-50 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-semibold text-[9px] xl:text-[10px] shadow-md border-2 border-white pointer-events-none">
                        {notificationsCount > 9 ? '9+' : notificationsCount}
                      </span>
                    )}
                  </button>

                  {/* Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-2xl shadow-2xl z-50 border border-gray-100">
                      {/* Title */}
                      <div className="px-5 py-4 border-b border-gray-100">
                        <h3 className="text-xl font-bold text-[#040195] mb-3">Notifications</h3>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setNotificationFilter('all')}
                            className={`px-4 py-1.5 rounded-full hover:cursor-pointer text-xs font-semibold transition-colors ${
                              notificationFilter === 'all'
                                ? 'bg-[#CDCCFF] text-[#040195]'
                                : 'text-[#040195] bg-[#F4F4FF] hover:bg-[#E6E6FF]'
                            }`}
                          >
                            All
                          </button>
                          <button
                            onClick={() => setNotificationFilter('unread')}
                            className={`px-4 py-1.5 hover:cursor-pointer rounded-full text-xs font-semibold transition-colors ${
                              notificationFilter === 'unread'
                                ? 'bg-[#E8E7FF] text-[#040195]'
                                : 'text-[#040195] bg-[#F4F4FF] hover:bg-[#E6E6FF]'
                            }`}
                          >
                            Unread
                          </button>
                        </div>
                      </div>

                      {/* List */}
                      <div className="max-h-[500px] overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className="px-5 py-4 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-b-0"
                            >
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 mt-1">
                                  <img 
                                    src={notification.logo} 
                                    alt={notification.office}
                                    className="w-10 h-10 object-contain"
                                  />
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1">
                                      <p className="text-xs font-bold text-gray-500 mb-0.5">{notification.office}</p>
                                      <p className="text-sm font-black text-[#4D49FC] mb-1">{notification.activity}</p>
                                      <p className="text-xs text-gray-400">
                                        {notification.type === 'Reminder' ? (
                                          <>
                                            Due: <span style={{ color: '#4D49FC' }}>{notification.dueDate}</span>
                                          </>
                                        ) : (
                                          <>
                                            Submitted: <span style={{ color: '#4D49FC' }}>{notification.submittedDate}</span>
                                          </>
                                        )}
                                      </p>
                                    </div>
                                    <div className="flex items-end gap-2 justify-center min-w-[70px]">
                                      <span className={`px-3 p-1 rounded-full text-[12px] font-semibold bg-[#8988CD] text-[#ffffff]`}>
                                        {notification.type}
                                      </span>
                                      <div className="flex flex-col items-center ml-1">
                                        <span className={`w-2.5 h-2.5 rounded-full mb-0.5 ${
                                          notification.unread ? 'bg-red-500' : 'bg-green-500'
                                        }`}></span>
                                        <span className="text-[10px] text-gray-400">{notification.time}</span>
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
                    </div>
                  )}
                </div>

                {/* Avatar */}
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 xl:w-9 xl:h-9 rounded-full bg-white text-[#5B6FED] flex items-center justify-center font-medium text-xs sm:text-sm xl:text-base">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-xs xl:text-sm font-semibold text-[rgba(0,0,0,0.87)]">
                      {user?.name || 'Office User'}
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
              {/* Date badges */}
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

              {/* Content Section */}
              {children || (
                <div className="flex-1 flex gap-3 min-h-0 overflow-hidden">
                  {dashboardLoading ? (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 border-4 border-[#040195] border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-sm text-gray-500">Loading dashboard...</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Left Section - Upcoming Programs */}
                      <UpcomingProgramsList 
                        upcomingPrograms={dashboardData?.upcomingPrograms}
                      />

                      {/* Right Section - Stats and Timeline */}
                      <div className="flex-[3] min-w-0 flex flex-col gap-3">
                        {/* Top Row - Stats Cards */}
                        <div className="grid grid-cols-3 gap-3">
                          {/* Completed Card */}
                          <div className="bg-[#1E0A7A] rounded-[20px] p-4 shadow-md flex flex-col relative overflow-hidden">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-white text-lg font-semibold">Completed</h3>
                            </div>
                            <div className="flex-1 flex items-center">
                              <h2 className="text-white text-5xl font-bold">{dashboardData?.statistics?.completed_programs || 10}</h2>
                            </div>
                            <div className="mt-2">
                              <span className="text-white/70 text-[0.65rem]">Increased from last month</span>
                            </div>
                          </div>

                          {/* In Progress Card */}
                          <div className="bg-[#8B7AB8] rounded-[20px] p-4 shadow-md flex flex-col relative overflow-hidden">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-white text-lg font-semibold">In Progress</h3>
                            </div>
                            <div className="flex-1 flex items-center">
                              <h2 className="text-white text-5xl font-bold">{dashboardData?.statistics?.ongoing_programs || 25}</h2>
                            </div>
                            <div className="mt-2">
                              <span className="text-white/70 text-[0.65rem]">Increased from last month</span>
                            </div>
                          </div>

                          {/* Pending Card */}
                          <div className="bg-white rounded-[20px] p-4 shadow-md border border-gray-200 flex flex-col relative overflow-hidden">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-[#1E0A7A] text-lg font-semibold">Pending</h3>
                            </div>
                            <div className="flex-1 flex items-center">
                              <h2 className="text-[#5B6FED] text-5xl font-bold">{dashboardData?.statistics?.pending_programs || 3}</h2>
                            </div>
                            <p className="text-gray-500 text-xs mt-2">On Discuss</p>
                          </div>
                        </div>

                        {/* Bottom Row - Timeline Section */}
                        <div className="flex-1 bg-white rounded-[20px] p-5 shadow-md border border-gray-200 overflow-hidden flex flex-col">
                          <h3 className="text-[#1E0A7A] text-2xl font-bold mb-4">Timeline</h3>
                          <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {/* Timeline content will go here */}
                            <div className="text-gray-400 text-sm text-center py-8">
                              Timeline view coming soon
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
  officeId: PropTypes.string.isRequired,
  children: PropTypes.node,
};
