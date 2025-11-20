import { useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import OfficeService from '@/services/officeService';
import ActivityDetailModal from './ActivityDetailModal';

/**
 * Reusable Office Projects Component
 * Displays programs and activities in a grid card layout
 */
export default function OfficeReports({ officeId, officeColor = '#4D49FC', basePath }) {
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedActivityId, setSelectedActivityId] = useState(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch projects data (programs and activities)
  const { data: projectsData, isLoading } = useQuery({
    queryKey: ['office-projects', officeId],
    queryFn: () => OfficeService.getOfficeReports(officeId),
    enabled: !!officeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch detailed activity data when an activity is selected
  const { data: selectedActivity } = useQuery({
    queryKey: ['activity', selectedActivityId],
    queryFn: () => OfficeService.getActivity(selectedActivityId),
    enabled: !!selectedActivityId,
  });

  // Toggle delete mode
  const toggleDeleteMode = () => {
    setDeleteMode(!deleteMode);
    setSelectedItems([]); // Clear selections when toggling
  };

  // Toggle item selection
  const toggleItemSelection = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Handle delete selected items
  const handleDelete = async () => {
    if (selectedItems.length === 0) return;

    // Show confirmation dialog
    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedItems.length} item${selectedItems.length > 1 ? 's' : ''}?`
    );

    if (confirmed) {
      try {
        // Call API to delete items
        await OfficeService.deleteActivities(selectedItems);
        
        // Invalidate and refetch the projects data
        queryClient.invalidateQueries(['office-projects', officeId]);
        
        // Show success message
        const itemCount = selectedItems.length;
        alert(` Successfully deleted ${itemCount} item${itemCount > 1 ? 's' : ''}!`);
        
        // Clear selections and exit delete mode
        setSelectedItems([]);
        setDeleteMode(false);
      } catch (error) {
        console.error('Error deleting activities:', error);
        alert('Failed to delete activities. Please try again.');
      }
    }
  };

  // Transform data into projects format
  const projects = projectsData?.recent_activities?.map((activity) => {
    const program = activity.programs;
    
    return {
      id: activity.id,
      programId: program?.id,
      programTitle: program?.title || 'Program',
      activityName: activity.activity_name || 'Activity',
      image: activity.image_url || '/reports/default.webp',
      status: activity.status,
      startDate: activity.start_date,
      endDate: activity.end_date,
    };
  }) || [];

  // Handle clicking on a project card
  const handleProjectClick = (projectId) => {
    if (!deleteMode) {
      setSelectedActivityId(projectId);
    }
  };

  // Close the activity detail modal
  const closeModal = () => {
    setSelectedActivityId(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <div 
            className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: officeColor, borderTopColor: 'transparent' }}
          ></div>
          <p className="text-sm text-gray-500">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Activity Detail Modal */}
      {selectedActivityId && selectedActivity && (
        <ActivityDetailModal
          activity={selectedActivity}
          onClose={closeModal}
          officeColor={officeColor}
          basePath={basePath}
        />
      )}

      <div className="h-full flex flex-col" style={{ fontFamily: 'Inter, sans-serif' }}>
        {/* Projects Grid with Action Buttons on Right */}
      {projects.length > 0 ? (
        <div className="flex gap-4 h-full">
          {/* Grid Container - Full Height with padding to prevent border cutoff */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 auto-rows-min content-start overflow-auto p-1">
            {projects.map((project) => {
              const isSelected = selectedItems.includes(project.id);
              
              return (
                <div 
                  key={project.id}
                  className="relative rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-all duration-200 shadow-lg h-52"
                  style={{
                    border: deleteMode ? '2px solid #EF5350' : '2px solid transparent',
                  }}
                  onClick={() => deleteMode ? toggleItemSelection(project.id) : handleProjectClick(project.id)}
                >
                  {/* Checkbox in Delete Mode */}
                  {deleteMode && (
                    <div className="absolute top-2 right-2 z-10">
                      <div 
                        className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                          isSelected 
                            ? 'bg-red-500 border-red-500' 
                            : 'bg-white border-white'
                        }`}
                      >
                        {isSelected && (
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Background Image */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ 
                      backgroundImage: `url(${project.image})`,
                      backgroundColor: officeColor 
                    }}
                  />

                  {/* Gradient Overlay - Reversed */}
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-600 to-white/0 to-57% rounded-xl"></div>

                  {/* Content - All at Bottom */}
                  <div className="relative h-full flex flex-col justify-end p-3">
                    {/* Program Type */}
                    <div className="mb-0.5">
                      <span className="text-white text-[0.6rem] font-semibold tracking-wide uppercase truncate block">
                        {project.programTitle}
                      </span>
                    </div>

                    {/* Activity Name */}
                    <div>
                      <h3 className="text-white text-base font-bold uppercase leading-tight truncate">
                        {project.activityName}
                      </h3>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Vertical Action Buttons - Right Side */}
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => navigate(`${basePath}/add-activity`)}
              className="p-3 text-white font-bold hover:opacity-90 transition-opacity shadow-lg flex items-center justify-center"
              style={{ backgroundColor: '#4D49FC', borderRadius: '10px' }}
              title="Create New Project"
            >
              <img src="/icons/add.svg" alt="Add" className="w-5 h-5" />
            </button>
            <button 
              onClick={toggleDeleteMode}
              className="p-2 text-white hover:opacity-90 transition-opacity shadow-lg flex items-center justify-center"
              style={{ 
                backgroundColor: deleteMode ? '#EF5350' : '#4D49FC', 
                borderRadius: '10px' 
              }}
              title={deleteMode ? "Cancel Delete Mode" : "Delete Mode"}
            >
              <img src="/icons/trash.svg" alt="Delete" className="w-4 h-4" />
            </button>
            {deleteMode && selectedItems.length > 0 && (
              <button 
                onClick={handleDelete}
                className="p-2 text-white hover:opacity-90 transition-opacity shadow-lg flex items-center justify-center"
                style={{ backgroundColor: '#EF5350', borderRadius: '10px' }}
                title={`Delete ${selectedItems.length} item${selectedItems.length > 1 ? 's' : ''}`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            )}
            <button 
              className="p-2 text-white hover:opacity-90 transition-opacity shadow-lg flex items-center justify-center"
              style={{ backgroundColor: '#4D49FC', borderRadius: '10px' }}
              title="Refresh"
            >
              <img src="/icons/refresh.svg" alt="Refresh" className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6" 
               style={{ backgroundColor: `${officeColor}15` }}>
            <svg 
              className="w-12 h-12" 
              style={{ color: officeColor }}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Projects Yet</h3>
          <p className="text-gray-500 text-center max-w-md">
            Start creating projects to see them here.
          </p>
        </div>
      )}
      </div>
    </>
  );
}

OfficeReports.propTypes = {
  officeId: PropTypes.string.isRequired,
  officeColor: PropTypes.string,
  basePath: PropTypes.string.isRequired,
};

