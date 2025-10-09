import { TrendingUp as TrendingUpIcon } from '@mui/icons-material';

// eslint-disable-next-line react/prop-types
const StatsCards = ({ completed, inProgress, pending }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3 flex-1 min-h-0 lg:grid-rows-3">
      {/* Completed */}
      <div className="flex flex-col min-h-[150px] sm:min-h-[180px] lg:min-h-0">
        <div className="bg-[#1E22AA] text-white rounded-2xl sm:rounded-3xl flex-1 shadow-none overflow-hidden">
          <div className="p-3 sm:p-4 h-full flex flex-col justify-between">
            <div className="flex justify-between items-center mb-1 flex-shrink-0">
              <h6 className="text-lg sm:text-xl md:text-[1.5rem] font-bold leading-[1]">
                Completed
              </h6>
              <button className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-white transition-colors flex-shrink-0">
                <img src="/icons/arrow_diagonal.svg" alt="View" className="w-8 h-8 sm:w-10 sm:h-10 brightness-0 invert" />
              </button>
            </div>
            <h4 className="text-3xl sm:text-4xl md:text-[2.5rem] font-bold leading-[1] my-1 flex-shrink-0">
              {/* eslint-disable-next-line react/prop-types */}
              {completed?.count || 0}
            </h4>
            <div className="flex items-center gap-1.5 rounded-md px-2 py-1 w-fit flex-shrink-0">
              <TrendingUpIcon sx={{ fontSize: { xs: 10, sm: 12 } }} className="text-[#5B6FED]" />
              <span className="text-[0.6rem] sm:text-[0.7rem] text-[#C7D2FE]">
                {/* eslint-disable-next-line react/prop-types */}
                {completed?.change || 'No data'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* In Progress */}
      <div className="flex flex-col min-h-[150px] sm:min-h-[180px] lg:min-h-0">
        <div className="bg-white text-[#1E22AA] rounded-2xl sm:rounded-3xl flex-1 shadow-none border border-[#E5E7EB] overflow-hidden">
          <div className="p-3 sm:p-4 h-full flex flex-col justify-between">
            <div className="flex justify-between items-center mb-1 flex-shrink-0">
              <h6 className="text-lg sm:text-xl md:text-[1.5rem] font-bold leading-[1]">
                In Progress
              </h6>
              <button className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center transition-colors flex-shrink-0">
                <img src="/icons/arrow_diagonal.svg" alt="View" className="w-8 h-8 sm:w-10 sm:h-10" />
              </button>
            </div>
            <h4 className="text-3xl sm:text-4xl md:text-[2.5rem] font-bold leading-[1] my-1 flex-shrink-0 text-[#5B6FED]">
              {/* eslint-disable-next-line react/prop-types */}
              {inProgress?.count || 0}
            </h4>
            <div className="flex items-center gap-1.5 rounded-md px-2 py-1 w-fit flex-shrink-0">
              <TrendingUpIcon sx={{ fontSize: { xs: 10, sm: 12 } }} className="text-[#5B6FED]" />
              <span className="text-[0.6rem] sm:text-[0.7rem] text-[#5B6FED]">
                {/* eslint-disable-next-line react/prop-types */}
                {inProgress?.change || 'No data'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Pending */}
      <div className="flex flex-col min-h-[150px] sm:min-h-[180px] lg:min-h-0">
        <div className="bg-white text-[#1E22AA] rounded-2xl sm:rounded-3xl flex-1 shadow-none border border-[#E5E7EB] overflow-hidden">
          <div className="p-3 sm:p-4 h-full flex flex-col justify-between">
            <div className="flex justify-between items-center mb-1 flex-shrink-0">
              <h6 className="text-lg sm:text-xl md:text-[1.5rem] font-bold leading-[1]">
                Pending
              </h6>
              <button className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center transition-colors flex-shrink-0">
                <img src="/icons/arrow_diagonal.svg" alt="View" className="w-8 h-8 sm:w-10 sm:h-10" />
              </button>
            </div>
            <h4 className="text-3xl sm:text-4xl md:text-[2.5rem] font-bold leading-[1] my-1 flex-shrink-0 text-[#5B6FED]">
              {/* eslint-disable-next-line react/prop-types */}
              {pending?.count || 0}
            </h4>
            <span className="text-[0.65rem] sm:text-[0.75rem] text-[#5B6FED] flex-shrink-0">
              {/* eslint-disable-next-line react/prop-types */}
              {pending?.status || 'No status'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
