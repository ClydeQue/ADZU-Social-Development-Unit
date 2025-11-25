import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { Search, Plus, AlertCircle } from "lucide-react";
import UserService from "@/services/userService";
import OfficeService from "@/services/officeService";
import SuccessModal from "@/components/SuccessModal";

/**
 * Office Manage Programs Component
 * Allows offices to request new programs and view approved programs
 * This component is embedded in the Settings page
 */
export default function OfficeManagePrograms() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [programName, setProgramName] = useState("");
  const [programDescription, setProgramDescription] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [deleteReason, setDeleteReason] = useState("");
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Debug: Log user object to see its structure
  console.log('🔍 ManagePrograms - User Object:', {
    user,
    officeId: user?.office_id,
    officeIdPresent: 'office_id' in (user || {}),
    userKeys: user ? Object.keys(user) : [],
    fullUser: JSON.stringify(user, null, 2)
  });

  // Fetch all programs from the database for this office
  const { data: programsData = [], isLoading: isProgramsLoading } = useQuery({
    queryKey: ['office-programs', user?.office_id],
    queryFn: async () => {
      console.log('🔄 Fetching programs for office_id:', user?.office_id);
      if (!user?.office_id) {
        console.error('❌ Cannot fetch programs: office_id is missing from user object!');
        return [];
      }
      const programs = await OfficeService.getOfficePrograms(user?.office_id);
      console.log('✅ Office Programs fetched:', programs);
      return programs;
    },
    enabled: !!user?.office_id,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Fetch program requests for this office (pending/rejected requests)
  const { data: requestsData, isLoading: isRequestsLoading } = useQuery({
    queryKey: ['program-requests', user?.office_id],
    queryFn: () => UserService.getProgramRequests(),
    staleTime: 30000,
  });

  // Fetch program change requests (edit/delete requests)
  const { data: changeRequestsData } = useQuery({
    queryKey: ['program-change-requests', user?.office_id],
    queryFn: () => UserService.getProgramChangeRequests(),
    staleTime: 30000,
  });

  // Submit program request mutation
  const submitRequestMutation = useMutation({
    mutationFn: (requestData) => UserService.submitProgramRequest(requestData),
    onSuccess: () => {
      queryClient.invalidateQueries(['program-requests', user?.office_id]);
      queryClient.invalidateQueries(['office-programs', user?.office_id]);
      setProgramName("");
      setProgramDescription("");
      setShowSuccessModal(true);
    },
    onError: (error) => {
      alert(error.response?.data?.error || "Failed to submit program request");
    },
  });

  // Delete program request mutation
  const deleteRequestMutation = useMutation({
    mutationFn: (requestId) => UserService.deleteProgramRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries(['program-requests']);
    },
    onError: (error) => {
      alert(error.response?.data?.error || "Failed to delete program request");
    },
  });

  // Submit program update request mutation
  const updateRequestMutation = useMutation({
    mutationFn: (requestData) => UserService.submitProgramUpdateRequest(requestData),
    onSuccess: () => {
      queryClient.invalidateQueries(['program-change-requests']);
      setShowEditDialog(false);
      setEditingProgram(null);
      setShowSuccessModal(true);
    },
    onError: (error) => {
      alert(error.response?.data?.error || "Failed to submit update request");
    },
  });

  // Submit program delete request mutation
  const deleteChangeRequestMutation = useMutation({
    mutationFn: (requestData) => UserService.submitProgramDeleteRequest(requestData),
    onSuccess: () => {
      queryClient.invalidateQueries(['program-change-requests']);
      setShowDeleteDialog(false);
      setEditingProgram(null);
      setDeleteReason("");
      setShowSuccessModal(true);
    },
    onError: (error) => {
      alert(error.response?.data?.error || "Failed to submit delete request");
    },
  });

  // Cancel change request mutation
  const cancelChangeRequestMutation = useMutation({
    mutationFn: (requestId) => UserService.cancelProgramChangeRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries(['program-change-requests']);
    },
    onError: (error) => {
      alert(error.response?.data?.error || "Failed to cancel request");
    },
  });

  const dbPrograms = programsData || [];
  const requests = requestsData?.requests || [];
  const changeRequests = changeRequestsData?.changeRequests || [];
  
  console.log('📊 Office ManagePrograms Debug:', {
    officeId: user?.office_id,
    dbPrograms,
    requests,
    changeRequests,
    dbProgramsCount: dbPrograms.length,
    requestsCount: requests.length,
    changeRequestsCount: changeRequests.length
  });

  // Check if a program has pending change requests
  const getProgramChangeRequest = (programId) => {
    return changeRequests.find(req => req.program_id === programId && req.status === 'pending');
  };
  
  // Merge database programs and program requests into unified list
  // Programs from database (actual programs table)
  const programsList = dbPrograms.map(program => {
    const changeRequest = getProgramChangeRequest(program.id);
    return {
      id: program.id,
      name: program.title,
      description: program.description,
      created_at: program.created_at,
      updated_at: program.updated_at,
      is_fixed: program.is_fixed,
      status: 'approved',
      source: 'program',
      changeRequest // Include pending change request if exists
    };
  });
  
  // Program requests (pending/rejected)
  const programRequestsList = requests.map(request => ({
    id: request.id,
    name: request.title,
    description: request.description,
    status: request.status,
    created_at: request.created_at,
    source: 'request'
  }));
  
  // Combine all programs
  const allPrograms = [...programsList, ...programRequestsList];
  
  // Filter programs based on search
  const filteredPrograms = allPrograms.filter(program =>
    program.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    program.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmitRequest = (e) => {
    e.preventDefault();
    
    if (!programName.trim()) {
      alert("Program name is required");
      return;
    }

    submitRequestMutation.mutate({
      title: programName,
      description: programDescription,
    });
  };

  const handleDeleteRequest = (programId, source) => {
    if (source !== 'request') {
      alert("Cannot delete approved programs. Only pending or rejected requests can be deleted.");
      return;
    }
    if (confirm("Are you sure you want to delete this program request?")) {
      deleteRequestMutation.mutate(programId);
    }
  };

  const handleEditProgram = (program) => {
    setEditingProgram(program);
    setProgramName(program.name);
    setProgramDescription(program.description || "");
    setShowEditDialog(true);
  };

  const handleSubmitEdit = () => {
    if (!programName.trim()) {
      alert("Program name is required");
      return;
    }

    updateRequestMutation.mutate({
      program_id: editingProgram.id,
      new_title: programName.trim(),
      new_description: programDescription.trim() || null,
      reason: "Program information update"
    });
  };

  const handleDeleteProgram = (program) => {
    setEditingProgram(program);
    setShowDeleteDialog(true);
  };

  const handleSubmitDelete = () => {
    if (!deleteReason.trim()) {
      alert("Please provide a reason for deletion");
      return;
    }

    deleteChangeRequestMutation.mutate({
      program_id: editingProgram.id,
      reason: deleteReason.trim()
    });
  };

  const handleCancelChangeRequest = (requestId) => {
    if (confirm("Are you sure you want to cancel this change request?")) {
      cancelChangeRequestMutation.mutate(requestId);
    }
  };

  const isLoading = isProgramsLoading || isRequestsLoading;

  return (
    <div className="flex-1 overflow-y-auto max-h-[calc(100vh-10rem)]">
      {/* Header */}
      <div className="mb-6 pb-4 border-b-2 border-gray-200">
        <h2
          className="text-3xl font-bold text-[#040195] mb-2"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Manage Programs
        </h2>
        <p
          className="text-gray-500 text-sm"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Request new programs, track pending requests, and view approved programs
        </p>
      </div>

      {/* Request Form Section */}
      <div className="mb-6 border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
        <h3 className="text-md font-semibold text-[#040195] mb-3 flex items-center gap-2" style={{ fontFamily: "Inter, sans-serif" }}>
          <Plus className="w-5 h-5" />
          Request New Program
        </h3>
        <form onSubmit={handleSubmitRequest} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Program Name"
              value={programName}
              onChange={(e) => setProgramName(e.target.value)}
              className="px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-[#040195] focus:outline-none text-sm"
              style={{ fontFamily: "Inter, sans-serif" }}
              required
            />
            <input
              type="text"
              placeholder="Description"
              value={programDescription}
              onChange={(e) => setProgramDescription(e.target.value)}
              className="px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-[#040195] focus:outline-none text-sm"
              style={{ fontFamily: "Inter, sans-serif" }}
            />
          </div>
          <button
            type="submit"
            disabled={submitRequestMutation.isPending}
            className="px-4 py-2 bg-[#040195] text-white rounded-lg hover:bg-[#030174] transition-colors disabled:opacity-50 text-sm font-medium"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            {submitRequestMutation.isPending ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search programs..."
            className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-[#040195] focus:outline-none text-sm"
            style={{ fontFamily: "Inter, sans-serif" }}
          />
        </div>
      </div>

      {/* All Programs Section */}
      <div className="h-full flex flex-col">
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
        <div className="bg-[#1E22AA] text-white rounded-xl px-6 py-3 mb-1 grid grid-cols-[1fr_100px_150px] gap-4 items-center flex-shrink-0">
          <div className="text-xs font-semibold uppercase">Program Name & Description</div>
          <div className="text-xs font-semibold uppercase text-center">Status</div>
          <div className="text-xs font-semibold uppercase text-center">Actions</div>
        </div>

        {/* Table Body */}
        {isLoading ? (
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="text-center py-8">
              <div className="inline-block w-6 h-6 border-3 border-[#040195] border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-3 text-gray-500 text-xs" style={{ fontFamily: "Inter, sans-serif" }}>Loading...</p>
            </div>
          </div>
        ) : filteredPrograms.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center text-gray-500" style={{ fontFamily: "Inter, sans-serif" }}>
            {searchQuery ? 'No programs found' : 'No programs yet. Submit a request above.'}
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto overflow-x-hidden pr-2 programs-scroll-container min-h-0">
            <div className="space-y-1.5">
              {filteredPrograms.map((program) => (
                <div
                  key={`${program.source}-${program.id}`}
                  className={`${
                    program.status === 'pending'
                      ? "bg-[#FFF9E6] border-2 border-yellow-300"
                      : program.status === 'approved'
                      ? "bg-[#F4F4F4] hover:bg-[#D4D1FF]"
                      : "bg-[#FFE6E6] border-2 border-red-300"
                  } rounded-lg px-6 py-3 grid grid-cols-[1fr_100px_150px] gap-4 items-center transition-colors`}
                >
                  {/* Program Name & Description */}
                  <div className="flex flex-col">
                    <span className="text-[#4D49FC] font-semibold text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
                      {program.name}
                    </span>
                    {program.description && (
                      <span className="text-gray-600 text-xs mt-1 line-clamp-2" style={{ fontFamily: "Inter, sans-serif" }}>
                        {program.description}
                      </span>
                    )}
                    {/* Show pending change request warning */}
                    {program.changeRequest && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-orange-600">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span style={{ fontFamily: "Inter, sans-serif" }}>
                          {program.changeRequest.request_type === 'update' ? 'Edit' : 'Delete'} request pending
                        </span>
                        <button
                          onClick={() => handleCancelChangeRequest(program.changeRequest.id)}
                          className="ml-1 underline hover:text-orange-800 font-semibold"
                          style={{ fontFamily: "Inter, sans-serif" }}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div className="flex justify-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        program.status === "pending"
                          ? "bg-yellow-500 text-white"
                          : program.status === "approved"
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      {program.status === 'approved' ? 'APPROVED' : program.status === 'pending' ? 'PENDING' : 'REJECTED'}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-center gap-2">
                    {program.status === 'approved' && !program.changeRequest && (
                      <>
                        <button
                          onClick={() => handleEditProgram(program)}
                          className="px-4 py-1.5 bg-[#4D49FC] text-white font-semibold rounded-md hover:bg-[#201f65] transition-colors text-xs"
                          style={{ fontFamily: "Inter, sans-serif" }}
                          title="Request edit"
                        >
                          EDIT
                        </button>
                        <button
                          onClick={() => handleDeleteProgram(program)}
                          className="px-4 py-1.5 bg-[#FF4D4D] text-white font-semibold rounded-md hover:bg-[#E63939] transition-colors text-xs"
                          style={{ fontFamily: "Inter, sans-serif" }}
                          title="Request deletion"
                        >
                          DELETE
                        </button>
                      </>
                    )}
                    {/* Delete Button for Pending/Rejected Requests */}
                    {program.status !== 'approved' && (
                      <button
                        onClick={() => handleDeleteRequest(program.id, program.source)}
                        disabled={deleteRequestMutation.isPending}
                        className="px-4 py-1.5 bg-[#FF4D4D] text-white font-semibold rounded-md hover:bg-[#E63939] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-xs"
                        style={{ fontFamily: "Inter, sans-serif" }}
                        title="Delete request"
                      >
                        {deleteRequestMutation.isPending ? "DELETING..." : "DELETE"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <SuccessModal
          message="Request submitted successfully! Waiting for Unit Director approval."
          onClose={() => setShowSuccessModal(false)}
        />
      )}

      {/* Edit Program Dialog */}
      {showEditDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-[#040195] mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
              Request Program Edit
            </h3>
            <p className="text-sm text-gray-600 mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
              Submit a request to edit this program. Changes will be applied after Unit Director approval.
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: "Inter, sans-serif" }}>
                  Program Name *
                </label>
                <input
                  type="text"
                  value={programName}
                  onChange={(e) => setProgramName(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-[#040195] focus:outline-none text-sm"
                  style={{ fontFamily: "Inter, sans-serif" }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: "Inter, sans-serif" }}>
                  Description
                </label>
                <textarea
                  value={programDescription}
                  onChange={(e) => setProgramDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-[#040195] focus:outline-none text-sm"
                  style={{ fontFamily: "Inter, sans-serif" }}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => {
                  setShowEditDialog(false);
                  setEditingProgram(null);
                  setProgramName("");
                  setProgramDescription("");
                }}
                className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitEdit}
                disabled={updateRequestMutation.isPending}
                className="flex-1 px-4 py-2 bg-[#040195] text-white rounded-lg hover:bg-[#030174] transition-colors disabled:opacity-50 text-sm font-medium"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {updateRequestMutation.isPending ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Program Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-red-600 mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
              Request Program Deletion
            </h3>
            <p className="text-sm text-gray-600 mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
              Submit a request to delete <strong>{editingProgram?.name}</strong>. This will be reviewed by the Unit Director.
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: "Inter, sans-serif" }}>
                  Reason for Deletion *
                </label>
                <textarea
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  rows={3}
                  placeholder="Explain why this program should be deleted..."
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-[#040195] focus:outline-none text-sm"
                  style={{ fontFamily: "Inter, sans-serif" }}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => {
                  setShowDeleteDialog(false);
                  setEditingProgram(null);
                  setDeleteReason("");
                }}
                className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitDelete}
                disabled={deleteChangeRequestMutation.isPending}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 text-sm font-medium"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {deleteChangeRequestMutation.isPending ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
