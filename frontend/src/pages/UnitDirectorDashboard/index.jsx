import { useState } from 'react';
import { 
  Search as SearchIcon,
  Email as EmailIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import FlagshipUpdateCard from './FlagshipUpdateCard';
import UpcomingActivitiesCard from './UpcomingActivitiesCard';
import BudgetCard from './BudgetCard';
import StatsCards from './StatsCards';

export default function UnitDirectorDashboard() {
  const { user } = useAuth();
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

  // Get date logic present time nowww
  const currentDate = new Date();
  const day = currentDate.getDate().toString().padStart(2, '0');
  const month = currentDate.toLocaleDateString('en-US', { month: 'long' }).toUpperCase();
  const weekday = currentDate.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();

  return (
    <div className="flex bg-[#EAE9E9] min-h-screen max-h-screen p-[35px] overflow-hidden">
      {/* WhiteContainer Wrapper (Gamitin niyo to for start) */}
      <div className="bg-white rounded-[20px] flex flex-1 overflow-hidden">
        {/* Sidebar Container */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-grow pt-6 pb-10 md:pb-6 p-2 flex flex-col overflow-hidden">
          {/* Container maxWidth="xl" equivalent */}
          <div className=" h-full flex flex-col max-w-[1536px] w-full mx-auto">
            {/* Header - Floating Container */}
            <div className="bg-[#F4F4F4] rounded-[15px] p-3 mb-4 mx-4 flex justify-between items-center flex-shrink-0">
              {/* Search Bar this One */}
              <div className="relative ml-3 w-[500px] ">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full h-10 bg-white text-[#040195] rounded-full pl-14
                   text-xs outline-none border 
                   border-transparent focus:border-[#5B6FED] hover:border-[#5B6FED] transition-colors"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                  <SearchIcon className="text-[#040195]" sx={{ fontSize: 30 }} />
                </div>
              </div>

              {/* Right Side Icons */}
              <div className="flex items-center gap-4">
                {/* IconButton mimic */}
                <button className="w-10 h-10 flex items-center justify-center bg-white hover:bg-[#E8EAFF] rounded-full transition-colors">
                  <EmailIcon className="text-[#5B6FED]" sx={{ fontSize: 20 }} />
                </button>
                <button className="w-10 h-10 flex items-center justify-center bg-white hover:bg-[#E8EAFF] rounded-full transition-colors">
                  <NotificationsIcon className="text-[#5B6FED]" sx={{ fontSize: 20 }} />
                </button>
                {/* Avatar and User Info */}
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-white text-[#5B6FED] flex items-center justify-center font-medium">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div>
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
            <div className="bg-[#F4F4F4] rounded-[15px] p-6 mx-4 flex-1 overflow-x-hidden overflow-y-auto md:overflow-hidden flex flex-col min-h-0">
              {/* Title and Date */}
              <div className="flex justify-between items-center mb-5 flex-shrink-0">
                <h5 className="text-[2rem] font-bold leading-[1.334] text-[#040195]">
                  Overview
                </h5>
                <div className="flex gap-2">
                  {/* outline stylesd */}
                  <span className="inline-flex items-center justify-center h-6 px-3 text-[0.8125rem] border border-[#040195]  text-[#040195] rounded-full">
                    {day}
                  </span>
                  <span className="inline-flex items-center justify-center h-6 px-3 text-[0.8125rem] border border-[#040195]  text-[#040195] rounded-full">
                    {month}
                  </span>
                  <span className="inline-flex items-center justify-center h-6 px-3 text-[0.8125rem] border border-[#040195]  text-[#040195] rounded-full">
                    {weekday}
                  </span>
                </div>
              </div>

              {/* Grid Container */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 min-h-0 overflow-visible md:overflow-hidden">
                {/* Column 1 - Flagship Update (md={4}) */}
                <div className="md:col-span-5 flex flex-col min-h-0">
                  <FlagshipUpdateCard flagshipData={dashboardData.flagshipUpdate} />
                </div>

                {/* Column 2 - Upcoming and Budget (md={4.5}) */}
                <div className="md:col-span-4 flex flex-col min-h-0">
                  <div className="grid grid-cols-1 gap-4 flex-1 min-h-0">
                    {/* Upcoming Activities - 60% height on desktop */}
                    <div className="md:row-span-3 flex flex-col">
                      <UpcomingActivitiesCard upcomingData={dashboardData.upcoming} />
                    </div>

                    {/* Budget Card with Carousel */}
                    <div className="md:row-span-2 flex flex-col">
                      <BudgetCard budgetData={dashboardData.budget} />
                    </div>
                  </div>
                </div>

                {/* Column 3 - Stats Cards (md={3.5}) */}
                <div className="md:col-span-3 flex flex-col min-h-0">
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
