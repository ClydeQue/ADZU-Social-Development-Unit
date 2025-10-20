import PropTypes from 'prop-types';
import { TrendingUp as TrendingUpIcon } from '@mui/icons-material';

/**
 * Office Stats Card Component
 * Displays statistics for office dashboard
 * Matches the design from Unit Director Dashboard
 */
export default function OfficeStatsCard({ 
  title, 
  count, 
  subtitle,
  trend,
  variant = 'filled', // 'filled' or 'outlined'
  bgColor = '#1E22AA',
  textColor = '#FFFFFF'
}) {
  const isFilled = variant === 'filled';

  return (
    <div className="flex flex-col min-h-[150px] sm:min-h-[180px]">
      <div 
        className={`rounded-2xl sm:rounded-3xl flex-1 shadow-none overflow-hidden ${
          isFilled ? '' : 'border border-[#E5E7EB]'
        }`}
        style={{ 
          backgroundColor: isFilled ? bgColor : '#FFFFFF',
          color: isFilled ? textColor : '#1E22AA'
        }}
      >
        <div className="p-3 sm:p-4 h-full flex flex-col justify-between">
          {/* Header */}
          <div className="flex justify-between items-center mb-1 flex-shrink-0">
            <h6 className="text-lg sm:text-xl md:text-[1.5rem] font-bold leading-[1]">
              {title}
            </h6>
            <button className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center transition-colors flex-shrink-0">
              <img 
                src="/icons/arrow_diagonal.svg" 
                alt="View" 
                className={`w-8 h-8 sm:w-10 sm:h-10 ${isFilled ? 'brightness-0 invert' : ''}`}
              />
            </button>
          </div>

          {/* Count */}
          <h4 
            className="text-3xl sm:text-4xl md:text-[2.5rem] font-bold leading-[1] my-1 flex-shrink-0"
            style={{ color: isFilled ? textColor : '#5B6FED' }}
          >
            {count}
          </h4>

          {/* Trend or Subtitle */}
          {trend ? (
            <div className="flex items-center gap-1.5 rounded-md px-2 py-1 w-fit flex-shrink-0">
              <TrendingUpIcon 
                sx={{ fontSize: { xs: 10, sm: 12 } }} 
                className="text-[#5B6FED]" 
              />
              <span 
                className="text-[0.6rem] sm:text-[0.7rem]"
                style={{ color: isFilled ? '#C7D2FE' : '#5B6FED' }}
              >
                {trend}
              </span>
            </div>
          ) : (
            <span 
              className="text-[0.65rem] sm:text-[0.75rem] flex-shrink-0"
              style={{ color: isFilled ? textColor : '#5B6FED' }}
            >
              {subtitle}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

OfficeStatsCard.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  subtitle: PropTypes.string,
  trend: PropTypes.string,
  variant: PropTypes.oneOf(['filled', 'outlined']),
  bgColor: PropTypes.string,
  textColor: PropTypes.string,
};
