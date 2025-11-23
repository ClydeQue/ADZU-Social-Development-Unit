import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getOfficeLogo } from '@/utils/officeLogos';
import { getSDGIcons } from '@/utils/sdgData';


/**
 * Activity Detail Modal Component
 * Displays detailed information about an activity in a centered floating modal
 * Design based on the provided mockup with blue header and clean layout
 */
export default function ActivityDetailModal({ activity, onClose, onDelete, basePath }) {
  const navigate = useNavigate();

  // Listen for escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!activity) return null;

  // Parse venue from JSON string
  let venueData = { street: '', barangay: '', city: '', province: '' };
  if (activity.venue) {
    try {
      venueData = typeof activity.venue === 'string' ? JSON.parse(activity.venue) : activity.venue;
    } catch (e) {
      console.error('Error parsing venue:', e);
    }
  }

  const handleEdit = () => {
    navigate(`${basePath}/edit-activity/${activity.id}`);
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${activity.activity_name}"?`)) {
      if (onDelete) {
        await onDelete(activity.id);
        onClose();
      }
    }
  };

  // Get status badge colors
  const getStatusStyle = (status) => {
    const statusLower = status?.toLowerCase();
    
    switch (statusLower) {
      case 'pending':
        return { bg: 'bg-[#4D49FC]', text: 'text-white', border: 'border-2 border-[#4D49FC]' };
      case 'in progress':
      case 'in-progress':
        return { bg: 'bg-[#FFAE00]', text: 'text-white', border: 'border-2 border-[#4D49FC]' };
      case 'completed':
        return { bg: 'bg-[#18B703]', text: 'text-white', border: 'border-2 border-[#4D49FC]' };
      case 'cancelled':
        return { bg: 'bg-[#FF0022]', text: 'text-white', border: 'border-2 border-[#4D49FC]' };
      default:
        return { bg: 'bg-gray-100', text: 'text-[#040195]', border: 'border-2 border-[#4D49FC]' };
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Format budget
  const formatBudget = (amount) => {
    if (!amount && amount !== 0) return '₱ 0.00';
    return `₱ ${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Parse SDG numbers from sdg_number column (stores JSON array)
  let sdgNumbers = [];
  try {
    if (activity.sdg_number) {
      // sdg_number now stores JSON array of SDG numbers
      sdgNumbers = typeof activity.sdg_number === 'string' ? JSON.parse(activity.sdg_number) : 
                   (Array.isArray(activity.sdg_number) ? activity.sdg_number : [activity.sdg_number]);
    }
  } catch (e) {
    console.error('Error parsing SDG numbers:', e);
    // Fallback if parsing fails
    if (activity.sdg_number && !isNaN(activity.sdg_number)) {
      sdgNumbers = [parseInt(activity.sdg_number)];
    }
  }
  
  // Get icons for all SDGs
  const sdgs = sdgNumbers.flatMap(num => getSDGIcons(num));

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
      style={{ backgroundColor: 'rgba(4, 1, 149, 0.4)', overflow: 'hidden' }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      {/* Modal Container */}
      <div 
        className="bg-[#fafafa] rounded-xl sm:rounded-2xl p-3 sm:p-5  shadow-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        {/* Action Buttons at Top */}
        <div className="flex  items-center justify-end gap-2  ">
          {/* Delete Button */}
          <button
            onClick={handleDelete}
            className="w-10 h-10 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl
             hover:bg-[#bc3d2c] active:bg-[#9b2c1a] hover:cursor-pointer transition-colors bg-[#4D49FC]"

            title="Delete Activity"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
          
          {/* Edit Button */}
          <button
            onClick={handleEdit}
            className="px-4 py-2 flex items-center justify-center rounded-xl hover:opacity-90 hover:cursor-pointer transition-opacity
            bg-[#4D49FC]  text-white text-sm font-bold"
            title="Edit Activity"
          >
            EDIT
          </button>
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-10 h-10 sm:w-8 sm:h-8 flex ml-2 items-center justify-center rounded-full 
            bg-white ring-3 ring-[#4D49FC] hover:cursor-pointer hover:bg-gray-300 transition-colors"
            title="Close"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#4D49FC]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Header Section with Program Logo/Image */}
        <div 
          className="relative sm:p-2 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:justify-between"
        >
          <div className="flex items-center gap-3 sm:gap-6 w-full sm:w-auto">
            {/* Logo/Icon Container */}
            <div className="w-20 h-20 sm:w-32 sm:h-32 bg-gray-100 rounded-lg flex items-center justify-center shadow-lg overflow-hidden flex-shrink-0">
              <img 
                src={activity.image_url || '/reports/default.webp'} 
                alt={activity.activity_name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/reports/default.webp';
                }}
              />
            </div>

            {/* Program Title and Description */}
            <div className="flex-1">
              <div className="flex items-center gap-1">
                {getOfficeLogo(activity.programs?.offices?.acronym) && (
                  <img 
                    src={getOfficeLogo(activity.programs?.offices?.acronym)} 
                    alt={activity.programs?.offices?.acronym}
                    className="w-5 h-5 object-contain"
                  />
                )}
                <span className="text-[#4D49FC] text-sm font-bold uppercase tracking-wider">
                  {activity.programs?.offices?.acronym || activity.programs?.offices?.name || 'Office'}
                </span>
              </div>
              <h2 className="text-[#4D49FC]  w-80 lg:w-100  text-xl sm:text-3xl font-black mb-2 leading-tight uppercase">
                {activity.activity_name}
              </h2>
              <div className="text-[#040195] text-xs sm:text-sm font-semibold mb-1">
                {activity.programs?.title || 'Program Title'}
              </div>
              <p className="text-[#040195] text-xs leading-relaxed line-clamp-2 sm:line-clamp-none">
                {activity.description || 'Activity description'}
              </p>
            </div>
          </div>

          {/* Status Badge and Dates */}
          <div className="w-full sm:w-auto mt-3 sm:mt-0">
            <div className={`w-full sm:w-56 px-3 sm:px-4 py-1.5 sm:py-1.5 rounded-full text-center mb-2 ${getStatusStyle(activity.status).bg} ${getStatusStyle(activity.status).border}`}>
              <span className={`text-xs font-bold uppercase tracking-wider ${getStatusStyle(activity.status).text}`}>
                {activity.status || 'NO STATUS'}
              </span>
            </div>
            <div className="text-[#040195] text-xs w-full sm:w-56">
              <div className="space-y-1">
                <div className="flex items-center">
                  <span className="font-semibold">INCEPTION</span>
                  <span className="flex-1 text-center">:</span>
                  <span>{formatDate(activity.start_date)}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold">IMPLEMENTATION</span>
                  <span className="flex-1 text-center">:</span>
                  <span>{formatDate(activity.end_date)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Thick Rounded Divider */}
        <div className="mx-3 sm:mx-6 my-3 sm:my-2 h-1 bg-[#040195] rounded-full"></div>

        {/* Content Section */}
        <div className="p-3 sm:p-6 pt-0">
          {/* Row 1: Objectives (Left) and SDG Goals (Right) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
            <div className="sm:col-span-2">
              <h3 className="text-xs sm:text-sm font-bold text-[#040195] mb-2 uppercase">OBJECTIVES</h3>
              <p className="text-[#040195] text-xs sm:text-sm leading-relaxed">
                {activity.objectives || 'To provide voters with insightful, in-depth information on candidates\' visions, plans, solutions for ZC\'s issues.'}
              </p>
            </div>
            
            {/* SDG Goals - Right Side */}
            {sdgs.length > 0 && (
              <div className="sm:border-l-2 border-t-2 sm:border-t-0 border-[#040195] pt-4 sm:pt-0 sm:pl-6 mt-4 sm:mt-0">
                <h3 className="text-xs sm:text-sm font-bold text-[#040195] mb-3 uppercase">SDG Goals</h3>
                <div className="flex gap-1.5 flex-wrap">
                  {sdgs.map((sdg) => (
                    <div 
                      key={sdg.id}
                      className="w-12 h-12 rounded-lg overflow-hidden shadow-lg"
                      title={sdg.label}
                    >
                      <img src={sdg.icon} alt={sdg.label} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <hr className="my-4 sm:my-6 border-[#040195]" />

          {/* Row 2: Three Columns - Venue, Participant Demographics, Sex */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
            {/* Column 1: Venue */}
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-[#040195] mb-2 uppercase">VENUE</h3>
              <div className="text-[#040195] text-xs leading-relaxed">
                {venueData.street && <div>{venueData.street}</div>}
                {venueData.barangay && <div>Zone {venueData.barangay}</div>}
                {venueData.city && <div>{venueData.city}</div>}
                {venueData.province && <div>{venueData.province}</div>}
                {!venueData.street && !venueData.barangay && !venueData.city && !venueData.province && (
                  <div className="text-gray-400">No venue information</div>
                )}
              </div>
            </div>

            {/* Column 2: Participant Demographics */}
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-[#040195] mb-2 uppercase">PARTICIPANT DEMOGRAPHICS</h3>
              <div className="text-[#040195] text-xs leading-relaxed space-y-1">
                <div className="flex items-center">
                  <span className="font-semibold flex-1 text-left">TOTAL</span>
                  <span className="mx-2">:</span>
                  <span className="flex-1 text-left">
                    {activity.participants_count || (activity.male_participants || 0) + (activity.female_participants || 0)}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold flex-1 text-left">CLASSIFICATION</span>
                  <span className="mx-2">:</span>
                  <span className="flex-1 text-left">
                    {activity.partner_type || 'General Participants'}
                  </span>
                </div>
              </div>
            </div>

            {/* Column 3: Sex */}
            <div className="sm:border-l-2 border-t-2 sm:border-t-0 border-[#040195] pt-4 sm:pt-0 sm:pl-6 mt-4 sm:mt-0">
              <h3 className="text-xs sm:text-sm font-bold text-[#040195] mb-2 uppercase">SEX</h3>
              <div className="text-[#040195] text-xs leading-relaxed space-y-1">
                <div className="flex items-center">
                  <span className="font-semibold flex-1 text-left">MALE</span>
                  <span className="mx-2">:</span>
                  <span className="flex-2 text-left">
                    {activity.male_participants || 0}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold flex-1 text-left">FEMALE</span>
                  <span className="mx-2">:</span>
                  <span className="flex-2 text-left">
                    {activity.female_participants || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <hr className="my-4 sm:my-6 border-[#040195]" />

          {/* Row 3: Partners */}
          <div className="mb-4 sm:mb-6">
            <h3 className="text-xs sm:text-sm font-bold text-[#040195] mb-2 uppercase">PARTNERS</h3>
            {(activity.partner_name || activity.implementing_partners) ? (
              <div className="text-[#040195] text-xs leading-relaxed">
                {activity.partner_name ? (
                  <div>
                    {activity.partner_name}
                    {activity.partner_type && (
                      <span className="italic ml-2">{activity.partner_type}</span>
                    )}
                    {activity.partner_nature && (
                      <span className="ml-2"> {activity.partner_nature}</span>
                    )}
                  </div>
                ) : (
                  <div>{activity.implementing_partners}</div>
                )}
              </div>
            ) : (
              <div className="text-gray-400 text-xs">No partner information</div>
            )}
              </div>

          <hr className="my-4 sm:my-6 border-[#040195]" />

          {/* Row 4: Budget Overview */}
          <div className="mb-4 sm:mb-6">
            <h3 className="text-xs sm:text-sm font-bold text-[#040195] mb-2 uppercase">BUDGET OVERVIEW</h3>
            {(() => {
              // Parse budgets from budget_amount and budget_type JSON arrays
              let budgets = [];
              try {
                if (activity.budget_amount && activity.budget_type) {
                  const amounts = typeof activity.budget_amount === 'string' ? JSON.parse(activity.budget_amount) : [activity.budget_amount];
                  const types = typeof activity.budget_type === 'string' ? JSON.parse(activity.budget_type) : [activity.budget_type];
                  budgets = amounts.map((amount, index) => ({
                    amount: amount,
                    type: types[index] || 'external'
                  }));
                } else if (activity.budget_amount) {
                  // Single value fallback
                  budgets = [{ amount: activity.budget_amount, type: activity.budget_type || 'external' }];
                }
              } catch (e) {
                console.error('Error parsing budgets:', e);
                // Fallback for non-JSON values
                if (activity.budget_amount) {
                  budgets = [{ amount: activity.budget_amount, type: activity.budget_type || 'external' }];
                }
              }

              return budgets.length > 0 ? (
                <div className="space-y-2">
                  {budgets.map((budget, index) => (
                    <div key={index} className="text-[#040195] text-xs leading-relaxed">
                      <div className="flex items-center gap-4">
                        <span className="font-semibold min-w-[100px]">{formatBudget(budget.amount)}</span>
                        <span className="italic text-gray-600">
                          {budget.type === 'external' ? 'External Fund' : 'Internal Fund'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-400 text-xs">No budget information</div>
              );
            })()}
          </div>

          {/* Notes - Optional Row */}
          {activity.notes && (
            <>
              <hr className="my-4 sm:my-6 border-[#040195]" />
              <div className="mb-4 sm:mb-6">
                <h3 className="text-xs sm:text-sm font-bold text-[#040195] mb-2 uppercase">NOTES</h3>
                <p className="text-[#040195] text-xs leading-relaxed">
                  {activity.notes}
                </p>
              </div>
            </>
          )}

          {/* View Full Report Button */}
          {activity.report_url && (
            <div className="flex justify-end mt-4">
              <a
                href={activity.report_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 bg-[#4D49FC] text-white text-sm font-bold rounded-xl hover:bg-[#3d39cc] hover:cursor-pointer transition-colors flex items-center gap-2 shadow-lg"
              >
                <svg 
                  className="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                VIEW FULL REPORT
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

ActivityDetailModal.propTypes = {
  activity: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  officeColor: PropTypes.string,
  basePath: PropTypes.string.isRequired,
};
