import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { getOfficeLogo } from '@/utils/officeLogos';
import UnitDirectorService from '@/services/unitDirectorService';

const SDGCoverageCard = () => {
  const [visibleItems, setVisibleItems] = useState([1, 2, 3, 4, 5, 6, 7]);
  const [direction, setDirection] = useState(0);
  const [hoveredSDG, setHoveredSDG] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Office list
  const offices = ['ACCA', 'ACES', 'ACLG', 'ALTEC', 'APC', 'CCES'];

  // Fetch SDG analytics from backend
  const { data: sdgAnalytics, isLoading, error } = useQuery({
    queryKey: ['sdg-analytics'],
    queryFn: () => UnitDirectorService.getSDGAnalytics(),
    staleTime: 5 * 60 * 1000, // Consider fresh for 5 minutes
    retry: 2,
  });

  const sdgData = sdgAnalytics?.sdgData || [];
  
  console.log('BudgetCard - isLoading:', isLoading);
  console.log('BudgetCard - error:', error);
  console.log('BudgetCard - sdgData:', sdgData);
  console.log('BudgetCard - sdgAnalytics:', sdgAnalytics);
  
  // Queue algorithm for carousel effect
  const handlePrev = () => {
    if (sdgData.length === 0) return;
    setDirection(-1);
    setVisibleItems((prev) => {
      const firstVisible = prev[0];

      const newFirst = firstVisible > 1 ? firstVisible - 1 : sdgData.length;

      return [newFirst, ...prev.slice(0, -1)];
    });
  };

  const handleNext = () => {
    if (sdgData.length === 0) return;
    setDirection(1);
    setVisibleItems((prev) => {
      const lastVisible = prev[prev.length - 1];
      // If at the end, wrap to beginning
      const newLast = lastVisible < sdgData.length ? lastVisible + 1 : 1;
      // Remove first item, add new item at end
      return [...prev.slice(1), newLast];
    });
  };

  const getCurrentPageData = () => {
    if (sdgData.length === 0) return [];
    return visibleItems.map(id => sdgData.find(item => item.id === id)).filter(Boolean);
  };

  const maxValue = sdgData.length > 0 ? Math.max(...sdgData.map(item => item.value), 1) : 1;

  return (
    <div className="border border-[#E5E7EB] rounded-xl h-full bg-white shadow-none overflow-hidden flex flex-col">
      <div className="p-3 sm:p-4 flex-1 flex flex-col min-h-0">
        {/* Header */}
        <div className="flex justify-between items-center mb-2 sm:mb-3 flex-shrink-0">
          <h6 className="text-[#040195] font-bold text-base sm:text-lg md:text-xl leading-[1.6]">
            SDG Coverage
          </h6>
          <div className="flex items-center gap-0.5 sm:gap-1 z-10">
            {/* Left Arrow */}
            <button
              type="button"
              onClick={handlePrev}
              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-transparent hover:bg-[#E8EAFF] transition-all duration-200 cursor-pointer border-none outline-none active:scale-95"
              aria-label="Previous"
              disabled={isLoading}
            >
              <img 
                src="/icons/arrow_left_navy.svg" 
                alt="Previous" 
                className="w-3 h-3 sm:w-4 sm:h-4 select-none"
                draggable="false"
              />
            </button>
            {/* Right Arrow */}
            <button
              type="button"
              onClick={handleNext}
              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-transparent hover:bg-[#E8EAFF] transition-all duration-200 cursor-pointer border-none outline-none active:scale-95"
              aria-label="Next"
              disabled={isLoading}
            >
              <img 
                src="/icons/arrow_right_navy.svg" 
                alt="Next" 
                className="w-3 h-3 sm:w-4 sm:h-4 select-none"
                draggable="false"
              />
            </button>
          </div>
        </div>

        {/* Bar Chart Container  */}
        <div className="flex-1 min-h-0 relative" style={{ maxHeight: '100%' }}>
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-[#8988CD] text-sm">Loading SDG data...</div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-red-500 text-sm">Error loading SDG data</div>
            </div>
          ) : sdgData.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-[#8988CD] text-sm">No data available</div>
            </div>
          ) : (
            <div className="flex items-end gap-1 sm:gap-2 px-1 sm:px-2 h-full">
              <AnimatePresence initial={false} mode="popLayout">
                {getCurrentPageData().map((item) => item && (
                <motion.div 
                  key={item.id} 
                  className="flex items-end gap-0.5 sm:gap-1 flex-1 relative"
                  initial={{ 
                    x: direction > 0 ? 50 : -50,
                    opacity: 0,
                    scale: 0.8
                  }}
                  animate={{ 
                    x: 0,
                    opacity: 1,
                    scale: 1
                  }}
                  exit={{ 
                    x: direction > 0 ? -50 : 50,
                    opacity: 0,
                    scale: 0.8
                  }}
                  transition={{
                    duration: 0.3,
                    ease: "easeInOut"
                  }}
                  layout
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setTooltipPosition({ x: rect.left + rect.width / 9, y: rect.top });
                    setHoveredSDG(item);
                  }}
                  onMouseLeave={() => {
                    setHoveredSDG(null);
                  }}
                >
                  {/* Bar */}
                  <div className="flex items-end justify-center" style={{ height: '120px' }}>
                    <div
                      className="bg-[#4D49FC] rounded-full cursor-pointer hover:bg-[#3d39cc] transition-colors"
                      style={{
                        width: window.innerWidth < 640 ? '12px' : '14px',
                        height: item.value === 0 ? '8px' : `${Math.max((item.value / maxValue) * 100, 15)}%`,
                        minHeight: '8px'
                      }}
                    />
                  </div>
                  {/* Number beside the bar */}
                  <span className="text-[#040195] font-semibold text-[0.65rem] sm:text-xs leading-none pb-0.5">
                    {item.id}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Tooltip */}
      {hoveredSDG && (
        <div
          className="fixed z-[9999] pointer-events-none"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y - 10}px`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="bg-white rounded-xl shadow-2xl border-2 border-[#4D49FC] p-3 min-w-[200px]">
            {/* Header */}
            <div className="flex items-center justify-between gap-3 mb-3 pb-2 border-b border-gray-200">
              <img
                src={`/images/SDG-images/SDG-${hoveredSDG.id}.webp`}
                alt={`SDG ${hoveredSDG.id}`}
                className="w-8 h-8 object-contain"
              />
              <span className="text-[#4D49FC] font-bold text-lg">{hoveredSDG.value}</span>
            </div>
            
            {/* Office List */}
            <div className="space-y-2">
              {offices.map((office) => {
                const count = hoveredSDG.offices[office] || 0;
                const logo = getOfficeLogo(office);
                
                return (
                  <div
                    key={office}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2">
                      {logo && (
                        <img
                          src={logo}
                          alt={office}
                          className="w-5 h-5 object-contain"
                        />
                      )}
                      <span className="text-[#040195] text-xs font-semibold">
                        {office}
                      </span>
                    </div>
                    <span className={`text-xs font-bold ${count > 0 ? 'text-[#4D49FC]' : 'text-gray-400'}`}>
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Arrow pointer */}
            <div
              className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-full"
              style={{
                width: 0,
                height: 0,
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderTop: '8px solid #4D49FC',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SDGCoverageCard;
