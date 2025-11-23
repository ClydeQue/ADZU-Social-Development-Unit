import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import WhiteContainer from "@/components/WhiteContainer";
import Sidebar from "@/components/Sidebar";
import ReportsTable from "./OfficesTables";
import ReportsNavbar from "./SettingsNavbar";
import EditOfficeDialog from "./EditOfficeDialog";
import UnitDirectorService from "@/services/unitDirectorService";
import TableSkeleton from "@/components/TableSkeleton";

export default function UnitDirectorSettings() {
  const [sortBy, setSortBy] = useState("office");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOffice, setSelectedOffice] = useState(null);

  // Fetch offices data
  const {
    data: officesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["unit-director-settings"],
    queryFn: () => UnitDirectorService.getOffices(),
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
    if (transformed.length > 0) {
      transformed = [...transformed].sort((a, b) => {
        switch (sortBy) {
          case "office":
            return a.acronym.localeCompare(b.acronym);
          case "program":
            return a.name.localeCompare(b.name);
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
              {/* Title */}
              <div className="mb-4">
                <h2
                  className="text-2xl font-bold text-[#040195]"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  OFFICES
                </h2>
              </div>

              {/* Reports Table */}
              {isLoading ? (
                <TableSkeleton rows={7} columns={3} />
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
