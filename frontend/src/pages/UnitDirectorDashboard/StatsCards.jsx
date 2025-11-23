import { TrendingUp as TrendingUpIcon } from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import DashboardService from "@/services/dashboardService";

const StatsCards = () => {
  const navigate = useNavigate();

  // Fetch live dashboard statistics
  const { data: statsData, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: DashboardService.getDashboardStats,
    staleTime: 2 * 60 * 1000, // Consider fresh for 2 minutes
    refetchOnWindowFocus: true,
  });

  const completed = statsData?.statistics?.completed || "-";
  const inProgress = statsData?.statistics?.in_progress || "-";
  const pending = statsData?.statistics?.pending || "-";

  const handleNavigateToReports = (status) => {
    navigate(`/unit-director/reports?sort=${status}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3 flex-1 min-h-0 lg:grid-rows-3">
      {/* Completed */}
      <div className="flex flex-col min-h-[150px] sm:min-h-[180px] lg:min-h-0">
        <div
          onClick={() => handleNavigateToReports("completed")}
          className="bg-[#1E22AA] text-white rounded-2xl sm:rounded-3xl flex-1 shadow-none overflow-hidden cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
        >
          <div className="p-3 sm:p-4 h-full flex flex-col justify-between">
            <div className="flex justify-between items-center mb-1 flex-shrink-0">
              <h6 className="text-lg sm:text-xl md:text-[1.5rem] font-bold leading-[1]">
                Completed
              </h6>
              <button
                onClick={() => handleNavigateToReports("completed")}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-white flex cursor-pointer items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="View completed activities"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 11L11 1M11 1H1M11 1V11"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <h4 className="text-3xl sm:text-4xl md:text-[2.5rem] font-bold leading-[1] my-1 flex-shrink-0">
              {isLoading ? "..." : completed}
            </h4>
            <div className="flex items-center gap-1.5 rounded-md px-2 py-1 w-fit flex-shrink-0">
              <TrendingUpIcon
                sx={{ fontSize: { xs: 10, sm: 12 } }}
                className="text-[#5B6FED]"
              />
              <span className="text-[0.6rem] sm:text-[0.7rem] text-[#C7D2FE]">
                Activities with completed status
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* In Progress */}
      <div className="flex flex-col min-h-[150px] sm:min-h-[180px] lg:min-h-0">
        <div
          onClick={() => handleNavigateToReports("in-progress")}
          className="bg-white text-[#1E22AA] rounded-2xl sm:rounded-3xl flex-1 shadow-none border border-[#E5E7EB] overflow-hidden cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
        >
          <div className="p-3 sm:p-4 h-full flex flex-col justify-between">
            <div className="flex justify-between items-center mb-1 flex-shrink-0">
              <h6 className="text-lg sm:text-xl md:text-[1.5rem] font-bold leading-[1]">
                In Progress
              </h6>
              <button
                onClick={() => handleNavigateToReports("in-progress")}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-[#1E22AA] flex items-center justify-center cursor-pointer hover:bg-[#1E22AA]/10 transition-colors"
                aria-label="View in-progress activities"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 11L11 1M11 1H1M11 1V11"
                    stroke="#1E22AA"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <h4 className="text-3xl sm:text-4xl md:text-[2.5rem] font-bold leading-[1] my-1 flex-shrink-0 text-[#5B6FED]">
              {isLoading ? "..." : inProgress}
            </h4>
            <div className="flex items-center gap-1.5 rounded-md px-2 py-1 w-fit flex-shrink-0">
              <TrendingUpIcon
                sx={{ fontSize: { xs: 10, sm: 12 } }}
                className="text-[#5B6FED]"
              />
              <span className="text-[0.6rem] sm:text-[0.7rem] text-[#5B6FED]">
                Offices currently in this phase
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Pending */}
      <div className="flex flex-col min-h-[150px] sm:min-h-[180px] lg:min-h-0">
        <div
          onClick={() => handleNavigateToReports("pending")}
          className="bg-white text-[#1E22AA] rounded-2xl sm:rounded-3xl flex-1 shadow-none border border-[#E5E7EB] overflow-hidden cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
        >
          <div className="p-3 sm:p-4 h-full flex flex-col justify-between">
            <div className="flex justify-between items-center mb-1 flex-shrink-0">
              <h6 className="text-lg sm:text-xl md:text-[1.5rem] font-bold leading-[1]">
                Pending
              </h6>
              <button
                onClick={() => handleNavigateToReports("pending")}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-[#1E22AA] flex items-center justify-center cursor-pointer hover:bg-[#1E22AA]/10 transition-colors"
                aria-label="View pending activities"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 11L11 1M11 1H1M11 1V11"
                    stroke="#1E22AA"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <h4 className="text-3xl sm:text-4xl md:text-[2.5rem] font-bold leading-[1] my-1 flex-shrink-0 text-[#5B6FED]">
              {isLoading ? "..." : pending}
            </h4>
            <span className="text-[0.65rem] sm:text-[0.75rem] text-[#5B6FED] flex-shrink-0">
              Activities with pending status
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
