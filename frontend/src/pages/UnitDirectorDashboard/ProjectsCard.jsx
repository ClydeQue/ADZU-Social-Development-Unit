import { useQuery } from '@tanstack/react-query';
import DashboardService from '@/services/dashboardService';
import DonutChart from '@/ui/DonutChart';
import ChartSkeleton from '@/components/ChartSkeleton';

const ProjectsCard = () => {
  // Fetch live dashboard statistics
  const { data: statsData, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: DashboardService.getDashboardStats,
    staleTime: 2 * 60 * 1000, // Consider fresh for 2 minutes
    refetchOnWindowFocus: true,
  });

  // Calculate percentages dynamically
  const completed = statsData?.statistics?.completed || 0;
  const inProgress = statsData?.statistics?.in_progress || 0;
  const pending = statsData?.statistics?.pending || 0;
  
  const total = completed + inProgress + pending;
  
  // Calculate percentages (avoid division by zero)
  const completedPercent = total > 0 ? Math.round((completed / total) * 100) : 0;
  const inProgressPercent = total > 0 ? Math.round((inProgress / total) * 100) : 0;
  const pendingPercent = total > 0 ? Math.round((pending / total) * 100) : 0;

  return (
    <div className="flex-1 relative border border-[#E5E7EB] rounded-xl overflow-hidden bg-white shadow-none">
      <div className="p-2 sm:p-3 h-full flex flex-col">
        <div className="flex justify-between items-center mb-1 sm:mb-2 flex-shrink-0">
          <h6 className="text-[#040195] text-sm sm:text-base md:text-lg font-semibold leading-[1.6]">
            Projects
          </h6>
          <button className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded hover:bg-[rgba(0,0,0,0.04)] transition-colors">

          </button>
        </div>

        {/* Donut Chart */}
        <div className="flex justify-center items-center flex-1 relative min-h-0">
          {isLoading ? (
            <ChartSkeleton />
          ) : total === 0 ? (
            <div className="flex items-center justify-center">
              <span className="text-xs text-gray-400">No activities yet</span>
            </div>
          ) : (
            <DonutChart 
              completed={completedPercent}
              inProgress={inProgressPercent}
              pending={pendingPercent}
              size={window.innerWidth < 640 ? 140 : window.innerWidth < 1024 ? 160 : 180}
            />
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mt-1 sm:mt-2 flex-shrink-0">
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#4D49FC]" />
            <span className="text-[0.6rem] sm:text-[0.65rem]">Completed ({completedPercent}%)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#818CF8]" />
            <span className="text-[0.6rem] sm:text-[0.65rem]">In Progress ({inProgressPercent}%)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#C7D2FE]" />
            <span className="text-[0.6rem] sm:text-[0.65rem]">Pending ({pendingPercent}%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsCard;
