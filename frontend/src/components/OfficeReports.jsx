import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@tanstack/react-query';
import OfficeService from '@/services/officeService';

/**
 * Reusable Office Reports Component - Table View
 * Displays programs and activities in a table format similar to Unit Director's reports
 */
export default function OfficeReports({ officeId, officeColor = '#4D49FC', officeLogo }) {
  const [selectedRows, setSelectedRows] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch reports data
  const { data: reportsData, isLoading } = useQuery({
    queryKey: ['office-reports', officeId],
    queryFn: () => OfficeService.getOfficeReports(officeId),
    enabled: !!officeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Transform data into table format
  const reports = useMemo(() => {
    if (!reportsData?.recent_activities) return [];

    let transformed = reportsData.recent_activities.map((activity) => {
      // Use the nested program object from Supabase join (activity.programs)
      // Note: Supabase uses singular "programs" even though it's a single object
      const program = activity.programs;
      
      return {
        id: activity.id,
        office: reportsData.office?.name || '',
        program: program?.title || 'N/A',
        activity: activity.activity_name || 'Untitled Activity',
        due: new Date(activity.end_date).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        }),
        submitted: new Date(activity.start_date).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        }),
        status: activity.status,
        participants: activity.participants_count || 0,
        budget: activity.budget || 0,
        isNew: false,
        logo: officeLogo,
        createdAt: new Date(activity.created_at),
      };
    });

    // Apply sorting
    if (sortBy && transformed.length > 0) {
      transformed = [...transformed].sort((a, b) => {
        switch (sortBy) {
          case 'recent':
            return b.createdAt - a.createdAt;
          case 'oldest':
            return a.createdAt - b.createdAt;
          case 'program':
            return a.program.localeCompare(b.program);
          case 'activity':
            return a.activity.localeCompare(b.activity);
          default:
            return 0;
        }
      });
    }

    return transformed;
  }, [reportsData, sortBy, officeLogo]);

  // Filter reports based on search query
  const filteredReports = useMemo(() => {
    if (!searchQuery.trim()) {
      return reports;
    }
    
    const query = searchQuery.toLowerCase();
    return reports.filter((report) => 
      report.program.toLowerCase().includes(query) ||
      report.activity.toLowerCase().includes(query) ||
      report.due.toLowerCase().includes(query) ||
      report.submitted.toLowerCase().includes(query)
    );
  }, [reports, searchQuery]);

  const toggleRow = (id) => {
    setSelectedRows(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    setSelectedRows(prev => 
      prev.length === filteredReports.length ? [] : filteredReports.map(r => r.id)
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <div 
            className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: officeColor, borderTopColor: 'transparent' }}
          ></div>
          <p className="text-sm text-gray-500">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Search Bar */}
      <div className="flex gap-3 items-center">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search activities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 bg-white text-[#040195] rounded-full pl-4 pr-4
             text-sm outline-none border 
             border-gray-200 focus:border-[#5B6FED] hover:border-[#5B6FED] transition-colors"
          />
        </div>

        {/* Sort by Dropdown */}
        <div className="relative">
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none bg-white px-6 py-2.5 pr-10 rounded-full text-sm font-semibold text-[#040195] border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4D49FC] cursor-pointer"
          >
            <option value="">Sort by</option>
            <option value="recent">Recent</option>
            <option value="oldest">Oldest</option>
            <option value="program">Program</option>
            <option value="activity">Activity</option>
          </select>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-[#040195]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="flex-1 overflow-auto pr-2" style={{ maxHeight: '600px' }}>
        <style>{`
          .flex-1.overflow-auto::-webkit-scrollbar {
            width: 5px;
          }
          .flex-1.overflow-auto::-webkit-scrollbar-track {
            background: transparent;
          }
          .flex-1.overflow-auto::-webkit-scrollbar-thumb {
            background-color: ${officeColor};
            border-radius: 42px;
          }
          .flex-1.overflow-auto::-webkit-scrollbar-thumb:hover {
            background-color: ${officeColor}DD;
          }
        `}</style>
        
        {/* Header Row */}
        <div 
          className="text-white rounded-xl px-3 py-2.5 mb-1 grid grid-cols-[35px_1.5fr_1.5fr_140px_140px_120px_180px] gap-3 items-center sticky top-0 z-10"
          style={{ backgroundColor: officeColor }}
        >
          <input 
            type="checkbox" 
            checked={selectedRows.length === filteredReports.length && filteredReports.length > 0}
            onChange={toggleAll}
            className="w-3 h-3"
            style={{ accentColor: officeColor }}
          />
          <div className="text-xs font-semibold">Program</div>
          <div className="text-xs font-semibold">Activity</div>
          <div className="text-xs font-semibold">Start Date</div>
          <div className="text-xs font-semibold">End Date</div>
          <div className="text-xs font-semibold">Status</div>
          <div></div>
        </div>

        {/* Data Rows */}
        {filteredReports.length > 0 ? (
          <div className="space-y-1.5">
            {filteredReports.map((report) => (
              <div 
                key={report.id}
                className="bg-white hover:bg-gray-50 transition-colors rounded-lg px-3 py-1 grid grid-cols-[35px_1.5fr_1.5fr_140px_140px_120px_180px] gap-3 items-center"
              >
                <input 
                  type="checkbox"
                  checked={selectedRows.includes(report.id)}
                  onChange={() => toggleRow(report.id)}
                  className="w-3 h-3"
                  style={{ accentColor: officeColor }}
                />
                <div className="text-[0.7rem] truncate font-semibold" style={{ color: officeColor }}>
                  {report.program}
                </div>
                <div className="text-[0.7rem] truncate" style={{ color: officeColor }}>
                  {report.activity}
                </div>
                <div className="text-[0.7rem] whitespace-nowrap" style={{ color: officeColor }}>
                  {report.submitted}
                </div>
                <div className="text-[0.7rem] font-semibold whitespace-nowrap" style={{ color: officeColor }}>
                  {report.due}
                </div>
                <div>
                  <span className={`px-2 py-1 text-[0.6rem] rounded-full font-semibold ${
                    report.status === 'completed' ? 'bg-green-100 text-green-800' :
                    report.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                    report.status === 'planned' ? 'bg-orange-100 text-orange-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {report.status}
                  </span>
                </div>
                <div className="flex justify-end gap-1.5">
                  <button 
                    className="px-3 py-0.5 text-white rounded-md text-[0.65rem] font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
                    style={{ backgroundColor: officeColor }}
                  >
                    View
                  </button>
                  <button 
                    className="px-3 py-0.5 text-white rounded-md text-[0.65rem] font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
                    style={{ backgroundColor: officeColor }}
                  >
                    Print
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            {searchQuery ? 'No activities match your search' : 'No activities found'}
          </div>
        )}
      </div>
    </div>
  );
}

OfficeReports.propTypes = {
  officeId: PropTypes.string.isRequired,
  officeColor: PropTypes.string,
  officeLogo: PropTypes.string,
};
