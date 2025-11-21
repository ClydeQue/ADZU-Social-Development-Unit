import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import UnitDirectorService from '@/services/unitDirectorService';
import { getOfficeLogo } from '@/utils/officeLogos';
import { getSDGIcons } from '@/utils/sdgData';

/**
 * Report Detail Modal Component
 * Displays detailed information about a submitted report in a centered floating modal
 * Uses the same design as ActivityDetailModal but with report-specific data
 */
export default function ReportDetailModal({ report, activity, onClose }) {
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState(activity?.status || 'pending');

  // Parse venue from JSON string
  let venueData = { street: '', barangay: '', city: '', province: '' };
  if (activity?.venue) {
    try {
      venueData = typeof activity.venue === 'string' ? JSON.parse(activity.venue) : activity.venue;
    } catch (e) {
      console.error('Error parsing venue:', e);
    }
  }

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: (newStatus) => UnitDirectorService.updateActivityStatus(activity.id, newStatus),
    onSuccess: () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries(['activity', activity.id]);
      queryClient.invalidateQueries(['unit-director-activities']);
      alert('Status updated successfully!');
    },
    onError: (error) => {
      console.error('Update status error:', error);
      alert(`Failed to update status: ${error.response?.data?.error || error.message}`);
      // Reset to original status on error
      setSelectedStatus(activity?.status || 'pending');
    },
  });

  const handleStatusChange = (newStatus) => {
    if (newStatus === selectedStatus) return;
    
    if (confirm(`Change activity status to "${newStatus}"?`)) {
      setSelectedStatus(newStatus);
      updateStatusMutation.mutate(newStatus);
    }
  };

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

  if (!report || !activity) return null;

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

  // Format budget
  const formatBudget = (amount) => {
    if (!amount && amount !== 0) return '₱ 0.00';
    return `₱ ${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const sdgs = getSDGIcons(activity.sdg_number);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', overflow: 'hidden' }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      {/* Modal Container */}
      <div 
        className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        {/* Header Section with Program Logo/Image */}
        <div 
          className="relative p-3 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:justify-between"
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
                {getOfficeLogo(report.office) && (
                  <img 
                    src={getOfficeLogo(report.office)} 
                    alt={report.office}
                    className="w-5 h-5 object-contain"
                  />
                )}
                <span className="text-[#4D49FC] text-sm font-bold uppercase tracking-wider">
                  {report.office}
                </span>
              </div>
              <h2 className="text-[#4D49FC] w-80 lg:w-100 text-xl sm:text-3xl font-black mb-2 leading-tight uppercase">
                {activity.activity_name}
              </h2>
              <div className="text-[#040195] text-xs sm:text-sm font-semibold mb-1">
                {report.program}
              </div>
              <p className="text-[#040195] text-xs leading-relaxed line-clamp-2 sm:line-clamp-none">
                {activity.description || 'Activity description'}
              </p>
            </div>
          </div>

          {/* Status Badge and Dates */}
          <div className="sm:absolute sm:top-6 sm:right-6 w-full sm:w-auto mt-3 sm:mt-0">
            <div className={`px-3 sm:px-4 py-1.5 sm:py-0 rounded-full text-center mb-2 ${getStatusStyle(activity.status).bg}`}>
              <span className={`text-xs font-bold uppercase tracking-wider ${getStatusStyle(activity.status).text}`}>
                {activity.status || 'NO STATUS'}
              </span>
            </div>
            <div className="text-[#040195] text-xs">
              <div className="space-y-1">
                <div className="flex items-center">
                  <span className="font-semibold">SUBMITTED</span>
                  <span className="mx-2">:</span>
                  <span>{report.submitted}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold">DUE DATE</span>
                  <span className="mx-2">:</span>
                  <span>{report.due}</span>
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
                {activity.objectives || 'No objectives specified'}
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
                    {report.participants || activity.participants_count || (activity.male_participants || 0) + (activity.female_participants || 0)}
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
                      <span className="italic ml-2">({activity.partner_type})</span>
                    )}
                    {activity.partner_nature && (
                      <span className="ml-2">- {activity.partner_nature}</span>
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
            {activity.budget_amount ? (
              <div className="text-[#040195] text-xs leading-relaxed flex items-center">
                <span className="flex-1 text-left">{formatBudget(activity.budget_amount)}</span>
                <span className="italic flex-1 text-left">
                  ({activity.budget_type === 'external' ? 'External Fund' : 'Internal Fund'})
                </span>
              </div>
            ) : (
              <>
                {(activity.allocated_budget > 0 || activity.liquidated_budget > 0 || report.budget > 0) ? (
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
                    {!activity.allocated_budget && !activity.liquidated_budget && report.budget > 0 && (
                      <div className="flex items-center">
                        <span className="flex-1 text-left">{formatBudget(report.budget)}</span>
                        <span className="italic flex-1 text-left">Total Budget</span>
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
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                VIEW FULL REPORT
              </a>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-[#040195] p-2 flex justify-between items-center gap-3">
          {/* Status Dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-bold text-[#040195]">
              Mark Status:
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={updateStatusMutation.isPending}
              className="px-3 py-2 border-2 border-gray-300 rounded-lg text-sm font-semibold text-[#040195] 
              focus:border-[#4D49FC] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            {updateStatusMutation.isPending && (
              <span className="text-xs text-gray-500">Updating...</span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 sm:px-5 py-2 bg-gray-200 text-[#040195] text-xs sm:text-sm font-bold hover:bg-gray-300 transition-colors 
              rounded-xl shadow-md flex items-center gap-2"
            >
              CLOSE
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 sm:px-5 py-2 text-white text-xs sm:text-sm font-bold hover:opacity-90 transition-opacity 
              rounded-xl shadow-xl flex items-center gap-2"
              style={{ backgroundColor: "#4D49FC" }}
            >
              PRINT REPORT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

ReportDetailModal.propTypes = {
  report: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    office: PropTypes.string.isRequired,
    program: PropTypes.string.isRequired,
    activity: PropTypes.string.isRequired,
    due: PropTypes.string.isRequired,
    submitted: PropTypes.string.isRequired,
    participants: PropTypes.number,
    budget: PropTypes.number,
  }).isRequired,
  activity: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  officeColor: PropTypes.string,
};
