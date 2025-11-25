import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, XCircle, Clock, Trash2, Edit, Plus, AlertCircle } from "lucide-react";
import { unitDirectorService } from "../../services/unitDirectorService";

const ReviewProgramRequests = () => {
  const [activeTab, setActiveTab] = useState("create");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const queryClient = useQueryClient();

  // Fetch all program requests
  const { data: requestsData, isLoading } = useQuery({
    queryKey: ["unit-director-program-requests"],
    queryFn: () => unitDirectorService.getProgramRequests(),
  });

  const requests = requestsData?.requests || [];

  // Filter requests by type and status
  const filterRequestsByType = (type) => {
    return requests.filter(
      (req) => req.request_type === type && req.status === "pending"
    );
  };

  const createRequests = filterRequestsByType("create");
  const updateRequests = filterRequestsByType("update");
  const deleteRequests = filterRequestsByType("delete");

  // Approve mutation
  const approveMutation = useMutation({
    mutationFn: (requestId) => unitDirectorService.approveProgramRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries(["unit-director-program-requests"]);
      setShowApproveDialog(false);
      setSelectedRequest(null);
    },
  });

  // Reject mutation
  const rejectMutation = useMutation({
    mutationFn: ({ requestId, reason }) =>
      unitDirectorService.rejectProgramRequest(requestId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries(["unit-director-program-requests"]);
      setShowRejectDialog(false);
      setSelectedRequest(null);
      setRejectionReason("");
    },
  });

  const handleApprove = (request) => {
    setSelectedRequest(request);
    setShowApproveDialog(true);
  };

  const handleReject = (request) => {
    setSelectedRequest(request);
    setShowRejectDialog(true);
  };

  const confirmApprove = () => {
    if (selectedRequest) {
      approveMutation.mutate(selectedRequest.id);
    }
  };

  const confirmReject = () => {
    if (selectedRequest) {
      rejectMutation.mutate({
        requestId: selectedRequest.id,
        reason: rejectionReason,
      });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const tabs = [
    { id: "create", label: "New Programs", icon: Plus, count: createRequests.length },
    { id: "update", label: "Edit Requests", icon: Edit, count: updateRequests.length },
    { id: "delete", label: "Delete Requests", icon: Trash2, count: deleteRequests.length },
  ];

  const renderRequestCard = (request) => {
    const isCreate = request.request_type === "create";
    const isUpdate = request.request_type === "update";
    const isDelete = request.request_type === "delete";

    return (
      <div
        key={request.id}
        className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-gray-500">
                {request.offices?.acronym || "N/A"}
              </span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-400">
                {formatDate(request.created_at)}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              {isCreate
                ? request.title
                : isUpdate
                ? request.programs?.title || request.title
                : request.programs?.title || request.title}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {request.offices?.name || "Unknown Office"}
            </p>
          </div>
        </div>

        {/* Content based on request type */}
        {isCreate && (
          <div className="space-y-3 mb-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Description:</p>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                {request.description || "No description provided"}
              </p>
            </div>
          </div>
        )}

        {isUpdate && (
          <div className="space-y-3 mb-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Current values */}
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-xs font-medium text-gray-500 uppercase mb-2">Current</p>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-500">Title:</p>
                    <p className="text-sm text-gray-900 font-medium">
                      {request.title || request.programs?.title}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Description:</p>
                    <p className="text-sm text-gray-700">
                      {request.description || request.programs?.description || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Proposed changes */}
              <div className="bg-blue-50 p-3 rounded border border-blue-200">
                <p className="text-xs font-medium text-blue-700 uppercase mb-2">Proposed</p>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-blue-600">Title:</p>
                    <p className="text-sm text-blue-900 font-medium">
                      {request.new_title || request.title}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-600">Description:</p>
                    <p className="text-sm text-blue-800">
                      {request.new_description || request.description || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {request.reason && (
              <div className="bg-amber-50 p-3 rounded border border-amber-200">
                <p className="text-xs font-medium text-amber-700 mb-1">Reason for change:</p>
                <p className="text-sm text-amber-900">{request.reason}</p>
              </div>
            )}
          </div>
        )}

        {isDelete && (
          <div className="space-y-3 mb-4">
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm font-medium text-gray-700 mb-1">Program Description:</p>
              <p className="text-sm text-gray-600">
                {request.description || request.programs?.description || "No description"}
              </p>
            </div>

            {request.reason && (
              <div className="bg-red-50 p-3 rounded border border-red-200">
                <div className="flex gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-red-700 mb-1">Reason for deletion:</p>
                    <p className="text-sm text-red-900">{request.reason}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={() => handleApprove(request)}
            disabled={approveMutation.isPending}
            className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
            Approve
          </button>
          <button
            onClick={() => handleReject(request)}
            disabled={rejectMutation.isPending}
            className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <XCircle className="w-4 h-4" />
            Reject
          </button>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    let requestList = [];
    let emptyMessage = "";

    switch (activeTab) {
      case "create":
        requestList = createRequests;
        emptyMessage = "No pending new program requests";
        break;
      case "update":
        requestList = updateRequests;
        emptyMessage = "No pending edit requests";
        break;
      case "delete":
        requestList = deleteRequests;
        emptyMessage = "No pending delete requests";
        break;
    }

    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (requestList.length === 0) {
      return (
        <div className="text-center py-12">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {requestList.map(renderRequestCard)}
      </div>
    );
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Program Requests</h1>
        <p className="text-gray-600">Review and manage program requests from offices</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-colors
                  ${
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {tab.count > 0 && (
                  <span
                    className={`
                    ml-2 px-2 py-0.5 text-xs rounded-full
                    ${
                      activeTab === tab.id
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }
                  `}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {renderTabContent()}

      {/* Approve Dialog */}
      {showApproveDialog && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Confirm Approval</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to approve this{" "}
              {selectedRequest.request_type === "create"
                ? "new program"
                : selectedRequest.request_type === "update"
                ? "program update"
                : "program deletion"}{" "}
              request from <strong>{selectedRequest.offices?.acronym}</strong>?
            </p>

            {selectedRequest.request_type === "delete" && (
              <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
                <p className="text-sm text-red-800">
                  ⚠️ This will permanently delete the program and cannot be undone.
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowApproveDialog(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmApprove}
                disabled={approveMutation.isPending}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
              >
                {approveMutation.isPending ? "Approving..." : "Approve"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Dialog */}
      {showRejectDialog && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Confirm Rejection</h3>
            <p className="text-gray-600 mb-4">
              Rejecting this request from <strong>{selectedRequest.offices?.acronym}</strong>. You
              can optionally provide a reason:
            </p>

            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Reason for rejection (optional)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
              rows="3"
            />

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRejectDialog(false);
                  setRejectionReason("");
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmReject}
                disabled={rejectMutation.isPending}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400"
              >
                {rejectMutation.isPending ? "Rejecting..." : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewProgramRequests;
