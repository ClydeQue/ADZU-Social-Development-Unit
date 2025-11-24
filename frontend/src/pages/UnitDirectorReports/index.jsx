import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import ReactDOM from "react-dom/client";
import WhiteContainer from "@/components/WhiteContainer";
import Sidebar from "@/components/Sidebar";
import ReportsTable from "./ReportsTable";
import ReportsNavbar from "./ReportsNavbar";
import UnitDirectorService from "@/services/unitDirectorService";
import TableSkeleton from "@/components/TableSkeleton";
import ConsolidatedReportPrintView from "@/components/ConsolidatedReportPrintView";

export default function UnitDirectorReports() {
  const [searchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Set initial sort from URL parameter
  useEffect(() => {
    const sortParam = searchParams.get("sort");
    if (
      sortParam &&
      [
        "pending",
        "in-progress",
        "completed",
        "cancelled",
        "recent",
        "oldest",
        "office",
        "program",
      ].includes(sortParam)
    ) {
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
        phase: activity.phase,
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
      if (
        ["pending", "in-progress", "completed", "cancelled"].includes(sortBy)
      ) {
        transformed = transformed.filter((item) => {
          // Handle different filtering logic
          if (sortBy === "in-progress") {
            // Check phase for in-progress
                const phase = item.phase?.toLowerCase();
            return (
              phase === "in progress" ||
              phase === "implementation" ||
              phase === "execution"
            );
          } else if (sortBy === "pending") {
            // Check status for pending
            const status = item.status.toLowerCase();
            return status === "pending" || status === "planned";
          } else {
            // Check status for completed and cancelled
            const status = item.status.toLowerCase();
            return status === sortBy;
          }
        });
        // Sort filtered items by date (most recent first)
        transformed = [...transformed].sort(
          (a, b) => b.createdAt - a.createdAt
        );
      } else {
        // For other sorting options, sort all items
        transformed = [...transformed].sort((a, b) => {
          switch (sortBy) {
            case "recent":
              return b.createdAt - a.createdAt;
            case "oldest":
              return a.createdAt - b.createdAt;
            case "office":
              return a.office.localeCompare(b.office);
            case "program":
              return a.program.localeCompare(b.program);
            default:
              return 0;
          }
        });
      }
    }

    return transformed;
  }, [reportsData, sortBy]);

  // Handler for consolidated report
  const handleConsolidateReports = () => {
    if (!reportsData?.activities) return;

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // 1-12
    const currentYear = currentDate.getFullYear();

    // Filter activities for current month and year
    const monthlyActivities = reportsData.activities.filter(activity => {
      if (!activity.start_date) return false;
      const activityDate = new Date(activity.start_date);
      return activityDate.getMonth() + 1 === currentMonth && activityDate.getFullYear() === currentYear;
    });

    // Group activities by office
    const officeGroups = {};
    monthlyActivities.forEach(activity => {
      const office = activity.office_acronym || 'CCES';
      if (!officeGroups[office]) {
        officeGroups[office] = [];
      }
      officeGroups[office].push(activity);
    });

    // Calculate summary data
    const summary = Object.keys(officeGroups).map(office => {
      const activities = officeGroups[office];
      
      // Calculate totals
      const projects = activities.length;
      const participants = activities.reduce((sum, act) => sum + (act.participants_count || 0), 0);
      
      // Parse budgets
      let internalFunds = 0;
      let externalFunds = 0;
      activities.forEach(act => {
        try {
          const amounts = typeof act.budget_amount === 'string' 
            ? JSON.parse(act.budget_amount) 
            : Array.isArray(act.budget_amount) 
            ? act.budget_amount 
            : [act.budget_amount];
          const types = typeof act.budget_type === 'string' 
            ? JSON.parse(act.budget_type) 
            : Array.isArray(act.budget_type) 
            ? act.budget_type 
            : [act.budget_type];
          
          amounts.forEach((amount, idx) => {
            const type = types[idx]?.toLowerCase() || '';
            const numAmount = parseFloat(amount) || 0;
            if (type === 'internal') {
              internalFunds += numAmount;
            } else if (type === 'external') {
              externalFunds += numAmount;
            }
          });
        } catch (e) {
          console.error('Error parsing budget:', e);
        }
      });

      // Find most common SDG
      const sdgCounts = {};
      activities.forEach(act => {
        try {
          const parsed = typeof act.sdg_number === 'string' 
            ? JSON.parse(act.sdg_number) 
            : Array.isArray(act.sdg_number) 
            ? act.sdg_number 
            : [act.sdg_number];
          parsed.forEach(num => {
            const n = parseInt(num);
            if (!isNaN(n) && n >= 1 && n <= 17) {
              sdgCounts[n] = (sdgCounts[n] || 0) + 1;
            }
          });
        } catch (e) {
          console.error('Error parsing SDG:', e);
        }
      });

      const mostCommonSdg = Object.keys(sdgCounts).length > 0
        ? Object.entries(sdgCounts).sort((a, b) => b[1] - a[1])[0][0]
        : '1';

      const sdgNames = {
        '1': 'No Hunger', '2': 'Zero Hunger', '3': 'Good Health and Well-Being',
        '4': 'Quality Education', '5': 'Gender Equality', '6': 'Clean Water and Sanitation',
        '7': 'Affordable and Clean Energy', '8': 'Decent Work and Economic Growth',
        '9': 'Industry, Innovation & Infrastructure', '10': 'Reduced Inequalities',
        '11': 'Sustainable Cities & Communities', '12': 'Responsible Consumption & Production',
        '13': 'Climate Action', '14': 'Life Below Water', '15': 'Life on Land',
        '16': 'Peace, Justice & Strong Institutions', '17': 'Partnerships for the Goals'
      };

      return {
        name: office,
        projects,
        participants,
        internalFunds,
        externalFunds,
        sdgNumber: mostCommonSdg,
        sdgName: sdgNames[mostCommonSdg]
      };
    }).sort((a, b) => a.name.localeCompare(b.name));

    // Calculate project statuses
    const statusCounts = { completed: 0, 'in-progress': 0, cancelled: 0 };
    monthlyActivities.forEach(act => {
      const status = act.status?.toLowerCase() || '';
      const phase = act.phase?.toLowerCase() || '';
      
      if (status === 'completed') {
        statusCounts.completed++;
      } else if (phase === 'in progress' || phase === 'implementation' || phase === 'execution') {
        statusCounts['in-progress']++;
      } else if (status === 'cancelled') {
        statusCounts.cancelled++;
      }
    });

    const projectStatuses = [
      { label: 'Completed', value: statusCounts.completed },
      { label: 'In Progress', value: statusCounts['in-progress'] },
      { label: 'Cancelled', value: statusCounts.cancelled },
    ];

    // Calculate partnerships from real data
    const partnerCounts = { government: 0, 'non-government': 0, institutional: 0, internal: 0 };
    const uniquePartners = new Set();
    
    monthlyActivities.forEach(act => {
      if (act.partner_name) {
        try {
          const names = act.partner_name.split(',').map(s => s.trim()).filter(Boolean);
          const types = act.partner_type ? act.partner_type.split(',').map(s => s.trim().toLowerCase()).filter(Boolean) : [];
          
          names.forEach((name, idx) => {
            const partnerId = `${name}-${types[idx] || 'unknown'}`;
            if (!uniquePartners.has(partnerId)) {
              uniquePartners.add(partnerId);
              const type = types[idx] || '';
              
              if (type.includes('government') || type.includes('lgu')) {
                partnerCounts.government++;
              } else if (type.includes('ngo') || type.includes('non-government')) {
                partnerCounts['non-government']++;
              } else if (type.includes('institutional') || type.includes('university') || type.includes('school')) {
                partnerCounts.institutional++;
              } else if (type.includes('internal') || type.includes('office')) {
                partnerCounts.internal++;
              } else {
                // Default to non-government for unspecified
                partnerCounts['non-government']++;
              }
            }
          });
        } catch (e) {
          console.error('Error parsing partners:', e);
        }
      }
    });

    const partnerships = [
      { label: 'Government', value: partnerCounts.government },
      { label: 'Non-Government', value: partnerCounts['non-government'] },
      { label: 'Institutional', value: partnerCounts.institutional },
      { label: 'Internal', value: partnerCounts.internal },
    ];

    // Calculate SDG alignment
    const allSdgCounts = {};
    monthlyActivities.forEach(act => {
      try {
        const parsed = typeof act.sdg_number === 'string' 
          ? JSON.parse(act.sdg_number) 
          : Array.isArray(act.sdg_number) 
          ? act.sdg_number 
          : [act.sdg_number];
        parsed.forEach(num => {
          const n = parseInt(num);
          if (!isNaN(n) && n >= 1 && n <= 17) {
            allSdgCounts[n] = (allSdgCounts[n] || 0) + 1;
          }
        });
      } catch (e) {
        console.error('Error parsing SDG:', e);
      }
    });

    const sdgAlignment = Object.entries(allSdgCounts)
      .map(([num, count]) => ({ number: parseInt(num), count }))
      .sort((a, b) => a.number - b.number);

    // Create consolidated report data
    const reportData = {
      summary,
      projectStatuses,
      partnerships,
      sdgAlignment
    };

    // Create a temporary container for print view
    const printContainer = document.createElement('div');
    printContainer.id = 'print-container';
    printContainer.style.position = 'fixed';
    printContainer.style.top = '0';
    printContainer.style.left = '0';
    printContainer.style.width = '100%';
    printContainer.style.height = '100%';
    printContainer.style.backgroundColor = 'white';
    printContainer.style.zIndex = '99999';
    printContainer.style.overflow = 'auto';
    document.body.appendChild(printContainer);

    // Render the print view
    const root = ReactDOM.createRoot(printContainer);
    root.render(
      <ConsolidatedReportPrintView 
        reportData={reportData}
        month={currentMonth}
        year={currentYear}
      />
    );

    // Wait for rendering and images to load, then print
    setTimeout(() => {
      window.print();
      
      // Clean up after print dialog closes
      setTimeout(() => {
        root.unmount();
        document.body.removeChild(printContainer);
      }, 100);
    }, 500);
  };

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
              <div className="flex gap-3 items-center justify-between mb-4">
                {/* Custom Sort by Dropdown */}
                <div className="relative ">
                  <button
                    onClick={() => setShowSortDropdown(!showSortDropdown)}
                    className={`bg-white px-6 py-2.5 pr-10 rounded-full  ${showSortDropdown ? 'ring-2 ring-[#4D49FC]' : 'ring-0'}  text-sm font-semibold text-[#040195] border-none shadow-md  cursor-pointer flex items-center gap-2`}
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    <span>
                      {sortBy
                        ? sortBy.charAt(0).toUpperCase() +
                          sortBy.slice(1).replace("-", " ")
                        : "Sort by"}
                    </span>
                    <svg
                      className={`transition-transform ${
                        showSortDropdown ? "rotate-180" : ""
                      }`}
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
                    <div className="absolute top-full  left-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-10 overflow-hidden min-w-[200px]">
                      {[
                        { value: "", label: "Sort by" },
                        { value: "recent", label: "Recent" },
                        { value: "oldest", label: "Oldest" },
                        { value: "office", label: "Office" },
                        { value: "program", label: "Program" },
                        { value: "pending", label: "Pending" },
                        { value: "in-progress", label: "In Progress" },
                        { value: "completed", label: "Completed" },
                        { value: "cancelled", label: "Cancelled" },
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

                {/* Consolidate Reports Button */}
                <button 
                  onClick={handleConsolidateReports}
                  className="bg-[#4D49FC] text-white px-3 py-2 lg:text-sm text-xs cursor-pointer rounded-xl font-bold  uppercase flex items-center gap-2 hover:opacity-90 transition-opacity"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  CONSOLIDATE REPORTS
                </button>
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
