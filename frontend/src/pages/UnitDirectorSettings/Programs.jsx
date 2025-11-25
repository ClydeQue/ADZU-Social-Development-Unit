import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import WhiteContainer from "@/components/WhiteContainer";
import Sidebar from "@/components/Sidebar";
import SettingsNavbar from "./SettingsNavbar";
import UnitDirectorService from "@/services/unitDirectorService";
import TableSkeleton from "@/components/TableSkeleton";
import SuccessModal from "@/components/SuccessModal";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";

/**
 * Programs Management Page
 * Allows Unit Director to view and modify office programs
 */
export default function ProgramsManagement() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("manage"); // "manage", "create-requests", "edit-requests", "delete-requests"
  const [selectedOfficeId, setSelectedOfficeId] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [newProgramName, setNewProgramName] = useState("");
  const [newProgramDescription, setNewProgramDescription] = useState("");
  const [editingProgram, setEditingProgram] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [programToDelete, setProgramToDelete] = useState(null);
  const [clearedRequestIds, setClearedRequestIds] = useState([]);

  // Fetch offices data
  const {
    data: officesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["unit-director-offices"],
    queryFn: async () => {
      const data = await UnitDirectorService.getOffices();
      console.log('✅ Unit Director Offices fetched:', data);
      return data;
    },
    staleTime: 2 * 60 * 1000,
  });

  // Add program mutation
  const addProgramMutation = useMutation({
    mutationFn: ({ officeId, programData }) =>
      UnitDirectorService.addProgram(officeId, programData),
    onSuccess: () => {
      queryClient.invalidateQueries(["unit-director-offices"]);
      setNewProgramName("");
      setNewProgramDescription("");
      setSuccessMessage("Program added successfully!");
      setShowSuccessModal(true);
      setIsAdding(false);
    },
    onError: (error) => {
      console.error("Add program error:", error);
      alert(error.response?.data?.error || "Failed to add program");
      setIsAdding(false);
    },
  });

  // Delete program mutation
  const deleteProgramMutation = useMutation({
    mutationFn: (programId) => UnitDirectorService.deleteProgram(programId),
    onSuccess: () => {
      queryClient.invalidateQueries(["unit-director-offices"]);
      setSuccessMessage("Program deleted successfully!");
      setShowSuccessModal(true);
    },
    onError: (error) => {
      console.error("Delete program error:", error);
      alert(error.response?.data?.error || "Failed to delete program");
    },
  });

  // Fetch program requests by type
  const { data: createRequestsData, isLoading: createRequestsLoading } = useQuery({
    queryKey: ["program-create-requests"],
    queryFn: async () => {
      const data = await UnitDirectorService.getProgramCreateRequests();
      console.log('✅ CREATE Requests Data:', {
        rawData: data,
        requestsCount: data?.requests?.length || 0,
        requests: data?.requests?.map(r => ({
          id: r.id,
          request_type: r.request_type,
          status: r.status,
          title: r.title,
          office: r.offices?.acronym
        }))
      });
      return data;
    },
    staleTime: 5000, // Reduced cache time for debugging
    refetchOnMount: true,
  });

  const { data: editRequestsData, isLoading: editRequestsLoading } = useQuery({
    queryKey: ["program-edit-requests"],
    queryFn: async () => {
      const data = await UnitDirectorService.getProgramEditRequests();
      console.log('✅ EDIT Requests Data:', {
        rawData: data,
        requestsCount: data?.requests?.length || 0,
        requests: data?.requests?.map(r => ({
          id: r.id,
          request_type: r.request_type,
          status: r.status,
          title: r.title,
          office: r.offices?.acronym
        }))
      });
      return data;
    },
    staleTime: 5000,
    refetchOnMount: true,
  });

  const { data: deleteRequestsData, isLoading: deleteRequestsLoading } = useQuery({
    queryKey: ["program-delete-requests"],
    queryFn: async () => {
      const data = await UnitDirectorService.getProgramDeleteRequests();
      console.log('✅ DELETE Requests Data:', {
        rawData: data,
        requestsCount: data?.requests?.length || 0,
        requests: data?.requests?.map(r => ({
          id: r.id,
          request_type: r.request_type,
          status: r.status,
          title: r.title,
          office: r.offices?.acronym
        }))
      });
      return data;
    },
    staleTime: 5000,
    refetchOnMount: true,
  });

  // Approve program request mutation
  const approveRequestMutation = useMutation({
    mutationFn: (requestId) => UnitDirectorService.approveProgramRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries(["program-create-requests"]);
      queryClient.invalidateQueries(["program-edit-requests"]);
      queryClient.invalidateQueries(["program-delete-requests"]);
      queryClient.invalidateQueries(["unit-director-offices"]);
      setSuccessMessage("Program request approved successfully!");
      setShowSuccessModal(true);
    },
    onError: (error) => {
      console.error("Approve request error:", error);
      alert(error.response?.data?.error || "Failed to approve request");
    },
  });

  // Reject program request mutation
  const rejectRequestMutation = useMutation({
    mutationFn: (requestId) => UnitDirectorService.rejectProgramRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries(["program-create-requests"]);
      queryClient.invalidateQueries(["program-edit-requests"]);
      queryClient.invalidateQueries(["program-delete-requests"]);
      setSuccessMessage("Program request rejected");
      setShowSuccessModal(true);
    },
    onError: (error) => {
      console.error("Reject request error:", error);
      alert(error.response?.data?.error || "Failed to reject request");
    },
  });

  const offices = officesData?.offices || [];
  const selectedOffice = offices.find(
    (office) => office.id === selectedOfficeId
  );
  const programs = selectedOffice?.programs || [];
  
  console.log('📊 Unit Director Programs Debug:', {
    officesCount: offices.length,
    selectedOfficeId,
    selectedOffice: selectedOffice ? {
      id: selectedOffice.id,
      acronym: selectedOffice.acronym,
      programsCount: selectedOffice.programs?.length || 0,
      programs: selectedOffice.programs
    } : null,
    programs
  });

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
            <SettingsNavbar title="Programs" showSearch={false} />

            <div className="bg-[#F4F4F4] rounded-[15px] p-8 mx-4 flex-1 overflow-y-auto">
              {/* Back Button */}
              <button
                onClick={() => navigate("/unit-director/settings/main")}
                className="flex items-center gap-2 text-[#4D49FC] hover:underline mb-4"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Settings
              </button>
              {/* Header */}
              <div className="mb-6">
                <h1
                  className="text-4xl font-bold text-[#040195] mb-2"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Program Management
                </h1>
                <p
                  className="text-gray-500 text-sm"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Manage programs for each office
                </p>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 mb-6 border-b-2 border-gray-200">
                <button
                  onClick={() => setActiveTab("manage")}
                  className={`px-6 py-3 font-semibold transition-all ${
                    activeTab === "manage"
                      ? "text-[#4D49FC] border-b-4 border-[#4D49FC]"
                      : "text-gray-500 hover:text-[#4D49FC]"
                  }`}
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Manage Programs
                </button>
                <button
                  onClick={() => setActiveTab("create-requests")}
                  className={`px-6 py-3 font-semibold transition-all relative ${
                    activeTab === "create-requests"
                      ? "text-[#4D49FC] border-b-4 border-[#4D49FC]"
                      : "text-gray-500 hover:text-[#4D49FC]"
                  }`}
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Create Requests
                  {createRequestsData?.requests?.filter(r => r.status === "pending" && !clearedRequestIds.includes(r.id)).length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {createRequestsData.requests.filter(r => r.status === "pending" && !clearedRequestIds.includes(r.id)).length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("edit-requests")}
                  className={`px-6 py-3 font-semibold transition-all relative ${
                    activeTab === "edit-requests"
                      ? "text-[#4D49FC] border-b-4 border-[#4D49FC]"
                      : "text-gray-500 hover:text-[#4D49FC]"
                  }`}
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Edit Requests
                  {editRequestsData?.requests?.filter(r => r.status === "pending" && !clearedRequestIds.includes(r.id)).length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {editRequestsData.requests.filter(r => r.status === "pending" && !clearedRequestIds.includes(r.id)).length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("delete-requests")}
                  className={`px-6 py-3 font-semibold transition-all relative ${
                    activeTab === "delete-requests"
                      ? "text-[#4D49FC] border-b-4 border-[#4D49FC]"
                      : "text-gray-500 hover:text-[#4D49FC]"
                  }`}
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Delete Requests
                  {deleteRequestsData?.requests?.filter(r => r.status === "pending" && !clearedRequestIds.includes(r.id)).length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {deleteRequestsData.requests.filter(r => r.status === "pending" && !clearedRequestIds.includes(r.id)).length}
                    </span>
                  )}
                </button>
              </div>
              {/* Manage Programs Tab Content */}
              {activeTab === "manage" && (
                <>
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
                  <div className="mb-2"></div>
                  <input
                    type="text"
                    placeholder="Description"
                    value={newProgramDescription}
                    onChange={(e) => setNewProgramDescription(e.target.value)}
                    className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:border-[#4D49FC] focus:outline-none"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  />
                </div>

                {/* Office Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsDropdownOpen(!isDropdownOpen);
                    }}
                    className="w-full px-3 py-2 text-sm border-2 border-[#4D49FC] rounded-lg focus:border-[#4D49FC] focus:outline-none text-left flex items-center justify-between bg-white hover:bg-[#F8F8FF] transition-colors"
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
                    <div className="absolute z-50 w-full mt-2 bg-white border-2 border-[#E5E5FF] rounded-lg shadow-xl max-h-64 overflow-y-auto">
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
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setSelectedOfficeId(office.id);
                                setIsDropdownOpen(false);
                              }}
                              className="w-full px-3 py-2 hover:bg-[#F0F0FF] rounded-lg flex items-center gap-2 transition-colors text-left"
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
                    if (
                      newProgramName.trim() &&
                      selectedOfficeId &&
                      !isAdding
                    ) {
                      setIsAdding(true);
                      addProgramMutation.mutate({
                        officeId: selectedOfficeId,
                        programData: {
                          title: newProgramName.trim(),
                          description: newProgramDescription.trim() || null,
                        },
                      });
                    }
                  }}
                  disabled={
                    !newProgramName.trim() || !selectedOfficeId || isAdding
                  }
                  className="px-6 py-2 bg-[#4D49FC] text-white font-bold rounded-lg cursor-pointer hover:bg-[#3D39EC] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-xs"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {isAdding ? "ADDING..." : "ADD"}
                </button>
              </div>

              {/* Programs Table */}
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
                    Program Name & Description
                  </div>
                  <div className="text-xs font-semibold uppercase text-right mr-5">
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
                          <div className="flex flex-col">
                            <span
                              className="text-[#4D49FC] font-semibold text-sm"
                              style={{ fontFamily: "Inter, sans-serif" }}
                            >
                              {program.title || program.name || program}
                            </span>
                            {program.description && (
                              <span
                                className="text-gray-600 text-xs mt-1 line-clamp-2"
                                style={{ fontFamily: "Inter, sans-serif" }}
                              >
                                {program.description}
                              </span>
                            )}
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
                                setProgramToDelete(program);
                                setDeleteModalOpen(true);
                              }}
                              disabled={deleteProgramMutation.isPending}
                              className="px-4 py-1.5 bg-[#FF4D4D] text-white font-semibold rounded-md hover:bg-[#E63939] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-xs"
                              style={{ fontFamily: "Inter, sans-serif" }}
                            >
                              {deleteProgramMutation.isPending
                                ? "DELETING..."
                                : "DELETE"}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              </>
              )}

              {/* Create Requests Tab Content */}
              {activeTab === "create-requests" && (
                <div className="h-full flex flex-col">
                  <style>{`
                    .requests-scroll-container::-webkit-scrollbar {
                      width: 5px;
                    }
                    .requests-scroll-container::-webkit-scrollbar-track {
                      background: transparent;
                    }
                    .requests-scroll-container::-webkit-scrollbar-thumb {
                      background-color: #040195;
                      border-radius: 42px;
                    }
                    .requests-scroll-container::-webkit-scrollbar-thumb:hover {
                      background-color: #030174;
                    }
                  `}</style>

                  {/* Clear Button */}
                  <div className="flex justify-end mb-3">
                    <button
                      onClick={() => {
                        const requestIds = createRequestsData?.requests?.map(r => r.id) || [];
                        setClearedRequestIds(prev => [...prev, ...requestIds]);
                      }}
                      disabled={!createRequestsData?.requests?.filter(r => !clearedRequestIds.includes(r.id)).length}
                      className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-xs flex items-center gap-2"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      CLEAR LIST
                    </button>
                  </div>

                  {/* Table Header */}
                  <div className="bg-[#1E22AA] text-white rounded-xl px-6 py-3 mb-1 grid grid-cols-[150px_200px_1fr_120px_200px] gap-4 items-center flex-shrink-0">
                    <div className="text-xs font-semibold uppercase">Office</div>
                    <div className="text-xs font-semibold uppercase">Program Title</div>
                    <div className="text-xs font-semibold uppercase">Description</div>
                    <div className="text-xs font-semibold uppercase">Status</div>
                    <div className="text-xs font-semibold uppercase text-center">Actions</div>
                  </div>

                  {/* Table Body */}
                  {createRequestsLoading ? (
                    <div className="bg-white rounded-xl shadow-md p-6">
                      <TableSkeleton rows={5} columns={5} />
                    </div>
                  ) : !createRequestsData?.requests || createRequestsData.requests.filter(r => !clearedRequestIds.includes(r.id)).length === 0 ? (
                    <div
                      className="bg-white rounded-xl shadow-md p-12 text-center text-gray-500"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      No create program requests found
                    </div>
                  ) : (
                    <div className="flex-1 overflow-y-auto overflow-x-hidden pr-2 requests-scroll-container min-h-0">
                      <div className="space-y-1.5">
                        {createRequestsData.requests.filter(r => !clearedRequestIds.includes(r.id)).map((request) => (
                          <div
                            key={request.id}
                            className={`${
                              request.status === "pending"
                                ? "bg-[#FFF9E6] border-2 border-yellow-300"
                                : request.status === "approved"
                                ? "bg-[#E6F7ED] border-2 border-green-300"
                                : "bg-[#FFE6E6] border-2 border-red-300"
                            } rounded-lg px-6 py-3 grid grid-cols-[150px_200px_1fr_120px_200px] gap-4 items-center transition-colors`}
                          >
                            {/* Office */}
                            <div className="flex items-center gap-2">
                              {getOfficeLogo(request.offices?.acronym) && (
                                <img
                                  src={getOfficeLogo(request.offices.acronym)}
                                  alt={request.offices.acronym}
                                  className="w-6 h-6 object-contain flex-shrink-0"
                                />
                              )}
                              <span
                                className="text-[#4D49FC] font-semibold text-xs"
                                style={{ fontFamily: "Inter, sans-serif" }}
                              >
                                {request.offices?.acronym || "N/A"}
                              </span>
                            </div>

                            {/* Title */}
                            <div>
                              <span
                                className="text-[#040195] font-semibold text-sm"
                                style={{ fontFamily: "Inter, sans-serif" }}
                              >
                                {request.title}
                              </span>
                            </div>

                            {/* Description */}
                            <div>
                              <span
                                className="text-gray-600 text-xs line-clamp-2"
                                style={{ fontFamily: "Inter, sans-serif" }}
                              >
                                {request.description || "No description"}
                              </span>
                            </div>

                            {/* Status Badge */}
                            <div>
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                  request.status === "pending"
                                    ? "bg-yellow-500 text-white"
                                    : request.status === "approved"
                                    ? "bg-green-500 text-white"
                                    : "bg-red-500 text-white"
                                }`}
                                style={{ fontFamily: "Inter, sans-serif" }}
                              >
                                {request.status.toUpperCase()}
                              </span>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-center gap-2">
                              {request.status === "pending" && (
                                <>
                                  <button
                                    onClick={() => approveRequestMutation.mutate(request.id)}
                                    disabled={approveRequestMutation.isPending}
                                    className="px-4 py-1.5 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-xs"
                                    style={{ fontFamily: "Inter, sans-serif" }}
                                  >
                                    {approveRequestMutation.isPending ? "..." : "APPROVE"}
                                  </button>
                                  <button
                                    onClick={() => rejectRequestMutation.mutate(request.id)}
                                    disabled={rejectRequestMutation.isPending}
                                    className="px-4 py-1.5 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-xs"
                                    style={{ fontFamily: "Inter, sans-serif" }}
                                  >
                                    {rejectRequestMutation.isPending ? "..." : "REJECT"}
                                  </button>
                                </>
                              )}
                              {request.status === "approved" && (
                                <span
                                  className="text-green-600 text-xs font-semibold"
                                  style={{ fontFamily: "Inter, sans-serif" }}
                                >
                                  ✓ Approved & Created
                                </span>
                              )}
                              {request.status === "rejected" && (
                                <span
                                  className="text-red-600 text-xs font-semibold"
                                  style={{ fontFamily: "Inter, sans-serif" }}
                                >
                                  ✗ Rejected
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Edit Requests Tab Content */}
              {activeTab === "edit-requests" && (
                <div className="h-full flex flex-col">
                  <style>{`
                    .requests-scroll-container::-webkit-scrollbar {
                      width: 5px;
                    }
                    .requests-scroll-container::-webkit-scrollbar-track {
                      background: transparent;
                    }
                    .requests-scroll-container::-webkit-scrollbar-thumb {
                      background-color: #040195;
                      border-radius: 42px;
                    }
                    .requests-scroll-container::-webkit-scrollbar-thumb:hover {
                      background-color: #030174;
                    }
                  `}</style>

                  {/* Clear Button */}
                  <div className="flex justify-end mb-3">
                    <button
                      onClick={() => {
                        const requestIds = editRequestsData?.requests?.map(r => r.id) || [];
                        setClearedRequestIds(prev => [...prev, ...requestIds]);
                      }}
                      disabled={!editRequestsData?.requests?.filter(r => !clearedRequestIds.includes(r.id)).length}
                      className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-xs flex items-center gap-2"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      CLEAR LIST
                    </button>
                  </div>

                  {/* Table Header */}
                  <div className="bg-[#1E22AA] text-white rounded-xl px-6 py-3 mb-1 grid grid-cols-[120px_1fr_1fr_100px_180px] gap-4 items-center flex-shrink-0">
                    <div className="text-xs font-semibold uppercase">Office</div>
                    <div className="text-xs font-semibold uppercase">Current</div>
                    <div className="text-xs font-semibold uppercase">Proposed</div>
                    <div className="text-xs font-semibold uppercase">Status</div>
                    <div className="text-xs font-semibold uppercase text-center">Actions</div>
                  </div>

                  {/* Table Body */}
                  {editRequestsLoading ? (
                    <div className="bg-white rounded-xl shadow-md p-6">
                      <TableSkeleton rows={5} columns={5} />
                    </div>
                  ) : !editRequestsData?.requests || editRequestsData.requests.filter(r => !clearedRequestIds.includes(r.id)).length === 0 ? (
                    <div
                      className="bg-white rounded-xl shadow-md p-12 text-center text-gray-500"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      No edit program requests found
                    </div>
                  ) : (
                    <div className="flex-1 overflow-y-auto overflow-x-hidden pr-2 requests-scroll-container min-h-0">
                      <div className="space-y-1.5">
                        {editRequestsData.requests.filter(r => !clearedRequestIds.includes(r.id)).map((request) => (
                          <div
                            key={request.id}
                            className={`${
                              request.status === "pending"
                                ? "bg-[#FFF9E6] border-2 border-yellow-300"
                                : request.status === "approved"
                                ? "bg-[#E6F7ED] border-2 border-green-300"
                                : "bg-[#FFE6E6] border-2 border-red-300"
                            } rounded-lg px-6 py-3 grid grid-cols-[120px_1fr_1fr_100px_180px] gap-4 items-start transition-colors`}
                          >
                            {/* Office */}
                            <div className="flex items-center gap-2">
                              {getOfficeLogo(request.offices?.acronym) && (
                                <img
                                  src={getOfficeLogo(request.offices.acronym)}
                                  alt={request.offices.acronym}
                                  className="w-6 h-6 object-contain flex-shrink-0"
                                />
                              )}
                              <span
                                className="text-[#4D49FC] font-semibold text-xs"
                                style={{ fontFamily: "Inter, sans-serif" }}
                              >
                                {request.offices?.acronym || "N/A"}
                              </span>
                            </div>

                            {/* Current Values */}
                            <div className="flex flex-col gap-1">
                              <div className="flex flex-col">
                                <span
                                  className="text-[#040195] font-bold text-xs mb-1"
                                  style={{ fontFamily: "Inter, sans-serif" }}
                                >
                                  Current Title:
                                </span>
                                <span
                                  className="text-gray-700 text-sm"
                                  style={{ fontFamily: "Inter, sans-serif" }}
                                >
                                  {request.programs?.title || "N/A"}
                                </span>
                              </div>
                              <div className="flex flex-col mt-2">
                                <span
                                  className="text-[#040195] font-bold text-xs mb-1"
                                  style={{ fontFamily: "Inter, sans-serif" }}
                                >
                                  Current Description:
                                </span>
                                <span
                                  className="text-gray-600 text-xs line-clamp-2"
                                  style={{ fontFamily: "Inter, sans-serif" }}
                                >
                                  {request.programs?.description || "No description"}
                                </span>
                              </div>
                            </div>

                            {/* Proposed Values */}
                            <div className="flex flex-col gap-1">
                              <div className="flex flex-col">
                                <span
                                  className="text-orange-600 font-bold text-xs mb-1"
                                  style={{ fontFamily: "Inter, sans-serif" }}
                                >
                                  New Title:
                                </span>
                                <span
                                  className="text-gray-700 text-sm font-semibold"
                                  style={{ fontFamily: "Inter, sans-serif" }}
                                >
                                  {request.new_title || request.title || "N/A"}
                                </span>
                              </div>
                              <div className="flex flex-col mt-2">
                                <span
                                  className="text-orange-600 font-bold text-xs mb-1"
                                  style={{ fontFamily: "Inter, sans-serif" }}
                                >
                                  New Description:
                                </span>
                                <span
                                  className="text-gray-600 text-xs line-clamp-2"
                                  style={{ fontFamily: "Inter, sans-serif" }}
                                >
                                  {request.new_description || request.description || "No description"}
                                </span>
                              </div>
                            </div>

                            {/* Status Badge */}
                            <div className="flex items-start pt-2">
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                  request.status === "pending"
                                    ? "bg-yellow-500 text-white"
                                    : request.status === "approved"
                                    ? "bg-green-500 text-white"
                                    : "bg-red-500 text-white"
                                }`}
                                style={{ fontFamily: "Inter, sans-serif" }}
                              >
                                {request.status.toUpperCase()}
                              </span>
                            </div>

                            {/* Actions */}
                            <div className="flex items-start justify-center gap-2 pt-2">
                              {request.status === "pending" && (
                                <>
                                  <button
                                    onClick={() => approveRequestMutation.mutate(request.id)}
                                    disabled={approveRequestMutation.isPending}
                                    className="px-4 py-1.5 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-xs"
                                    style={{ fontFamily: "Inter, sans-serif" }}
                                  >
                                    {approveRequestMutation.isPending ? "..." : "APPROVE"}
                                  </button>
                                  <button
                                    onClick={() => rejectRequestMutation.mutate(request.id)}
                                    disabled={rejectRequestMutation.isPending}
                                    className="px-4 py-1.5 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-xs"
                                    style={{ fontFamily: "Inter, sans-serif" }}
                                  >
                                    {rejectRequestMutation.isPending ? "..." : "REJECT"}
                                  </button>
                                </>
                              )}
                              {request.status === "approved" && (
                                <span
                                  className="text-green-600 text-xs font-semibold"
                                  style={{ fontFamily: "Inter, sans-serif" }}
                                >
                                  ✓ Approved
                                </span>
                              )}
                              {request.status === "rejected" && (
                                <span
                                  className="text-red-600 text-xs font-semibold"
                                  style={{ fontFamily: "Inter, sans-serif" }}
                                >
                                  ✗ Rejected
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Delete Requests Tab Content */}
              {activeTab === "delete-requests" && (
                <div className="h-full flex flex-col">
                  <style>{`
                    .requests-scroll-container::-webkit-scrollbar {
                      width: 5px;
                    }
                    .requests-scroll-container::-webkit-scrollbar-track {
                      background: transparent;
                    }
                    .requests-scroll-container::-webkit-scrollbar-thumb {
                      background-color: #040195;
                      border-radius: 42px;
                    }
                    .requests-scroll-container::-webkit-scrollbar-thumb:hover {
                      background-color: #030174;
                    }
                  `}</style>

                  {/* Clear Button */}
                  <div className="flex justify-end mb-3">
                    <button
                      onClick={() => {
                        const requestIds = deleteRequestsData?.requests?.map(r => r.id) || [];
                        setClearedRequestIds(prev => [...prev, ...requestIds]);
                      }}
                      disabled={!deleteRequestsData?.requests?.filter(r => !clearedRequestIds.includes(r.id)).length}
                      className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-xs flex items-center gap-2"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      CLEAR LIST
                    </button>
                  </div>

                  {/* Table Header */}
                  <div className="bg-[#1E22AA] text-white rounded-xl px-6 py-3 mb-1 grid grid-cols-[120px_200px_1fr_200px_100px_180px] gap-4 items-center flex-shrink-0">
                    <div className="text-xs font-semibold uppercase">Office</div>
                    <div className="text-xs font-semibold uppercase">Program Title</div>
                    <div className="text-xs font-semibold uppercase">Reason</div>
                    <div className="text-xs font-semibold uppercase">Requested By</div>
                    <div className="text-xs font-semibold uppercase">Status</div>
                    <div className="text-xs font-semibold uppercase text-center">Actions</div>
                  </div>

                  {/* Table Body */}
                  {deleteRequestsLoading ? (
                    <div className="bg-white rounded-xl shadow-md p-6">
                      <TableSkeleton rows={5} columns={6} />
                    </div>
                  ) : !deleteRequestsData?.requests || deleteRequestsData.requests.filter(r => !clearedRequestIds.includes(r.id)).length === 0 ? (
                    <div
                      className="bg-white rounded-xl shadow-md p-12 text-center text-gray-500"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      No delete program requests found
                    </div>
                  ) : (
                    <div className="flex-1 overflow-y-auto overflow-x-hidden pr-2 requests-scroll-container min-h-0">
                      <div className="space-y-1.5">
                        {deleteRequestsData.requests.filter(r => !clearedRequestIds.includes(r.id)).map((request) => (
                          <div
                            key={request.id}
                            className={`${
                              request.status === "pending"
                                ? "bg-[#FFEBEE] border-2 border-red-200"
                                : request.status === "approved"
                                ? "bg-[#E6F7ED] border-2 border-green-300"
                                : "bg-[#FFE6E6] border-2 border-red-300"
                            } rounded-lg px-6 py-3 grid grid-cols-[120px_200px_1fr_200px_100px_180px] gap-4 items-center transition-colors`}
                          >
                            {/* Office */}
                            <div className="flex items-center gap-2">
                              {getOfficeLogo(request.offices?.acronym) && (
                                <img
                                  src={getOfficeLogo(request.offices.acronym)}
                                  alt={request.offices.acronym}
                                  className="w-6 h-6 object-contain flex-shrink-0"
                                />
                              )}
                              <span
                                className="text-[#4D49FC] font-semibold text-xs"
                                style={{ fontFamily: "Inter, sans-serif" }}
                              >
                                {request.offices?.acronym || "N/A"}
                              </span>
                            </div>

                            {/* Program Title */}
                            <div>
                              <span
                                className="text-[#040195] font-semibold text-sm"
                                style={{ fontFamily: "Inter, sans-serif" }}
                              >
                                {request.programs?.title || request.title || "N/A"}
                              </span>
                            </div>

                            {/* Reason */}
                            <div>
                              <span
                                className="text-gray-600 text-xs line-clamp-2"
                                style={{ fontFamily: "Inter, sans-serif" }}
                              >
                                {request.reason || "No reason provided"}
                              </span>
                            </div>

                            {/* Requested By */}
                            <div>
                              <span
                                className="text-gray-700 text-xs"
                                style={{ fontFamily: "Inter, sans-serif" }}
                              >
                                {request.offices?.acronym || "Unknown"}
                              </span>
                            </div>

                            {/* Status Badge */}
                            <div>
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                  request.status === "pending"
                                    ? "bg-red-500 text-white"
                                    : request.status === "approved"
                                    ? "bg-green-500 text-white"
                                    : "bg-red-600 text-white"
                                }`}
                                style={{ fontFamily: "Inter, sans-serif" }}
                              >
                                {request.status.toUpperCase()}
                              </span>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-center gap-2">
                              {request.status === "pending" && (
                                <>
                                  <button
                                    onClick={() => approveRequestMutation.mutate(request.id)}
                                    disabled={approveRequestMutation.isPending}
                                    className="px-4 py-1.5 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-xs"
                                    style={{ fontFamily: "Inter, sans-serif" }}
                                  >
                                    {approveRequestMutation.isPending ? "..." : "APPROVE"}
                                  </button>
                                  <button
                                    onClick={() => rejectRequestMutation.mutate(request.id)}
                                    disabled={rejectRequestMutation.isPending}
                                    className="px-4 py-1.5 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-xs"
                                    style={{ fontFamily: "Inter, sans-serif" }}
                                  >
                                    {rejectRequestMutation.isPending ? "..." : "REJECT"}
                                  </button>
                                </>
                              )}
                              {request.status === "approved" && (
                                <span
                                  className="text-green-600 text-xs font-semibold"
                                  style={{ fontFamily: "Inter, sans-serif" }}
                                >
                                  ✓ Deleted
                                </span>
                              )}
                              {request.status === "rejected" && (
                                <span
                                  className="text-red-600 text-xs font-semibold"
                                  style={{ fontFamily: "Inter, sans-serif" }}
                                >
                                  ✗ Rejected
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
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

            <div className="mb-4">
              <label
                className="block text-sm font-bold text-[#040195] mb-2"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Description
              </label>
              <textarea
                defaultValue={editingProgram.description || ""}
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#4D49FC] focus:outline-none resize-none"
                style={{ fontFamily: "Inter, sans-serif" }}
                placeholder="Enter program description..."
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
        title="Success"
        message={successMessage || "Operation completed successfully."}
        onClose={() => {
          setShowSuccessModal(false);
          setSuccessMessage("");
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={deleteModalOpen}
        title="Delete Program"
        message="Are you sure you want to delete this program? This action cannot be undone."
        itemName={programToDelete?.title || programToDelete?.name}
        onConfirm={() => {
          if (programToDelete?.id) {
            deleteProgramMutation.mutate(programToDelete.id);
            setDeleteModalOpen(false);
          }
        }}
        onCancel={() => {
          setDeleteModalOpen(false);
          setProgramToDelete(null);
        }}
        isLoading={deleteProgramMutation.isPending}
        confirmButtonText="Delete Program"
      />
    </div>
  );
}
