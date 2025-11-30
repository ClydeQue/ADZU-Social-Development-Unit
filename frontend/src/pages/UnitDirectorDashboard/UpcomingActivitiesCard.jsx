import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardService from "@/services/dashboardService";
import UnitDirectorService from "@/services/unitDirectorService";
import ListSkeleton from "@/components/ListSkeleton";
import ReportDetailModal from "@/pages/UnitDirectorReports/ReportDetailModal";
import ReportModalSkeleton from "@/components/ReportModalSkeleton";

const UpcomingActivitiesCard = () => {
  const [selectedActivityId, setSelectedActivityId] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  // Fetch upcoming activities (next 3 closest to current date)
  const { data: upcomingData, isLoading } = useQuery({
    queryKey: ["upcoming-activities"],
    queryFn: DashboardService.getUpcomingActivities,
    staleTime: 2 * 60 * 1000, // Consider fresh for 2 minutes
    refetchOnWindowFocus: true,
  });

  // Fetch selected activity details
  const { data: activityResponse, isLoading: isLoadingDetails, error: activityError } = useQuery({
    queryKey: ["activity", selectedActivityId],
    queryFn: async () => {
      if (!selectedActivityId) return null;
      const response = await UnitDirectorService.getActivityById(selectedActivityId);
      // Backend returns { activity: {...} }
      return response.activity || response;
    },
    enabled: !!selectedActivityId,
    staleTime: 1 * 60 * 1000,
  });

  const upcoming = upcomingData?.upcoming || [];

  const handleActivityClick = (item) => {
    setSelectedActivityId(item.id);
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setSelectedActivityId(null);
    setSelectedItem(null);
  };

  // Logo mapping for offices
  const logoMap = {
    ACCA: "/images/acca_logo_small.webp",
    ACES: "/images/aces_logo_small.webp",
    ACLG: "/images/aclg_logo_small.webp",
    ALTEC: "/images/altec_logo_small.webp",
    APC: "/images/apc_logo_small.webp",
    CCES: "/images/cces_logo_small.webp",
  };

  // Format date to display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="border border-[#E5E7EB] rounded-xl flex-1 overflow-auto bg-white shadow-none">
      <div className="p-3 sm:p-4 h-full flex flex-col">
        <div className="flex justify-between items-center mb-2 sm:mb-3 flex-shrink-0">
          <h6 className="text-[#040195] text-base sm:text-lg font-semibold leading-[1.5]">
            Upcoming
          </h6>
        </div>

        <div className="flex flex-col gap-2 sm:gap-3 flex-1 overflow-auto">
          {isLoading ? (
            <ListSkeleton items={3} />
          ) : upcoming.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <span className="text-[0.75rem] text-gray-400">
                No upcoming activities
              </span>
            </div>
          ) : (
            upcoming.map((item, index) => (
              <div
                key={item.id || index}
                onClick={() => handleActivityClick(item)}
                className="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 rounded-lg hover:bg-[#f8f9ff] transition-colors flex-shrink-0 cursor-pointer"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <img
                    src={logoMap[item.office] || "/images/default_logo.webp"}
                    alt={item.office}
                    className="w-full h-full object-contain p-1"
                  />
                </div>
                <div className="flex-grow  min-w-0">
                  <div className="text-[0.6rem] sm:text-[0.65rem] font-bold text-[#0401955e]">
                    {item.office}
                  </div>
                  <div className="text-[0.75rem] sm:text-[0.85rem] font-normal text-[#4D49FC] truncate">
                    {item.activity}
                  </div>
                </div>
                <div className="text-elf flex-shrink-0">
                  <div className="text-[0.6rem] sm:text-[0.65rem] font-bold text-[#0401955e]">
                    Due
                  </div>
                  <div className="text-[0.7rem] sm:text-[0.75rem] font-normal text-[#4D49FC] whitespace-nowrap">
                    {formatDate(item.due)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Report Detail Modal */}
      {selectedActivityId && selectedItem && (
        isLoadingDetails ? (
          <ReportModalSkeleton onClose={handleCloseModal} />
        ) : activityError ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(4, 1, 149, 0.4)' }} onClick={handleCloseModal}>
            <div className="bg-white rounded-lg p-8 shadow-xl max-w-md">
              <div className="text-red-600 text-lg font-semibold mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                Error Loading Activity
              </div>
              <p className="text-gray-700 mb-4">
                {activityError?.message || 'Failed to load activity details'}
              </p>
              <button 
                onClick={handleCloseModal}
                className="px-4 py-2 bg-[#4D49FC] text-white rounded-md hover:bg-[#3D39EC] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        ) : activityResponse ? (
          <ReportDetailModal
            report={{
              id: selectedItem.id,
              office: selectedItem.office || '',
              program: activityResponse.program_title || '',
              activity: selectedItem.activity || '',
              due: selectedItem.due || '',
              submitted: activityResponse.created_at || '',
              participants: activityResponse.participants_count || 0,
              budget: activityResponse.budget_amount || 0,
            }}
            activity={activityResponse}
            onClose={handleCloseModal}
          />
        ) : null
      )}
    </div>
  );
};

export default UpcomingActivitiesCard;
