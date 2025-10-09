import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// eslint-disable-next-line react/prop-types
const BudgetCard = ({ budgetData }) => {
  const [visibleItems, setVisibleItems] = useState([1, 2, 3, 4, 5, 6, 7]);
  const [direction, setDirection] = useState(0);

  // sdgData is static for now, 
  const sdgData = [
    { id: 1, value: 75 },
    { id: 2, value: 90 },
    { id: 3, value: 45 },
    { id: 4, value: 80 },
    { id: 5, value: 60 },
    { id: 6, value: 85 },
    { id: 7, value: 95 },
    { id: 8, value: 70 },
    { id: 9, value: 88 },
    { id: 10, value: 55 },
    { id: 11, value: 92 },
    { id: 12, value: 78 },
    { id: 13, value: 65 },
    { id: 14, value: 82 },
    { id: 15, value: 73 },
    { id: 16, value: 68 },
    { id: 17, value: 91 },
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
                  className="flex items-end gap-0.5 sm:gap-1 flex-1"
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
                >
                  {/* Bar */}
                  <div className="flex items-end justify-center" style={{ height: '50px' }}>
                    <div
                      className="bg-[#4D49FC] rounded-full"
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
    </div>
  );
};

export default BudgetCard;
