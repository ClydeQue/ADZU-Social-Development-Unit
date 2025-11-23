import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import WhiteContainer from '@/components/WhiteContainer';
import Sidebar from '@/components/Sidebar';
import ReportsTable from './ReportsTable';
import ReportsNavbar from './ReportsNavbar';
import UnitDirectorService from '@/services/unitDirectorService';
import TableSkeleton from '@/components/TableSkeleton';

export default function UnitDirectorReports() {
  const [searchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Set initial sort from URL parameter
  useEffect(() => {
    const sortParam = searchParams.get('sort');
    if (sortParam && ['pending', 'in-progress', 'completed', 'cancelled', 'recent', 'oldest', 'office', 'program'].includes(sortParam)) {
      setSortBy(sortParam);
    }
  }, [searchParams]);

  // Fetch reports data
  const {
    data: reportsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["unit-director-reports"],
    queryFn: () => UnitDirectorService.getReports(),
    staleTime: 2 * 60 * 1000, // 2 minutes cache:D
  });

  // Map activities to reports format
  const reports = useMemo(() => {
    const logoMap = {
      acca: "acca_logo_small.webp",
      aces: "aces_logo_small.webp",
      aclg: "aclg_logo_small.webp",
      altec: "altec_logo_small.webp",
      apc: "apc_logo_small.webp",
      apl: "apl_logo_small.webp",
      cces: "cces_logo_small.webp",
    };

    let transformed =
      reportsData?.activities?.map((activity) => {
        const acronym = (activity.office_acronym || "CCES").toLowerCase();
        const logoFile = logoMap[acronym] || "cces_logo_small.webp";

      return {
        id: activity.id,
        office: activity.office_acronym || 'CCES',
        program: activity.program_title || 'Untitled Program',
        activity: activity.activity_name || 'Untitled Activity',
        due: activity.end_date ? (() => {
          const date = new Date(activity.end_date);
          const datePart = date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          }).replace(',', '').toUpperCase();
          const timePart = date.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
          });
          return `${datePart} | ${timePart}`;
        })() : 'N/A',
        submitted: activity.start_date ? (() => {
          const date = new Date(activity.start_date);
          const datePart = date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          }).replace(',', '').toUpperCase();
          const timePart = date.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
          });
          return `${datePart} | ${timePart}`;
        })() : 'N/A',
        status: activity.status || 'planned',
        participants: activity.participants_count || 0,
        budget: (() => {
          try {
            if (activity.budget_amount) {
              const amounts = typeof activity.budget_amount === 'string' ? JSON.parse(activity.budget_amount) : [activity.budget_amount];
              return amounts.reduce((sum, amount) => sum + (parseFloat(amount) || 0), 0);
            }
          } catch {
            return parseFloat(activity.budget_amount) || 0;
          }
          return 0;
        })(),
        isNew: false,
        logo: `/images/${logoFile}`,
        createdAt: new Date(activity.start_date || activity.created_at),
      };
    }) || [];

    // Apply sorting and filtering
    if (sortBy && transformed.length > 0) {
      // For status-based sorting, filter to show only that status
      if (['pending', 'in-progress', 'completed', 'cancelled'].includes(sortBy)) {
        transformed = transformed.filter((item) => item.status === sortBy);
        // Sort filtered items by date (most recent first)
        transformed = [...transformed].sort((a, b) => b.createdAt - a.createdAt);
      } else {
        // For other sorting options, sort all items
        transformed = [...transformed].sort((a, b) => {
          switch (sortBy) {
            case 'recent':
              return b.createdAt - a.createdAt;
            case 'oldest':
              return a.createdAt - b.createdAt;
            case 'office':
              return a.office.localeCompare(b.office);
            case 'program':
              return a.program.localeCompare(b.program);
            default:
              return 0;
          }
        });
      }
    }

    return transformed;
  }, [reportsData, sortBy]);

  // Filter reports based on search query (office, program, activity, due, submitted)
  const filteredReports = useMemo(() => {
    if (!searchQuery.trim()) {
      return reports;
    }

    const query = searchQuery.toLowerCase();
    return reports.filter(
      (report) =>
        report.office.toLowerCase().includes(query) ||
        report.program.toLowerCase().includes(query) ||
        report.activity.toLowerCase().includes(query) ||
        report.due.toLowerCase().includes(query) ||
        report.submitted.toLowerCase().includes(query)
    );
  }, [reports, searchQuery]);

  return (
    <div className="flex bg-[#EAE9E9] min-h-screen max-h-screen p-[35px] overflow-hidden">
      <WhiteContainer>
        <Sidebar />
        {/* Right content */}

        <main className="flex-grow pt-6 pb-10 md:pb-6 p-2 flex flex-col overflow-hidden">
          <div className="h-full flex flex-col max-w-[1536px] w-full mx-auto">
            {/* Reports Navbar */}
            <ReportsNavbar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />

            <div className={`bg-[#F4F4F4] rounded-[15px] p-6 mx-4 flex-1 overflow-hidden flex flex-col min-h-0 `}
            
            >
              {/* Sort Controls */}
              <div className="flex gap-3 items-center mb-4">
                {/* Custom Sort by Dropdown */}
                <div className="relative ">
                  <button
                    onClick={() => setShowSortDropdown(!showSortDropdown)}
                    className={`bg-white px-6 py-2.5 pr-10 rounded-full  ${showSortDropdown ? 'ring-2 ring-[#4D49FC]' : 'ring-0'}  text-sm font-semibold text-[#040195] border-none shadow-md  cursor-pointer flex items-center gap-2`}
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    <span>{sortBy ? sortBy.charAt(0).toUpperCase() + sortBy.slice(1).replace('-', ' ') : 'Sort by'}</span>
                    <svg 
                      className={`transition-transform ${showSortDropdown ? 'rotate-180' : ''}`}
                      width="9" 
                      height="8" 
                      viewBox="0 0 9 8" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M5.3316 7.5C4.9467 8.16667 3.98445 8.16667 3.59955 7.5L0.135449 1.5C-0.249451 0.833334 0.231675 0 1.00148 0L7.92968 0C8.69948 0 9.1806 0.833333 8.7957 1.5L5.3316 7.5Z" fill="#040195"/>
                    </svg>
                  </button>
                  
                  {showSortDropdown && (
                    <div className="absolute top-full  left-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-10 overflow-hidden min-w-[200px]">
                      {[
                        { value: '', label: 'Sort by' },
                        { value: 'recent', label: 'Recent' },
                        { value: 'oldest', label: 'Oldest' },
                        { value: 'office', label: 'Office' },
                        { value: 'program', label: 'Program' },
                        { value: 'pending', label: 'Pending' },
                        { value: 'in-progress', label: 'In Progress' },
                        { value: 'completed', label: 'Completed' },
                        { value: 'cancelled', label: 'Cancelled' },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSortBy(option.value);
                            setShowSortDropdown(false);
                          }}
                          className={`w-full px-4 py-2 text-left text-sm font-semibold hover:cursor-pointer hover:bg-[#C7D2FE] transition-colors text-[#040195]
                          ${sortBy === option.value ? 'bg-[#E0E7FF]' : ''}`}
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Reports Table */}
              {isLoading ? (
                <TableSkeleton rows={8} columns={6} />
              ) : error ? (
                <div className="flex items-center justify-center flex-1">
                  <div
                    className="text-red-600 text-lg"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Error loading reports: {error.message}
                  </div>
                </div>
              ) : (
                <div className="flex-1 overflow-hidden">
                  <ReportsTable reports={filteredReports} />
                </div>
              )}
            </div>
          </div>
        </main>
      </WhiteContainer>
    </div>
  );
}
