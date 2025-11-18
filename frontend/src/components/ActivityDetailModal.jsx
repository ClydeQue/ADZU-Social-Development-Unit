import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getOfficeLogo } from '@/utils/officeLogos';

/**
 * Activity Detail Modal Component
 * Displays detailed information about an activity in a centered floating modal
 * Design based on the provided mockup with blue header and clean layout
 */
export default function ActivityDetailModal({ activity, onClose, officeColor = '#4D49FC', basePath }) {
  const navigate = useNavigate();

  // Debug: Log activity data structure
  useEffect(() => {
    if (activity) {
      console.log('Activity data:', activity);
      console.log('Programs data:', activity.programs);
      console.log('Office acronym:', activity.programs?.offices?.acronym);
    }
  }, [activity]);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!activity) return null;

  const handleEdit = () => {
    navigate(`${basePath}/edit-activity/${activity.id}`);
  };

  // Get status badge colors
  const getStatusStyle = (status) => {
    const statusLower = status?.toLowerCase();
    
    switch (statusLower) {
      case 'pending':
        return { bg: 'bg-yellow-100', text: 'text-yellow-700' };
      case 'in progress':
      case 'in-progress':
        return { bg: 'bg-blue-100', text: 'text-blue-700' };
      case 'completed':
        return { bg: 'bg-green-100', text: 'text-green-700' };
      default:
        return { bg: 'bg-gray-100', text: 'text-[#040195]' };
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

  // Get SDG icons
  const getSDGIcons = (sdgNumber) => {
    if (!sdgNumber) return [];
    // Handle both single number and array
    const sdgNumbers = Array.isArray(sdgNumber) ? sdgNumber : [sdgNumber];
    return sdgNumbers.map(num => ({
      number: num,
      icon: `/icons/sdg-${num}.svg` // You can add SDG icons to your public/icons folder
    }));
  };

  const sdgs = getSDGIcons(activity.sdg_number);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      {/* Modal Container */}
      <div 
        className="bg-white rounded-2xl p-5 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        {/* Header Section with Program Logo/Image */}
        <div 
          className="relative p-6 flex items-center justify-between"
        >
          <div className="flex items-center gap-6">
            {/* Logo/Icon Container */}
            <div className="w-32 h-32 bg-white rounded-lg flex items-center justify-center shadow-lg overflow-hidden">
              {activity.image_url ? (
                <img 
                  src={activity.image_url} 
                  alt={activity.activity_name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className="w-full h-full flex items-center justify-center"
                style={{ display: activity.image_url ? 'none' : 'flex' }}
              >
                <span className="text-6xl font-black" style={{ color: officeColor }}>
                  #
                </span>
              </div>
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
              <h2 className="text-[#4D49FC] text-3xl font-black mb-2 leading-tight uppercase">
                {activity.activity_name}
              </h2>
              <div className="text-[#040195] text-sm font-semibold mb-1">
                {activity.programs?.title || 'Program Title'}
              </div>
              <p className="text-[#040195] text-xs leading-relaxed">
                {activity.objectives || 'Activity description'}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="absolute top-6 right-6">
            <div className={`px-4  rounded-full text-center mb-2 ${getStatusStyle(activity.status).bg}`}>
              <span className={`text-xs font-bold uppercase tracking-wider ${getStatusStyle(activity.status).text}`}>
                {activity.status || 'NO STATUS'}
              </span>
            </div>
            <div className="text-[#040195] text-xs">
              <div className="space-y-1">
                <div className="flex items-center">
                  <span className="font-semibold">INCEPTION</span>
                  <span className="mx-2">:</span>
                  <span>{formatDate(activity.start_date)}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold">IMPLEMENTATION</span>
                  <span className="mx-2">:</span>
                  <span>{formatDate(activity.end_date)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Thick Rounded Divider */}
        <div className="mx-6 my-4 h-1 bg-[#040195] rounded-full"></div>

        {/* Content Section */}
        <div className="p-6 pt-0">
          {/* Row 1: Objectives (Left) and SDG Goals (Right) */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="col-span-2">
              <h3 className="text-sm font-bold text-[#040195] mb-2 uppercase">OBJECTIVES</h3>
              <p className="text-[#040195] text-sm leading-relaxed">
                {activity.objectives || 'To provide voters with insightful, in-depth information on candidates\' visions, plans, solutions for ZC\'s issues.'}
              </p>
            </div>
            
            {/* SDG Goals - Right Side */}
            {sdgs.length > 0 && (
              <div className="border-l-2 border-[#040195] pl-6">
                <h3 className="text-sm font-bold text-[#040195] mb-3 uppercase">SDG Goals</h3>
                <div className="flex gap-2 flex-wrap">
                  {sdgs.map((sdg) => (
                    <div 
                      key={sdg.number}
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-lg"
                      style={{ backgroundColor: officeColor }}
                      title={`SDG ${sdg.number}`}
                    >
                      {sdg.number}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <hr className="my-6 border-[#040195]" />

          {/* Row 2: Three Columns - Venue, Participant Demographics, Sex */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            {/* Column 1: Venue */}
            <div>
              <h3 className="text-sm font-bold text-[#040195] mb-2 uppercase">VENUE</h3>
              <div className="text-[#040195] text-xs leading-relaxed">
                {activity.venue_street && <div>{activity.venue_street}</div>}
                {activity.venue_barangay && <div>Zone {activity.venue_barangay}</div>}
                {activity.venue_city && <div>{activity.venue_city}</div>}
                {activity.venue_province && <div>{activity.venue_province}</div>}
                {!activity.venue_street && !activity.venue_barangay && !activity.venue_city && !activity.venue_province && (
                  <div className="text-gray-400">No venue information</div>
                )}
              </div>
            </div>

            {/* Column 2: Participant Demographics */}
            <div>
              <h3 className="text-sm font-bold text-[#040195] mb-2 uppercase">PARTICIPANT DEMOGRAPHICS</h3>
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
            <div className="border-l-2 border-[#040195] pl-6">
              <h3 className="text-sm font-bold text-[#040195] mb-2 uppercase">SEX</h3>
              <div className="text-[#040195] text-xs leading-relaxed space-y-1">
                <div className="flex items-start">
                  <span className="font-semibold flex-1 text-left">MALE</span>
                  <span className="mx-2">:</span>
                  <span className="flex-1 text-left">
                    {activity.male_participants || 0}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold flex-1 text-left">FEMALE</span>
                  <span className="mx-2">:</span>
                  <span className="flex-1 text-left">
                    {activity.female_participants || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <hr className="my-6 border-[#040195]" />

          {/* Row 3: Partners */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-[#040195] mb-2 uppercase">PARTNERS</h3>
            {(activity.partner_name || activity.implementing_partners) ? (
              <div className="text-[#040195] text-xs leading-relaxed">
                {activity.partner_name ? (
                  <div>
                    {activity.partner_name}
                    {activity.partner_type && (
                      <span className="italic ml-2">({activity.partner_type})</span>
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

          <hr className="my-6 border-[#040195]" />

          {/* Row 4: Budget Overview */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-[#040195] mb-2 uppercase">BUDGET OVERVIEW</h3>
            {activity.budget_amount ? (
              <div className="text-[#040195] text-xs leading-relaxed flex items-center">
                <span className="flex-1 text-left">{formatBudget(activity.budget_amount)}</span>
                <span className="italic flex-1 text-left">
                  ({activity.budget_type === 'external' ? 'External Fund' : 'Internal Fund'})
                </span>
              </div>
            ) : (
              <>
                {(activity.allocated_budget > 0 || activity.liquidated_budget > 0) ? (
                  <div className="text-[#040195] text-xs leading-relaxed w-80 space-y-1">
                    {activity.allocated_budget > 0 && (
                      <div className="flex items-center">
                        <span className="flex-1 text-left">{formatBudget(activity.allocated_budget)}</span>
                        <span className="italic flex-1 text-left">External Fund</span>
                      </div>
                    )}
                    {activity.liquidated_budget > 0 && (
                      <div className="flex items-center">
                        <span className="flex-1 text-left">{formatBudget(activity.liquidated_budget)}</span>
                        <span className="italic flex-1 text-left">Internal Fund</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-gray-400 text-xs">No budget information</div>
                )}
              </>
            )}
          </div>

          {/* Notes - Optional Row */}
          {activity.notes && (
            <>
              <hr className="my-6 border-[#040195]" />
              <div className="mb-6">
                <h3 className="text-sm font-bold text-[#040195] mb-2 uppercase">NOTES</h3>
                <p className="text-[#040195] text-xs leading-relaxed">
                  {activity.notes}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className=" border-[#040195] p-2 flex justify-end">
          <button
            onClick={handleEdit}
            className="px-5 py-2 text-white font-bold hover:opacity-90 transition-opacity 
            rounded-xl shadow-xl flex items-center gap-2"
            style={{ backgroundColor: "#4D49FC" }}
          >
            VIEW FULL REPORT
          </button>
        </div>
      </div>
    </div>
  );
}

ActivityDetailModal.propTypes = {
  activity: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  officeColor: PropTypes.string,
  basePath: PropTypes.string.isRequired,
};
