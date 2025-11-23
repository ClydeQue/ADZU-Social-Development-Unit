import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import WhiteContainer from "@/components/WhiteContainer";
import Sidebar from "@/components/Sidebar";
import ReportsTable from "./ReportsTable";
import ReportsNavbar from "./ReportsNavbar";
import UnitDirectorService from "@/services/unitDirectorService";

export default function UnitDirectorReports() {
  const [searchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Get search query from URL params on mount
  useEffect(() => {
    const searchFromUrl = searchParams.get("search");
    if (searchFromUrl) {
      setSearchQuery(searchFromUrl);
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
          office: activity.office_acronym || "CCES",
          program: activity.program_title || "Untitled Program",
          activity: activity.activity_name || "Untitled Activity",
          due: activity.end_date
            ? new Date(activity.end_date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "N/A",
          submitted: activity.start_date
            ? new Date(activity.start_date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "N/A",
          status: activity.status || "planned",
          participants: activity.participants_count || 0,
          budget: activity.budget || 0,
          isNew: false,
          logo: `/images/${logoFile}`,
          createdAt: new Date(activity.start_date || activity.created_at),
        };
      }) || [];

    // Apply sorting
    if (sortBy && transformed.length > 0) {
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

            <div className="bg-[#F4F4F4] rounded-[15px] p-6 mx-4 flex-1 overflow-hidden flex flex-col min-h-0">
              {/* Sort Controls */}
              <div className="flex gap-3 items-center mb-4">
                {/* Sort by Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white px-6 py-2.5 pr-10 rounded-full text-sm font-semibold text-[#040195] border-none shadow-md focus:outline-none focus:ring-2 focus:ring-[#4D49FC] cursor-pointer"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    <option value="">Sort by</option>
                    <option value="recent">Recent</option>
                    <option value="oldest">Oldest</option>
                    <option value="office">Office</option>
                    <option value="program">Program</option>
                  </select>
                  {/* Dropdown Arrow - bx-chevron-down */}
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <img src="/icons/dropdown_arrow.svg" alt="" />
                  </div>
                </div>
              </div>

              {/* Reports Table */}
              {isLoading ? (
                <div className="flex items-center justify-center flex-1">
                  <div
                    className="text-[#4D49FC] text-lg font-semibold"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Loading reports...
                  </div>
                </div>
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
