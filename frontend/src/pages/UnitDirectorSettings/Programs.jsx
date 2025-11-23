import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import WhiteContainer from "@/components/WhiteContainer";
import Sidebar from "@/components/Sidebar";
import SettingsNavbar from "./SettingsNavbar";
import UnitDirectorService from "@/services/unitDirectorService";
import TableSkeleton from "@/components/TableSkeleton";
import SuccessModal from "@/components/SuccessModal";

/**
 * Programs Management Page
 * Allows Unit Director to view and modify office programs
 */
export default function ProgramsManagement() {
  const navigate = useNavigate();
  const [selectedOfficeId, setSelectedOfficeId] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [newProgramName, setNewProgramName] = useState("");
  const [editingProgram, setEditingProgram] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Fetch offices data
  const {
    data: officesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["unit-director-offices"],
    queryFn: () => UnitDirectorService.getOffices(),
    staleTime: 2 * 60 * 1000,
  });

  const offices = officesData?.offices || [];
  const selectedOffice = offices.find(
    (office) => office.id === selectedOfficeId
  );
  const programs = selectedOffice?.programs || [];

  // Get office logo path
  const getOfficeLogo = (acronym) => {
    const logos = {
      ACCA: "/logos/officeLogo/acca_logo_big.webp",
      ACES: "/logos/officeLogo/aces_logo_big.webp",
      ACLG: "/logos/officeLogo/aclg_logo_big.webp",
      ALTEC: "/logos/officeLogo/altec_logo_big.webp",
      APC: "/logos/officeLogo/apc_logo_big.webp",
      CCES: "/logos/officeLogo/cces_logo_big.webp",
    };
    return logos[acronym] || null;
  };

  return (
    <div className="flex bg-[#EAE9E9] min-h-screen max-h-screen p-[35px] overflow-hidden">
      <WhiteContainer>
        <Sidebar />

        <main className="flex-grow pt-6 pb-10 md:pb-6 p-2 flex flex-col overflow-hidden">
          <div className="h-full flex flex-col max-w-[1536px] w-full mx-auto">
            {/* Navbar */}
            <SettingsNavbar showSearch={false} />

            <div className="bg-[#F4F4F4] rounded-[15px] p-8 mx-4 flex-1 overflow-y-auto">
              {/* Back Button */}
              <button
                onClick={() => navigate("/unit-director/settings/main")}
                className="flex items-center gap-2 text-[#4D49FC] hover:underline mb-4"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Settings
              </button>

              {/* Header */}
              <div className="mb-6">
                <h1
                  className="text-4xl font-bold text-[#040195] mb-2"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Programs
                </h1>
                <p className="text-gray-500 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                  Manage programs for each office
                </p>
              </div>

              {/* Program Name and Office Selector */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                {/* Program Name Input */}
                <div>
                  <input
                    type="text"
                    placeholder="Program Name"
                    value={newProgramName}
                    onChange={(e) => setNewProgramName(e.target.value)}
                    className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:border-[#4D49FC] focus:outline-none"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  />
                </div>

                {/* Office Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full px-3 py-2 text-sm border-2 border-[#4D49FC] cursor-pointer rounded-lg focus:border-[#4D49FC] focus:outline-none text-left flex items-center justify-between bg-white hover:bg-[#F8F8FF] transition-colors"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    <span
                      className={
                        selectedOfficeId
                          ? "text-[#4D49FC] font-semibold"
                          : "text-gray-400"
                      }
                    >
                      {selectedOffice
                        ? selectedOffice.acronym
                        : "SELECT OFFICE"}
                    </span>
                    <svg
                      className={`w-4 h-4 text-[#4D49FC] transition-transform ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute z-10 w-full mt-2 bg-white border-2 border-[#E5E5FF] rounded-lg shadow-xl max-h-64 overflow-y-auto">
                      {isLoading ? (
                        <div
                          className="p-4 text-center text-gray-500 text-sm"
                          style={{ fontFamily: "Inter, sans-serif" }}
                        >
                          Loading offices...
                        </div>
                      ) : (
                        <div className="p-1">
                          {offices.map((office) => (
                            <button
                              key={office.id}
                              onClick={() => {
                                setSelectedOfficeId(office.id);
                                setIsDropdownOpen(false);
                              }}
                              className="w-full px-3 py-2 cursor-pointer hover:bg-[#F0F0FF] rounded-lg flex items-center gap-2 transition-colors text-left"
                            >
                              {getOfficeLogo(office.acronym) && (
                                <img
                                  src={getOfficeLogo(office.acronym)}
                                  alt={office.acronym}
                                  className="w-5 h-5 object-contain"
                                />
                              )}
                              <span
                                className="font-semibold text-[#040195] text-xs"
                                style={{ fontFamily: "Inter, sans-serif" }}
                              >
                                {office.acronym}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* ADD Button */}
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => {
                    if (newProgramName.trim() && selectedOfficeId) {
                      // TODO: Add program API call
                      console.log(
                        "Adding program:",
                        newProgramName,
                        "to office:",
                        selectedOfficeId
                      );
                      setNewProgramName("");
                    }
                  }}
                  disabled={!newProgramName.trim() || !selectedOfficeId}
                  className="px-6 py-2 bg-[#4D49FC] text-white font-bold rounded-lg cursor-pointer hover:bg-[#3D39EC] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-xs"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  ADD
                </button>
              </div>              {/* Programs Table */}
              <div
                className="h-full flex flex-col"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
              <style>{`
                .programs-scroll-container::-webkit-scrollbar {
                  width: 5px;
                }
                .programs-scroll-container::-webkit-scrollbar-track {
                  background: transparent;
                }
                .programs-scroll-container::-webkit-scrollbar-thumb {
                  background-color: #040195;
                  border-radius: 42px;
                }
                .programs-scroll-container::-webkit-scrollbar-thumb:hover {
                  background-color: #030174;
                }
              `}</style>

              {/* Table Header */}
              <div className="bg-[#1E22AA] text-white rounded-xl px-6 py-3 mb-1 grid grid-cols-[180px_1fr_160px] gap-4 items-center flex-shrink-0">
                <div className="text-xs font-semibold uppercase">Office</div>
                <div className="text-xs font-semibold uppercase">
                  Program Name
                </div>
                <div className="text-xs font-semibold uppercase text-right">
                  Action
                </div>
              </div>

              {/* Table Body - Scrollable Container */}
              {isLoading ? (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <TableSkeleton rows={5} columns={2} />
                </div>
              ) : error ? (
                <div
                  className="bg-white rounded-xl shadow-md p-6 text-center text-red-600"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Error loading programs: {error.message}
                </div>
              ) : !selectedOfficeId ? (
                <div
                  className="bg-white rounded-xl shadow-md p-12 text-center text-gray-500"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Please select an office to view its programs
                </div>
              ) : programs.length === 0 ? (
                <div
                  className="bg-white rounded-xl shadow-md p-12 text-center text-gray-500"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  No programs found for this office
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto overflow-x-hidden pr-2 programs-scroll-container min-h-0">
                  <div className="space-y-1.5">
                    {programs.map((program, idx) => (
                      <div
                        key={idx}
                        className="bg-[#F4F4F4] hover:bg-[#D4D1FF] transition-colors rounded-lg px-6 py-3 grid grid-cols-[180px_1fr_160px] gap-4 items-center"
                      >
                        <div className="flex items-center gap-2">
                          {selectedOffice &&
                            getOfficeLogo(selectedOffice.acronym) && (
                              <img
                                src={getOfficeLogo(selectedOffice.acronym)}
                                alt={selectedOffice.acronym}
                                className="w-6 h-6 object-contain flex-shrink-0"
                              />
                            )}
                          <span
                            className="text-[#4D49FC] font-semibold text-xs whitespace-nowrap"
                            style={{ fontFamily: "Inter, sans-serif" }}
                          >
                            {selectedOffice?.acronym}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span
                            className="text-[#4D49FC] font-semibold text-sm truncate"
                            style={{ fontFamily: "Inter, sans-serif" }}
                          >
                            {program.title || program.name || program}
                          </span>
                        </div>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditingProgram(program)}
                            className="px-4 py-1.5 bg-[#4D49FC] text-white font-semibold rounded-md hover:bg-[#201f65] transition-colors text-xs"
                            style={{ fontFamily: "Inter, sans-serif" }}
                          >
                            EDIT
                          </button>
                          <button
                            onClick={() => {
                              // TODO: Delete program API call
                              console.log("Deleting program:", program);
                            }}
                            className="px-4 py-1.5 bg-[#FF4D4D] text-white font-semibold rounded-md hover:bg-[#E63939] transition-colors text-xs"
                            style={{ fontFamily: "Inter, sans-serif" }}
                          >
                            DELETE
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              </div>
            </div>
          </div>
        </main>
      </WhiteContainer>

      {/* Edit Program Modal */}
      {editingProgram && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(4, 1, 149, 0.4)" }}
        >
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2
                className="text-2xl font-bold text-[#040195]"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Edit Program
              </h2>
              <button
                onClick={() => setEditingProgram(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="mb-4">
              <label
                className="block text-sm font-bold text-[#040195] mb-2"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Program Name
              </label>
              <input
                type="text"
                defaultValue={
                  editingProgram.title || editingProgram.name || editingProgram
                }
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#4D49FC] focus:outline-none"
                style={{ fontFamily: "Inter, sans-serif" }}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setEditingProgram(null)}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // TODO: Update program API call
                  console.log("Updating program:", editingProgram);
                  setEditingProgram(null);
                  setShowSuccessModal(true);
                }}
                className="flex-1 px-6 py-3 bg-[#4D49FC] text-white font-semibold rounded-lg hover:bg-[#3D39EC] transition-colors"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      <SuccessModal
        show={showSuccessModal}
        title="Successfully Updated"
        message="The program has been updated successfully."
        onClose={() => setShowSuccessModal(false)}
      />
    </div>
  );
}
