import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import OfficeService from '@/services/officeService';
import PropTypes from 'prop-types';

/**
 * Edit Activity Form Component
 * Pre-fills form with existing activity data and allows updates
 */
export default function EditActivityForm({ officeId, basePath, officeColor = '#4D49FC' }) {
  const { activityId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch activity data
  const { data: activity, isLoading: activityLoading } = useQuery({
    queryKey: ['activity', activityId],
    queryFn: () => OfficeService.getActivity(activityId),
    enabled: !!activityId,
  });

  // Fetch programs for this office
  const { data: programs = [], isLoading: programsLoading } = useQuery({
    queryKey: ['office-programs', officeId],
    queryFn: () => OfficeService.getOfficePrograms(officeId),
    enabled: !!officeId,
    staleTime: 5 * 60 * 1000,
  });

  const [formData, setFormData] = useState({
    activity_name: '',
    program_id: '',
    start_date: '',
    end_date: '',
    participants_count: '',
    venue: '',
    objectives: '',
    implementing_partners: '',
    budget: '',
    sdg_number: '',
    status: '',
    notes: '',
    allocated_budget: '',
    liquidated_budget: '',
    partner_name: '',
    partner_type: '',
    partner_nature: '',
    venue_street: '',
    venue_barangay: '',
    venue_city: '',
    venue_province: '',
  });

  // Update form when activity data loads
  useEffect(() => {
    if (activity) {
      setFormData({
        activity_name: activity.activity_name || '',
        program_id: activity.program_id || '',
        start_date: activity.start_date || '',
        end_date: activity.end_date || '',
        participants_count: activity.participants_count || '',
        venue: activity.venue || '',
        objectives: activity.objectives || '',
        implementing_partners: activity.implementing_partners || '',
        budget: activity.budget || '',
        sdg_number: activity.sdg_number || '',
        status: activity.status || 'pending',
        notes: activity.notes || '',
        allocated_budget: activity.allocated_budget || '',
        liquidated_budget: activity.liquidated_budget || '',
        partner_name: activity.partner_name || '',
        partner_type: activity.partner_type || '',
        partner_nature: activity.partner_nature || '',
        venue_street: activity.venue_street || '',
        venue_barangay: activity.venue_barangay || '',
        venue_city: activity.venue_city || '',
        venue_province: activity.venue_province || '',
      });
    }
  }, [activity]);

  // Mutation for updating activity
  const updateMutation = useMutation({
    mutationFn: (data) => {
      console.log('Sending update data:', data);
      return OfficeService.updateActivity(activityId, data);
    },
    onSuccess: (response) => {
      console.log('Update successful:', response);
      queryClient.invalidateQueries(['office-projects', officeId]);
      queryClient.invalidateQueries(['activity', activityId]);
      alert('Activity updated successfully!');
      navigate(`${basePath}/projects`);
    },
    onError: (error) => {
      console.error('Update error:', error);
      console.error('Error response:', error.response?.data);
      alert(`Failed to update activity: ${error.response?.data?.details || error.message}`);
    },
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Convert budget values for validation
    const allocatedBudget = formData.allocated_budget ? parseFloat(formData.allocated_budget) : 0;
    const liquidatedBudget = formData.liquidated_budget ? parseFloat(formData.liquidated_budget) : 0;

    // Validate budget constraint: liquidated must not exceed allocated
    if (liquidatedBudget > allocatedBudget) {
      alert('Liquidated budget cannot exceed allocated budget');
      return;
    }

    // Prepare data with proper type conversions
    const submitData = {
      ...formData,
      participants_count: formData.participants_count ? parseInt(formData.participants_count) : 0,
      budget: formData.budget ? parseFloat(formData.budget) : null,
      allocated_budget: allocatedBudget,
      liquidated_budget: liquidatedBudget,
      sdg_number: formData.sdg_number ? parseInt(formData.sdg_number) : null,
    };

    console.log('Submitting form data:', submitData);
    updateMutation.mutate(submitData);
  };

  const handleCancel = () => {
    navigate(`${basePath}/projects`);
  };

  if (activityLoading || programsLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-3">
          <div 
            className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: officeColor, borderTopColor: 'transparent' }}
          ></div>
          <p className="text-sm text-gray-500">Loading activity...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-3 overflow-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-black" style={{ color: officeColor, fontFamily: 'Inter, sans-serif' }}>
            Edit Activity
          </h1>
          
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors"
            >
              CANCEL
            </button>

            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="px-6 py-2 text-white rounded-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
              style={{ backgroundColor: officeColor }}
            >
              {updateMutation.isPending ? 'UPDATING...' : 'UPDATE'}
            </button>
          </div>
        </div>

        <p className="text-xs text-gray-400 text-right mb-4">
          LAST UPDATED | {activity?.updated_at ? new Date(activity.updated_at).toLocaleString() : 'N/A'}
        </p>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Fields */}
          <div className="lg:col-span-2 space-y-4">
            {/* Activity Name */}
            <div>
              <label className="block text-sm font-bold text-[#040195] mb-2">
                Activity Name *
              </label>
              <input
                type="text"
                value={formData.activity_name}
                onChange={(e) => handleInputChange('activity_name', e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#4D49FC] focus:outline-none"
                placeholder="Enter activity name"
                required
              />
            </div>

            {/* Program Selection */}
            <div>
              <label className="block text-sm font-bold text-[#040195] mb-2">
                Program *
              </label>
              <select
                value={formData.program_id}
                onChange={(e) => handleInputChange('program_id', e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#4D49FC] focus:outline-none"
                required
              >
                <option value="">Select a program</option>
                {programs.map((program) => (
                  <option key={program.id} value={program.id}>
                    {program.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-[#040195] mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => handleInputChange('start_date', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#4D49FC] focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#040195] mb-2">
                  End Date *
                </label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => handleInputChange('end_date', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#4D49FC] focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Objectives */}
            <div>
              <label className="block text-sm font-bold text-[#040195] mb-2">
                Objectives
              </label>
              <textarea
                value={formData.objectives}
                onChange={(e) => handleInputChange('objectives', e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#4D49FC] focus:outline-none"
                rows="4"
                placeholder="Enter activity objectives"
              />
            </div>

            {/* Venue */}
            <div>
              <label className="block text-sm font-bold text-[#040195] mb-2">
                Venue
              </label>
              <input
                type="text"
                value={formData.venue}
                onChange={(e) => handleInputChange('venue', e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#4D49FC] focus:outline-none"
                placeholder="Enter venue location"
              />
            </div>

            {/* Participants */}
            <div>
              <label className="block text-sm font-bold text-[#040195] mb-2">
                Number of Participants
              </label>
              <input
                type="number"
                value={formData.participants_count}
                onChange={(e) => handleInputChange('participants_count', e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#4D49FC] focus:outline-none"
                placeholder="Enter participant count"
                min="0"
              />
            </div>
          </div>

          {/* Right Column - Additional Info */}
          <div className="space-y-4">
            {/* Status */}
            <div>
              <label className="block text-sm font-bold text-[#040195] mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#4D49FC] focus:outline-none"
              >
                <option value="pending">Pending</option>
                <option value="in progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-sm font-bold text-[#040195] mb-2">
                Budget
              </label>
              <input
                type="number"
                value={formData.budget}
                onChange={(e) => handleInputChange('budget', e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#4D49FC] focus:outline-none"
                placeholder="Enter budget amount"
                min="0"
                step="0.01"
              />
            </div>

            {/* SDG Number */}
            <div>
              <label className="block text-sm font-bold text-[#040195] mb-2">
                SDG Number
              </label>
              <input
                type="number"
                value={formData.sdg_number}
                onChange={(e) => handleInputChange('sdg_number', e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#4D49FC] focus:outline-none"
                placeholder="Enter SDG number (1-17)"
                min="1"
                max="17"
              />
            </div>

            {/* Implementing Partners */}
            <div>
              <label className="block text-sm font-bold text-[#040195] mb-2">
                Implementing Partners
              </label>
              <textarea
                value={formData.implementing_partners}
                onChange={(e) => handleInputChange('implementing_partners', e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#4D49FC] focus:outline-none"
                rows="3"
                placeholder="Enter partners (comma separated)"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-bold text-[#040195] mb-2">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#4D49FC] focus:outline-none"
                rows="4"
                placeholder="Enter additional notes"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

EditActivityForm.propTypes = {
  officeId: PropTypes.string.isRequired,
  basePath: PropTypes.string.isRequired,
  officeColor: PropTypes.string,
};
