import { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import OfficeService from '@/services/officeService';
import ActivityDetailModal from './ActivityDetailModal';
import CardGridSkeleton from '@/components/CardGridSkeleton';

/**
 * Reusable Office Projects Component
 * Displays programs and activities in a grid card layout
 * Supports filtering by status/phase via sort query parameter
 */
export default function OfficeReports({ officeId, officeColor = '#4D49FC', basePath }) {
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedActivityId, setSelectedActivityId] = useState(null);
  const [sortBy, setSortBy] = useState('');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Set initial sort from URL parameter
  useEffect(() => {
    const sortParam = searchParams.get('sort');
    if (sortParam && ['pending', 'in-progress', 'completed'].includes(sortParam)) {
      setSortBy(sortParam);
    }
  }, [searchParams]);

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

  // Handle delete single activity from modal
  const handleDeleteSingle = async (activityId) => {
    try {
      // Call API to delete single activity
      await OfficeService.deleteActivities([activityId]);
      
      // Invalidate and refetch the projects data
      queryClient.invalidateQueries(['office-projects', officeId]);
      
      // Show success message
      alert('Successfully deleted activity!');
    } catch (error) {
      console.error('Error deleting activity:', error);
      alert('Failed to delete activity. Please try again.');
      throw error; // Re-throw to let modal handle it
    }
  };

  // Transform and filter projects based on sort parameter
  const projects = useMemo(() => {
    const allProjects = projectsData?.recent_activities?.map((activity) => {
      const program = activity.programs;
      
      return {
        id: activity.id,
        programId: program?.id,
        programTitle: program?.title || 'Program',
        activityName: activity.activity_name || 'Activity',
        image: activity.image_url || '/reports/default.webp',
        status: activity.status,
        phase: activity.phase,
        startDate: activity.start_date,
        endDate: activity.end_date,
      };
    }) || [];

    // Apply filter if sort parameter exists
    if (!sortBy) return allProjects;

    return allProjects.filter((project) => {
      if (sortBy === 'completed') {
        return project.status === 'completed';
      } else if (sortBy === 'pending') {
        return project.status === 'pending';
      } else if (sortBy === 'in-progress') {
        // Check if phase matches in-progress criteria
        const phase = project.phase?.toLowerCase();
        return (
          phase === 'in progress' ||
          phase === 'implementation' ||
          phase === 'execution'
        );
      }
      return true;
    });
  }, [projectsData, sortBy]);

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
    return <CardGridSkeleton cards={8} />;
  }

  return (
    <>
      {/* Activity Detail Modal */}
      {selectedActivityId && selectedActivity && (
        <ActivityDetailModal
          activity={selectedActivity}
          onClose={closeModal}
          onDelete={handleDeleteSingle}
          officeColor={officeColor}
          basePath={basePath}
        />
      )}

      <div className="h-full flex flex-col" style={{ fontFamily: 'Inter, sans-serif' }}>
        {/* Sort Dropdown */}
        <div className="flex gap-3 items-center mb-3">
          <div className="relative">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className={`bg-white px-6 py-2.5 pr-10 rounded-full ${showSortDropdown ? 'ring-2 ring-[#4D49FC]' : 'ring-0'} text-sm font-semibold text-[#040195] border-none shadow-md cursor-pointer flex items-center gap-2`}
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <span>
                {sortBy
                  ? sortBy.charAt(0).toUpperCase() + sortBy.slice(1).replace('-', ' ')
                  : 'Sort by'}
              </span>
              <svg
                className={`transition-transform ${showSortDropdown ? 'rotate-180' : ''}`}
                width="9"
                height="8"
                viewBox="0 0 9 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.3316 7.5C4.9467 8.16667 3.98445 8.16667 3.59955 7.5L0.135449 1.5C-0.249451 0.833334 0.231675 0 1.00148 0L7.92968 0C8.69948 0 9.1806 0.833333 8.7957 1.5L5.3316 7.5Z"
                  fill="#040195"
                />
              </svg>
            </button>

            {showSortDropdown && (
              <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-10 overflow-hidden min-w-[200px]">
                {[
                  { value: '', label: 'All Activities' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'in-progress', label: 'In Progress' },
                  { value: 'completed', label: 'Completed' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortBy(option.value);
                      setShowSortDropdown(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm font-semibold hover:cursor-pointer hover:bg-[#C7D2FE] transition-colors text-[#040195] ${
                      sortBy === option.value ? 'bg-[#E0E7FF]' : ''
                    }`}
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

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
                    border: deleteMode ? '5px solid #FF0022' : '0px solid transparent',
                  }}
                  onClick={() => deleteMode ? toggleItemSelection(project.id) : handleProjectClick(project.id)}
                >
                  {/* Checkbox in Delete Mode */}
                  {deleteMode && (
                    <div className="absolute top-2 right-2 z-10">
                      <div 
                        className={`w-6 h-6 rounded flex items-center justify-center transition-all ${
                          isSelected 
                            ? 'bg-red-500 border-red-500 ' 
                            : 'bg-white'
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
                      <span className="text-white text-[0.6rem]  font-bold tracking-wide uppercase truncate block">
                        {project.programTitle}
                      </span>
                    </div>

                    {/* Activity Name */}
                    <div>
                      <h3 className="text-white text-base font-black  uppercase leading-tight truncate">
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
              className="p-3 text-white font-bold hover:cursor-pointer hover:opacity-90 active:opacity-75 transition-opacity shadow-lg flex items-center justify-center"
              style={{ backgroundColor: '#4D49FC', borderRadius: '10px' }}
              title="Create New Project"
            >
              <img src="/icons/add.svg" alt="Add" className="w-5 h-5" />
            </button>
            <button 
              onClick={toggleDeleteMode}
              className="p-2 text-white  hover:cursor-pointer hover:opacity-90 transition-opacity shadow-lg flex items-center justify-center"
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
                className="p-2 text-white hover:cursor-pointer hover:opacity-90 transition-opacity shadow-lg flex items-center justify-center"
                style={{ backgroundColor: '#EF5350', borderRadius: '10px' }}
                title={`Delete ${selectedItems.length} item${selectedItems.length > 1 ? 's' : ''}`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            )}
            <button 
              className="p-2 text-white hover:opacity-90 hover:cursor-pointer transition-opacity shadow-lg flex items-center justify-center"
              style={{ backgroundColor: '#4D49FC', borderRadius: '10px' }}
              title="Refresh"
            >
              <img src="/icons/refresh.svg" alt="Refresh" className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Activities Found</h3>
          <p className="text-red-600 text-sm text-center max-w-md">
            If you think this is an error, please contact your system administrator.
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

