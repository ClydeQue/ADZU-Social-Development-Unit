import DonutChart from '@/ui/DonutChart';

// eslint-disable-next-line react/prop-types
const FlagshipUpdateCard = ({ flagshipData }) => {
  return (
    <div className="flex-1 relative border border-[#E5E7EB] rounded-xl overflow-hidden bg-white shadow-none">
      <div className="p-3 sm:p-4 h-full flex flex-col">
        <div className="flex justify-between items-center mb-2 sm:mb-3 flex-shrink-0">
          <h6 className="text-[#040195] text-base sm:text-lg md:text-xl font-semibold leading-[1.6]">
            Flagship Update
          </h6>
          <button className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded hover:bg-[rgba(0,0,0,0.04)] transition-colors">
            <img src="/icons/arrow_diagonal.svg" alt="View" className="w-8 h-8 sm:w-10 sm:h-10" />
          </button>
        </div>

        {/* Donut Chart */}
        <div className="flex justify-center items-center flex-1 relative min-h-0">
          <DonutChart 
            // eslint-disable-next-line react/prop-types
            completed={flagshipData?.completed || 0}
            // eslint-disable-next-line react/prop-types
            inProgress={flagshipData?.inProgress || 0}
            // eslint-disable-next-line react/prop-types
            pending={flagshipData?.pending || 0}
            size={window.innerWidth < 640 ? 180 : window.innerWidth < 1024 ? 220 : 250}
          />
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-2 sm:mt-3 flex-shrink-0">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#4D49FC]" />
            <span className="text-[0.65rem] sm:text-[0.7rem]">Completed</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#818CF8]" />
            <span className="text-[0.65rem] sm:text-[0.7rem]">In Progress</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#C7D2FE]" />
            <span className="text-[0.65rem] sm:text-[0.7rem]">Pending</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlagshipUpdateCard;
