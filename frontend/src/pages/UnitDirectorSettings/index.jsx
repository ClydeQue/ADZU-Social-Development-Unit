import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import WhiteContainer from "@/components/WhiteContainer";
import Sidebar from "@/components/Sidebar";
import ReportsTable from "./OfficesTables";
import ReportsNavbar from "./SettingsNavbar";
import EditOfficeDialog from "./EditOfficeDialog";
import api from "@/services/api";

export default function UnitDirectorSettings() {
  const [sortBy, setSortBy] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOffice, setSelectedOffice] = useState(null);

  // Fetch offices data
  const {
    data: officesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["unit-director-settings"],
    queryFn: async () => {
      const response = await api.get("settings");
      return response;
    },
    staleTime: 2 * 60 * 1000,
  });

  // Map offices to display format
  const reports = useMemo(() => {
    let transformed =
      officesData?.offices?.map((office) => ({
        id: office.id,
        office: office.acronym || office.name,
        program: office.name,
        activity: "", // Empty since we only have office info
        logo: office.logo,
        name: office.name, // For sorting
        acronym: office.acronym,
        director: office.director,
        email: office.email,
        programs: office.programs || [], // Include programs array
      })) || [];

    // Apply sorting
    if (sortBy && transformed.length > 0) {
      transformed = [...transformed].sort((a, b) => {
        switch (sortBy) {
          case "recent":
            return 0; // No date available for offices
          case "oldest":
            return 0; // No date available for offices
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
  }, [officesData, sortBy]);

  // Filter reports based on search query (office, program)
  const filteredReports = useMemo(() => {
    if (!searchQuery.trim()) {
      return reports;
    }

    const query = searchQuery.toLowerCase();
    return reports.filter(
      (report) =>
        report.office.toLowerCase().includes(query) ||
        report.program.toLowerCase().includes(query)
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
              {/* Sort and Delete Controls */}
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
                    <option value="office">Office</option>
                    <option value="program">Name</option>
                  </select>
                  {/* Dropdown Arrow - bx-chevron-down */}
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <img src="/icons/dropdown_arrow.svg" alt="" />
                  </div>
                </div>

                {/* Delete Button - bxs-trash */}
                <button
                  className="bg-white p-1 rounded-full shadow-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#4D49FC]"
                  title="Delete selected"
                >
                  <img src="/icons/bxs_trash.svg" alt="" width={25} />
                </button>
              </div>

              {/* Reports Table */}
              {isLoading ? (
                <div className="flex items-center justify-center flex-1">
                  <div
                    className="text-[#4D49FC] text-lg font-semibold"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Loading Offices...
                  </div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center flex-1">
                  <div
                    className="text-red-600 text-lg"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Error loading Offices: {error.message}
                  </div>
                </div>
              ) : (
                <div className="flex-1 overflow-hidden">
                  <ReportsTable
                    offices={filteredReports}
                    onEditOffice={setSelectedOffice}
                  />
                </div>
              )}
            </div>
          </div>
        </main>
      </WhiteContainer>

      {/* Edit Office Dialog */}
      {selectedOffice && (
        <EditOfficeDialog
          office={selectedOffice}
          onClose={() => setSelectedOffice(null)}
        />
      )}
    </div>
  );
}
