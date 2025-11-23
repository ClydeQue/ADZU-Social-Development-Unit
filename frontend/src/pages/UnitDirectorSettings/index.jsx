import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import WhiteContainer from "@/components/WhiteContainer";
import Sidebar from "@/components/Sidebar";
import ReportsTable from "./OfficesTables";
import ReportsNavbar from "./SettingsNavbar";
import EditOfficeDialog from "./EditOfficeDialog";
import MessageManagement from "@/components/MessageManagement";
import UnitDirectorService from "@/services/unitDirectorService";

export default function UnitDirectorSettings() {
  const [sortBy, setSortBy] = useState("office");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOffice, setSelectedOffice] = useState(null);
  const [activeTab, setActiveTab] = useState("offices"); // 'offices' or 'messages'

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
              {/* Tabs */}
              <div className="flex gap-2 mb-6 border-b border-gray-300">
                <button
                  onClick={() => setActiveTab("offices")}
                  className={`px-6 py-3 font-semibold transition-all ${
                    activeTab === "offices"
                      ? "text-[#4D49FC] border-b-2 border-[#4D49FC]"
                      : "text-gray-600 hover:text-[#4D49FC]"
                  }`}
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Offices
                </button>
                <button
                  onClick={() => setActiveTab("messages")}
                  className={`px-6 py-3 font-semibold transition-all ${
                    activeTab === "messages"
                      ? "text-[#4D49FC] border-b-2 border-[#4D49FC]"
                      : "text-gray-600 hover:text-[#4D49FC]"
                  }`}
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Message Management
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === "offices" ? (
                <>
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
                </>
              ) : (
                <>
                  {/* Message Management Tab */}
                  <MessageManagement isUnitDirector={true} />
                </>
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
