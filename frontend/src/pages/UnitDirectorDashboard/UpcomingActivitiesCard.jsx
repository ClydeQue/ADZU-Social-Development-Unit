// eslint-disable-next-line react/prop-types
const UpcomingActivitiesCard = ({ upcomingData }) => {
  return (
    <div className="border border-[#E5E7EB] rounded-xl flex-1 overflow-auto bg-white shadow-none">
      <div className="p-3 sm:p-4 h-full flex flex-col">
        <div className="flex justify-between items-center mb-2 sm:mb-3 flex-shrink-0">
          <h6 className="text-[#040195] text-base sm:text-lg font-semibold leading-[1.6]">
            Upcoming
          </h6>
          <button className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded hover:bg-[rgba(0,0,0,0.04)] transition-colors">
            <img src="/icons/arrow_diagonal.svg" alt="View" className="w-8 h-8 sm:w-10 sm:h-10" />
          </button>
        </div>

        <div className="flex flex-col gap-2 sm:gap-3 flex-1 overflow-auto">
          {/* eslint-disable-next-line react/prop-types */}
          {upcomingData?.map((item, index) => (
            <div 
              key={index}
              className="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 rounded-lg hover:bg-[#f8f9ff] transition-colors flex-shrink-0"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                <img 
                  src={item.logo} 
                  alt={item.office}
                  className="w-full h-full object-contain p-1"
                />
              </div>
              <div className="flex-grow min-w-0">
                <div className="text-[0.6rem] sm:text-[0.65rem] font-bold text-[#0401955e]">
                  {item.office}
                </div>
                <div className="text-[0.75rem] sm:text-[0.85rem] font-normal text-[#4D49FC] truncate">
                  {item.activity}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-[0.6rem] sm:text-[0.65rem] font-bold text-[#0401955e]">
                  Due
                </div>
                <div className="text-[0.7rem] sm:text-[0.75rem] font-normal text-[#4D49FC] whitespace-nowrap">
                  {item.due}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UpcomingActivitiesCard;
