import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import SuccessModal from "@/components/SuccessModal";
import ListSkeleton from "@/components/ListSkeleton";
import { Plus, Trash2 } from "lucide-react";
import UserService from "@/services/userService";

/**
 * Office Program Request Component
 * Allows offices to request new programs which need Unit Director approval
 * This component is embedded in the Settings page
 */
export default function OfficeProgramRequests() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [programName, setProgramName] = useState("");
  const [programDescription, setProgramDescription] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Fetch program requests for this office
  const { data: requestsData, isLoading } = useQuery({
    queryKey: ['program-requests', user?.office_id],
    queryFn: () => UserService.getProgramRequests(),
    staleTime: 30000,
  });

  // Submit program request mutation
  const submitRequestMutation = useMutation({
    mutationFn: (requestData) => UserService.submitProgramRequest(requestData),
    onSuccess: () => {
      queryClient.invalidateQueries(['program-requests']);
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
      setShowSuccessModal(true);
    },
    onError: (error) => {
      alert(error.response?.data?.error || "Failed to delete program request");
    },
  });

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

  const handleDeleteRequest = (requestId) => {
    if (confirm("Are you sure you want to delete this program request?")) {
      deleteRequestMutation.mutate(requestId);
    }
  };

  const requests = requestsData?.requests || [];

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      approved: "bg-green-100 text-green-800 border-green-300",
      rejected: "bg-red-100 text-red-800 border-red-300",
    };
    return styles[status] || styles.pending;
  };

  return (
    <>
      {/* Header */}
      <div className="mb-6 pb-6 border-b-2 border-gray-200">
        <h2
          className="text-3xl font-bold text-[#040195] mb-2"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Program Requests
        </h2>
        <p
          className="text-gray-500"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Submit and track program approval requests
        </p>
      </div>

      {/* Request Form Section */}
      <div className="mb-6 bg-white rounded-2xl border-2 border-[#7E7DC5] p-6">
        <h3 className="text-xl font-bold text-[#040195] mb-4 flex items-center gap-2">
          <Plus size={20} />
          Request New Program
        </h3>
        <form onSubmit={handleSubmitRequest} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-[#040195] mb-2">
              Program Name
            </label>
            <input
              type="text"
              value={programName}
              onChange={(e) => setProgramName(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#040195] focus:outline-none"
              placeholder="Enter program name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#040195] mb-2">
              Program Description
            </label>
            <input
              type="text"
              value={programDescription}
              onChange={(e) => setProgramDescription(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#040195] focus:outline-none"
              placeholder="Enter program description (optional)"
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={submitRequestMutation.isPending}
              className="bg-[#4D49FC] hover:bg-[#3d39cc] text-white font-bold py-3 px-8 rounded-lg transition-all disabled:opacity-50"
            >
              {submitRequestMutation.isPending ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>

      {/* Program Requests Grid */}
      {isLoading ? (
        <div className="py-4">
          <ListSkeleton items={4} />
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Plus size={40} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No program requests yet
          </h3>
          <p className="text-gray-500">
            Submit a request above to get started
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {requests.map((request) => (
            <div
              key={request.id}
              className={`bg-white rounded-2xl p-6 hover:shadow-lg transition-all border-2 ${
                request.status === 'pending' ? 'border-[#7E7DC5]' :
                request.status === 'approved' ? 'border-green-300 bg-green-50' :
                'border-red-300 bg-red-50'
              }`}
            >
              {/* Request Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className={`text-xl font-bold mb-2 ${
                    request.status === 'pending' ? 'text-[#040195]' :
                    request.status === 'approved' ? 'text-green-800' :
                    'text-red-800'
                  }`}>
                    {request.title}
                  </h3>
                  {request.description && (
                    <p className={`text-sm ${
                      request.status === 'pending' ? 'text-gray-600' :
                      request.status === 'approved' ? 'text-green-700' :
                      'text-red-700'
                    }`}>
                      {request.description}
                    </p>
                  )}
                </div>
                {(request.status === 'pending' || request.status === 'rejected') && (
                  <button
                    onClick={() => handleDeleteRequest(request.id)}
                    className="ml-4 text-red-500 hover:text-red-700 transition-colors"
                    title="Delete request"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>

              {/* Status Badge */}
              <div className="pt-4 border-t border-gray-200">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(
                    request.status
                  )}`}
                >
                  {request.status.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <SuccessModal
        show={showSuccessModal}
        action="submitted"
        itemName="Program Request"
        onClose={() => setShowSuccessModal(false)}
      />
    </>
  );
}
