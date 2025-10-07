import { useState } from 'react';
import { 
  Search as SearchIcon,
  Email as EmailIcon,
  Notifications as NotificationsIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import DonutChart from '@/ui/DonutChart';

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
                <div className="md:col-span-4 flex flex-col min-h-0">
                  <div className="flex-1 relative border border-[#E5E7EB] rounded-xl overflow-hidden bg-white shadow-none">
                    <div className="p-4 h-full flex flex-col">
                      <div className="flex justify-between items-center mb-3 flex-shrink-0">
                        <h6 className="text-[#040195] text-xl font-semibold leading-[1.6]">
                          Flagship Update
                        </h6>
                        <button className="w-[22px] h-[22px] p-1 flex items-center justify-center rounded hover:bg-[rgba(0,0,0,0.04)] transition-colors">
                          <img src="/icons/arrow_diagonal.svg" alt="View" className="w-10 h-10" />
                        </button>
                      </div>

                      {/* Donut Chart Here */}
                      <div className="flex justify-center items-center flex-1 relative min-h-0">
                        <DonutChart 
                          completed={dashboardData.flagshipUpdate.completed}
                          inProgress={dashboardData.flagshipUpdate.inProgress}
                          pending={dashboardData.flagshipUpdate.pending}
                          size={250}
                        />
                      </div>

                      {/* Legend desc */}
                      <div className="flex justify-center gap-4 mt-3 flex-shrink-0">
                        <div className="flex items-center gap-1">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#4D49FC]" />
                          <span className="text-[0.7rem]">Completed</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#818CF8]" />
                          <span className="text-[0.7rem]">In Progress</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#C7D2FE]" />
                          <span className="text-[0.7rem]">Pending</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 2 - Upcoming and Budget (md={4.5}) */}
                <div className="md:col-span-5 flex flex-col min-h-0">
                  <div className="grid grid-cols-1 gap-4 flex-1 min-h-0">
                    {/* Upcoming Activities - 60% height on desktop */}
                    <div className="md:row-span-3 flex flex-col">
                      <div className="border border-[#E5E7EB] rounded-xl flex-1 overflow-auto bg-white shadow-none">
                        <div className="p-4 h-full flex flex-col">
                          <div className="flex justify-between items-center mb-3 flex-shrink-0">
                            <h6 className="text-[#040195] font-semibold leading-[1.6]">
                              Upcoming
                            </h6>
                            <button className="w-[22px] h-[22px] p-1 flex items-center justify-center rounded hover:bg-[rgba(0,0,0,0.04)] transition-colors">
                              <img src="/icons/arrow_diagonal.svg" alt="View" className="w-10 h-10" />
                            </button>
                          </div>

                          <div className="flex flex-col gap-3 flex-1 overflow-auto">
                            {dashboardData.upcoming.map((item, index) => (
                              <div 
                                key={index}
                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#f8f9ff] transition-colors flex-shrink-0"
                              >
                                <div className="w-9 h-9 rounded-lg  flex items-center justify-center flex-shrink-0 overflow-hidden">
                                  <img 
                                    src={item.logo} 
                                    alt={item.office}
                                    className="w-full h-full object-contain p-1"
                                  />
                                </div>
                                <div className="flex-grow min-w-0">
                                  <div className="text-[0.65rem] font-bold text-[#0401955e]">
                                    {item.office}
                                  </div>
                                  <div className="text-[0.85rem] font-normal text-[#4D49FC]">
                                    {item.activity}
                                  </div>
                                </div>
                                <div className="text-right flex-shrink-0">
                                  <div className="text-[0.65rem] font-bold text-[#0401955e]">
                                    Due
                                  </div>
                                  <div className="text-[0.75rem] font-normal text-[#4D49FC]">
                                    {item.due}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Budget Card */}
                    <div className="md:row-span-2 flex flex-col">
                      <div className="border border-[#E5E7EB] rounded-xl flex-1 bg-white shadow-none">
                        <div className="p-4 h-full flex flex-col justify-between">
                          <div className="flex justify-between items-center flex-shrink-0">
                            <h6 className="text-[#040195] font-semibold leading-[1.6]">
                              Budget
                            </h6>
                            <button className="w-[22px] h-[22px] p-1 flex items-center justify-center rounded hover:bg-[rgba(0,0,0,0.04)] transition-colors">
                              <img src="/icons/arrow_diagonal.svg" alt="View" className="w-10 h-10" />
                            </button>
                          </div>
                          <div className="mt-3">
                            <h5 className="text-[1.5rem] font-bold leading-[1.334] text-[#5B6FED]">
                              ₱{dashboardData.budget.total.toLocaleString()}
                            </h5>
                            <div className="text-[0.7rem] text-[rgba(0,0,0,0.6)]">
                              Total Budget Allocated
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 3 - Stats Cards (md={3.5}) */}
                <div className="md:col-span-3 flex flex-col min-h-0">
                  <div className="grid grid-cols-1 gap-3 flex-1 min-h-0 md:grid-rows-3">
                    {/* Completed  */}
                    <div className="flex flex-col min-h-0">
                      <div className="bg-[#1E22AA] text-white rounded-3xl flex-1 shadow-none overflow-hidden">
                        <div className="p-4 h-full flex flex-col justify-between">
                          <div className="flex justify-between items-center mb-1 flex-shrink-0">
                            <h6 className="text-[1.5rem] font-bold leading-[1]">
                              Completed
                            </h6>
                            <button className="w-7 h-7 flex items-center justify-center text-white transition-colors flex-shrink-0">
                              <img src="/icons/arrow_diagonal.svg" alt="View" className="w-10 h-10 brightness-0 invert" />
                            </button>
                          </div>
                          <h4 className="text-[2.5rem] font-bold leading-[1] my-1 flex-shrink-0">
                            {dashboardData.completed.count}
                          </h4>
                          <div className="flex items-center gap-1.5  rounded-md px-2 py-1 w-fit flex-shrink-0">
                            <TrendingUpIcon sx={{ fontSize: 12 }} className="text-[#5B6FED]" />
                            <span className="text-[0.7rem] text-[#C7D2FE]">
                              {dashboardData.completed.change}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* In Progress */}
                    <div className="flex flex-col min-h-0">
                      <div className="bg-white text-[#1E22AA] rounded-3xl flex-1 shadow-none border border-[#E5E7EB] overflow-hidden">
                        <div className="p-4 h-full flex flex-col justify-between">
                          <div className="flex justify-between items-center mb-1 flex-shrink-0">
                            <h6 className="text-[1.5rem] font-bold leading-[1]">
                              In Progress
                            </h6>
                            <button className="w-7 h-7 flex items-center justify-center transition-colors flex-shrink-0">
                              <img src="/icons/arrow_diagonal.svg" alt="View" className="w-10 h-10" />
                            </button>
                          </div>
                          <h4 className="text-[2.5rem] font-bold leading-[1] my-1 flex-shrink-0 text-[#5B6FED]">
                            {dashboardData.inProgress.count}
                          </h4>
                          <div className="flex items-center gap-1.5  rounded-md px-2 py-1 w-fit flex-shrink-0">
                            <TrendingUpIcon sx={{ fontSize: 12 }} className="text-[#5B6FED]" />
                            <span className="text-[0.7rem] text-[#5B6FED]">
                              {dashboardData.inProgress.change}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Pending */}
                    <div className="flex flex-col min-h-0">
                      <div className="bg-white text-[#1E22AA] rounded-3xl flex-1 shadow-none border border-[#E5E7EB] overflow-hidden">
                        <div className="p-4 h-full flex flex-col justify-between">
                          <div className="flex justify-between items-center mb-1 flex-shrink-0">
                            <h6 className="text-[1.5rem] font-bold leading-[1]">
                              Pending
                            </h6>
                            <button className="w-7 h-7 flex items-center justify-center transition-colors flex-shrink-0">
                              <img src="/icons/arrow_diagonal.svg" alt="View" className="w-10 h-10" />
                            </button>
                          </div>
                          <h4 className="text-[2.5rem] font-bold leading-[1] my-1 flex-shrink-0 text-[#5B6FED]">
                            {dashboardData.pending.count}
                          </h4>
                          <span className="text-[0.75rem] text-[#5B6FED] flex-shrink-0">
                            {dashboardData.pending.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
