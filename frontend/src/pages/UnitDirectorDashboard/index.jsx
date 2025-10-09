import { useState, useEffect } from 'react';
import { 
  Search as SearchIcon,
  Email as EmailIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { useAuth } from '@/context/AuthContext';
import NavbarService from '@/services/navbarService';
import Sidebar from '@/components/Sidebar';
import FlagshipUpdateCard from './FlagshipUpdateCard';
import UpcomingActivitiesCard from './UpcomingActivitiesCard';
import BudgetCard from './BudgetCard';
import StatsCards from './StatsCards';

export default function UnitDirectorDashboard() {
  const { user } = useAuth();
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [messagesCount, setMessagesCount] = useState(0);
  const [dashboardData] = useState({
    // Hardcoded data for now muna
    completed: { count: 10, trend: 'up', change: 'Increased from last month' },
    inProgress: { count: 25, trend: 'up', change: 'Increased from last month' },
    pending: { count: 3, status: 'On Discuss' },
    flagshipUpdate: { percentage: 85, completed: 85, inProgress: 10, pending: 5 },
    upcoming: [
      { office: 'ACCA', activity: 'ARTEJOS', due: 'Oct 5, 2025', logo: '/images/acca_logo_small.webp' },
      { office: 'ACES', activity: 'Inigo Tree Planting', due: 'Oct 6, 2025', logo: '/images/aces_logo_small.webp' },
      { office: 'ALTEC', activity: 'SUGPAT Program', due: 'Oct 7, 2025', logo: '/images/altec_logo_small.webp' },
    ],
    budget: {
      total: 1000000,
      allocated: 750000,
      remaining: 250000
    }
  });

  // Fetch navbar data on mount
  useEffect(() => {
    const fetchNavbarData = async () => {
      try {
        // Fetch notifications count
        const notificationsData = await NavbarService.getNotifications();
        setNotificationsCount(notificationsData.unread || 0);

        // Fetch messages count
        const messagesData = await NavbarService.getMessages();
        setMessagesCount(messagesData.unread || 0);
      } catch (error) {
        console.error('Error fetching navbar data:', error);
        // Fail silently, keep counts at 0
      }
    };

    fetchNavbarData();
  }, []);

  // Get date logic present time nowww
  const currentDate = new Date();
  const day = currentDate.getDate().toString().padStart(2, '0');
  const month = currentDate.toLocaleDateString('en-US', { month: 'long' }).toUpperCase();
  const weekday = currentDate.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();

  return (
    <div className="flex bg-[#EAE9E9] min-h-screen max-h-screen p-4 sm:p-6 md:p-[35px] overflow-hidden">
      {/* WhiteContainer Wrapper (Gamitin niyo to for start) */}
      <div className="bg-white rounded-[20px] flex flex-1 overflow-hidden">
        {/* Sidebar Container */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-grow pt-4 sm:pt-6 pb-6 sm:pb-10 md:pb-6 p-2 flex flex-col overflow-hidden">
          {/* Container maxWidth="xl" equivalent */}
          <div className="h-full flex flex-col max-w-[1536px] w-full mx-auto">
            {/* Header - Floating Container */}
            <div className="bg-[#F4F4F4] rounded-[15px] p-2 sm:p-3 mb-2 sm:mb-4 mx-2 sm:mx-4 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-0 flex-shrink-0">
              {/* Search Bar this One */}
              <div className="relative ml-0 sm:ml-3 w-full sm:w-[500px]">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full h-10 bg-white text-[#040195] rounded-full pl-10 sm:pl-14
                   text-xs outline-none border 
                   border-transparent focus:border-[#5B6FED] hover:border-[#5B6FED] transition-colors"
                />
                <div className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                  <SearchIcon className="text-[#040195]" sx={{ fontSize: { xs: 24, sm: 30 } }} />
                </div>
              </div>

              {/* Right Side Icons */}
              <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                {/* Messages/Email Button with Badge */}
                <button className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-white hover:bg-[#E8EAFF] rounded-full transition-colors relative">
                  <EmailIcon className="text-[#5B6FED]" sx={{ fontSize: { xs: 18, sm: 20 } }} />
                  {messagesCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center font-semibold text-[10px] sm:text-xs">
                      {messagesCount > 9 ? '9+' : messagesCount}
                    </span>
                  )}
                </button>

                {/* Notifications Button with Badge */}
                <button className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-white hover:bg-[#E8EAFF] rounded-full transition-colors relative">
                  <NotificationsIcon className="text-[#5B6FED]" sx={{ fontSize: { xs: 18, sm: 20 } }} />
                  {notificationsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center font-semibold text-[10px] sm:text-xs">
                      {notificationsCount > 9 ? '9+' : notificationsCount}
                    </span>
                  )}
                </button>
                {/* Avatar and User Info */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white text-[#5B6FED] flex items-center justify-center font-medium text-sm sm:text-base">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-sm font-semibold text-[rgba(0,0,0,0.87)]">
                      {user?.name || 'Unit Director'}
                    </div>
                    <div className="text-xs text-[rgba(0,0,0,0.6)]">
                      {user?.email}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content containerr */}
            <div className="bg-[#F4F4F4] rounded-[15px] p-3 sm:p-4 md:p-6 mx-2 sm:mx-4 flex-1 overflow-x-hidden overflow-y-auto flex flex-col min-h-0">
              {/* Title and Date */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-5 flex-shrink-0 gap-2 sm:gap-0">
                <h5 className="text-xl sm:text-2xl md:text-[2rem] font-bold leading-[1.334] text-[#040195]">
                  Overview
                </h5>
                <div className="flex gap-2 flex-wrap">
                  {/* outline stylesd */}
                  <span className="inline-flex items-center justify-center h-5 sm:h-6 px-2 sm:px-3 text-[0.7rem] sm:text-[0.8125rem] border border-[#040195] text-[#040195] rounded-full">
                    {day}
                  </span>
                  <span className="inline-flex items-center justify-center h-5 sm:h-6 px-2 sm:px-3 text-[0.7rem] sm:text-[0.8125rem] border border-[#040195] text-[#040195] rounded-full">
                    {month}
                  </span>
                  <span className="inline-flex items-center justify-center h-5 sm:h-6 px-2 sm:px-3 text-[0.7rem] sm:text-[0.8125rem] border border-[#040195] text-[#040195] rounded-full">
                    {weekday}
                  </span>
                </div>
              </div>

              {/* Grid Container */}
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 min-h-0 overflow-visible">
                {/* Column 1 - Flagship Update (md={4}) */}
                <div className="lg:col-span-5 flex flex-col min-h-[300px] sm:min-h-[400px] lg:min-h-[500px]">
                  <FlagshipUpdateCard flagshipData={dashboardData.flagshipUpdate} />
                </div>

                {/* Column 2 - Upcoming and Budget (md={4.5}) */}
                <div className="lg:col-span-4 flex flex-col min-h-0 gap-3 sm:gap-4">
                  {/* Upcoming Activities - 60% height on desktop */}
                  <div className="flex flex-col min-h-[250px] sm:min-h-[200px] lg:flex-2">
                    <UpcomingActivitiesCard upcomingData={dashboardData.upcoming} />
                  </div>

                  {/* Budget Card with Carousel */}
                  <div className="flex flex-col min-h-[280px] sm:min-h-[300px] lg:min-h-[200px]">
                    <BudgetCard budgetData={dashboardData.budget} />
                  </div>
                </div>

                {/* Column 3 - Stats Cards (md={3.5}) */}
                <div className="lg:col-span-3 flex flex-col min-h-0 gap-3 sm:gap-4 lg:gap-0">
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
