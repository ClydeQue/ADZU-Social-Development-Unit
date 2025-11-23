import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getOfficeLogo } from '@/utils/officeLogos';

// eslint-disable-next-line react/prop-types
const BudgetCard = ({ budgetData }) => {
  const [visibleItems, setVisibleItems] = useState([1, 2, 3, 4, 5, 6, 7]);
  const [direction, setDirection] = useState(0);
  const [hoveredSDG, setHoveredSDG] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Office list
  const offices = ['ACCA', 'ACES', 'ACLG', 'ALTEC', 'APC', 'CCES'];

  // sdgData is static for now with office breakdown
  const sdgData = [
    { id: 1, value: 75, offices: { ACCA: 15, ACES: 20, ACLG: 10, ALTEC: 12, APC: 8, CCES: 10 } },
    { id: 2, value: 90, offices: { ACCA: 18, ACES: 22, ACLG: 15, ALTEC: 14, APC: 11, CCES: 10 } },
    { id: 3, value: 45, offices: { ACCA: 8, ACES: 10, ACLG: 7, ALTEC: 6, APC: 7, CCES: 7 } },
    { id: 4, value: 80, offices: { ACCA: 16, ACES: 18, ACLG: 12, ALTEC: 13, APC: 11, CCES: 10 } },
    { id: 5, value: 60, offices: { ACCA: 12, ACES: 14, ACLG: 9, ALTEC: 10, APC: 8, CCES: 7 } },
    { id: 6, value: 85, offices: { ACCA: 17, ACES: 19, ACLG: 13, ALTEC: 14, APC: 12, CCES: 10 } },
    { id: 7, value: 95, offices: { ACCA: 19, ACES: 21, ACLG: 16, ALTEC: 15, APC: 13, CCES: 11 } },
    { id: 8, value: 70, offices: { ACCA: 14, ACES: 16, ACLG: 11, ALTEC: 11, APC: 9, CCES: 9 } },
    { id: 9, value: 88, offices: { ACCA: 18, ACES: 20, ACLG: 14, ALTEC: 14, APC: 12, CCES: 10 } },
    { id: 10, value: 55, offices: { ACCA: 11, ACES: 13, ACLG: 8, ALTEC: 9, APC: 7, CCES: 7 } },
    { id: 11, value: 92, offices: { ACCA: 18, ACES: 21, ACLG: 15, ALTEC: 15, APC: 12, CCES: 11 } },
    { id: 12, value: 78, offices: { ACCA: 15, ACES: 18, ACLG: 12, ALTEC: 13, APC: 10, CCES: 10 } },
    { id: 13, value: 65, offices: { ACCA: 13, ACES: 15, ACLG: 10, ALTEC: 10, APC: 9, CCES: 8 } },
    { id: 14, value: 82, offices: { ACCA: 16, ACES: 19, ACLG: 13, ALTEC: 13, APC: 11, CCES: 10 } },
    { id: 15, value: 73, offices: { ACCA: 14, ACES: 17, ACLG: 11, ALTEC: 12, APC: 10, CCES: 9 } },
    { id: 16, value: 68, offices: { ACCA: 13, ACES: 16, ACLG: 10, ALTEC: 11, APC: 9, CCES: 9 } },
    { id: 17, value: 91, offices: { ACCA: 18, ACES: 21, ACLG: 15, ALTEC: 14, APC: 12, CCES: 11 } },
  ];
// Queue algorithm for carousel effect
  const handlePrev = () => {
    setDirection(-1);
    setVisibleItems((prev) => {
      const firstVisible = prev[0];

      const newFirst = firstVisible > 1 ? firstVisible - 1 : sdgData.length;

      return [newFirst, ...prev.slice(0, -1)];
    });
  };

  const handleNext = () => {
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
    return visibleItems.map(id => sdgData.find(item => item.id === id));
  };

  const maxValue = Math.max(...sdgData.map(item => item.value));
  const currentIndex = visibleItems[0] - 1;
  const totalSlides = sdgData.length;

  return (
    <div className="border border-[#E5E7EB] rounded-xl flex-1 bg-white shadow-none overflow-hidden">
      <div className="p-3 sm:p-4 h-full flex flex-col">
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
          <div className="flex items-end gap-1 sm:gap-2 px-1 sm:px-2 h-full">
            <AnimatePresence initial={false} mode="popLayout">
              {getCurrentPageData().map((item) => (
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
                    setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.top });
                    setHoveredSDG(item);
                  }}
                  onMouseLeave={() => {
                    setHoveredSDG(null);
                  }}
                >
                  {/* Bar */}
                  <div className="flex items-end justify-center" style={{ height: '50px' }}>
                    <div
                      className="bg-[#4D49FC] rounded-full cursor-pointer hover:bg-[#3d39cc] transition-colors"
                      style={{
                        width: window.innerWidth < 640 ? '8px' : '10px',
                        height: `${(item.value / maxValue) * 100}%`,
                        minHeight: '6px'
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
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
              <h4 className="text-[#040195] font-bold text-sm">SDG {hoveredSDG.id}</h4>
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

export default BudgetCard;
