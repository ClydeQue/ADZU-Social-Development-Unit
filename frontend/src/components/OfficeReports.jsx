import { useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import OfficeService from '@/services/officeService';

/**
 * Reusable Office Projects Component
 * Displays programs and activities in a grid card layout
 */
export default function OfficeReports({ officeId, officeColor = '#4D49FC', officeLogo, basePath }) {
  const [sortBy, setSortBy] = useState('');
  const navigate = useNavigate();

  // Fetch projects data (programs and activities)
  const { data: projectsData, isLoading } = useQuery({
    queryKey: ['office-projects', officeId],
    queryFn: () => OfficeService.getOfficeReports(officeId),
    enabled: !!officeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Transform data into projects format
  const projects = projectsData?.recent_activities?.map((activity) => {
    const program = activity.programs;
    
    return {
      id: activity.id,
      programType: program?.title || 'Program',
      activityName: activity.activity_name || 'Activity',
      image: activity.image_url || '/reports/default.webp',
      status: activity.status,
    };
  }) || [];

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
    <div className="h-full flex flex-col" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Projects Grid with Action Buttons on Right */}
      {projects.length > 0 ? (
        <div className="flex gap-4 h-full">
          {/* Grid Container - Full Height */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 content-start">
            {projects.map((project) => (
              <div 
                key={project.id}
                className="relative rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-200 shadow-lg"
                style={{ aspectRatio: '4/4.5' }}
              >
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
                <div className="relative h-full flex flex-col justify-end p-4">
                  {/* Program Type */}
                  <div className="mb-1">
                    <span className="text-white text-[0.65rem] font-semibold tracking-wide uppercase truncate block">
                      {project.programType}
                    </span>
                  </div>

                  {/* Activity Name */}
                  <div>
                    <h3 className="text-white text-lg font-bold uppercase leading-tight truncate">
                      {project.activityName}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Vertical Action Buttons - Right Side */}
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => navigate(`${basePath}/add-activity`)}
              className="p-4 text-white font-bold hover:opacity-90 transition-opacity shadow-lg flex items-center justify-center"
              style={{ backgroundColor: '#4D49FC', borderRadius: '10px' }}
              title="Create New Project"
            >
              <img src="/icons/add.svg" alt="Add" className="w-6 h-6" />
            </button>
            <button 
              className="p-2 text-white hover:opacity-90 transition-opacity shadow-lg flex items-center justify-center"
              style={{ backgroundColor: '#4D49FC', borderRadius: '10px' }}
              title="Delete"
            >
              <img src="/icons/trash.svg" alt="Delete" className="w-5 h-5" />
            </button>
            <button 
              className="p-2 text-white hover:opacity-90 transition-opacity shadow-lg flex items-center justify-center"
              style={{ backgroundColor: '#4D49FC', borderRadius: '10px' }}
              title="Refresh"
            >
              <img src="/icons/refresh.svg" alt="Refresh" className="w-5 h-5" />
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
  );
}

OfficeReports.propTypes = {
  officeId: PropTypes.string.isRequired,
  officeColor: PropTypes.string,
  officeLogo: PropTypes.string,
};

