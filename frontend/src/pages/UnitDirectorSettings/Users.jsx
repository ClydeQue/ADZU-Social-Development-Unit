import { useState, useMemo } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import WhiteContainer from "@/components/WhiteContainer";
import Sidebar from "@/components/Sidebar";
import SettingsNavbar from "./SettingsNavbar";
import SuccessModal from "@/components/SuccessModal";
import settingsService from "@/services/settingsService";

/**
 * Users Management Page
 * Allows Unit Director to manage users and approve password reset requests
 */
export default function UsersManagement() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("users"); // 'users' or 'reset-requests'
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Fetch office users
  const {
    data: usersData,
    isLoading: usersLoading,
    error: usersError,
  } = useQuery({
    queryKey: ["officeUsers"],
    queryFn: async () => {
      const response = await settingsService.getOfficeUsers();
      return response; // api interceptor already returns response.data
    },
  });

  const users = usersData?.users || [];

  // Fetch password reset requests
  const { data: resetRequestsData, isLoading: resetRequestsLoading } = useQuery({
    queryKey: ["password-reset-requests"],
    queryFn: async () => {
      const response = await settingsService.getPasswordResetRequests();
      return response;
    },
  });

  const resetRequests = resetRequestsData?.requests || [];

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

  // Filter users by search
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;

    const query = searchQuery.toLowerCase();
    return users.filter(
      (user) =>
        user.username.toLowerCase().includes(query) ||
        user.office.toLowerCase().includes(query)
    );
  }, [searchQuery, users]);

  // Approve reset request mutation
  const approveResetMutation = useMutation({
    mutationFn: async (requestId) => {
      return await settingsService.approvePasswordReset(requestId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["password-reset-requests"]);
      setShowSuccessModal(true);
    },
  });

  // Reject reset request mutation
  const rejectResetMutation = useMutation({
    mutationFn: async (requestId) => {
      return await settingsService.rejectPasswordReset(requestId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["password-reset-requests"]);
    },
  });

  const handleApproveReset = (request) => {
    if (confirm(`Approve password reset for ${request.username}? Password will be reset to password123`)) {
      approveResetMutation.mutate(request.id);
    }
  };

  const handleRejectReset = (request) => {
    if (confirm(`Reject password reset request for ${request.username}?`)) {
      rejectResetMutation.mutate(request.id);
    }
  };

  return (
    <div className="flex bg-[#EAE9E9] min-h-screen max-h-screen p-[35px] overflow-hidden">
      <WhiteContainer>
        <Sidebar />

        <main className="flex-grow pt-6 pb-10 md:pb-6 p-2 flex flex-col overflow-hidden">
          <div className="h-full flex flex-col max-w-[1536px] w-full mx-auto">
            {/* Navbar */}
            <SettingsNavbar title="User Management" showSearch={false} />

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

              {/* Tabs */}
              <div className="bg-white rounded-xl cursor-pointer shadow-md p-2 mb-6">
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab("users")}
                    className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
                      activeTab === "users"
                        ? "bg-[#4D49FC] text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    <div className="flex items-center justify-center cursor-pointer gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                      All Users ({users.length})
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab("reset-requests")}
                    className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
                      activeTab === "reset-requests"
                        ? "bg-[#FF0022] text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    <div className="flex items-center justify-center cursor-pointer gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                      Reset Requests (
                      {resetRequests.length}
                      )
                    </div>
                  </button>
                </div>
              </div>

              {/* Users List */}
              {activeTab === "users" && (
                <div
                  className="h-full flex flex-col"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  <style>{`
                  .users-scroll-container::-webkit-scrollbar {
                    width: 5px;
                  }
                  .users-scroll-container::-webkit-scrollbar-track {
                    background: transparent;
                  }
                  .users-scroll-container::-webkit-scrollbar-thumb {
                    background-color: #040195;
                    border-radius: 42px;
                  }
                  .users-scroll-container::-webkit-scrollbar-thumb:hover {
                    background-color: #030174;
                  }
                `}</style>

                  {/* Table Header */}
                  <div className="bg-[#040195] text-white rounded-xl px-6 py-3 mb-1 grid grid-cols-[250px_1fr_250px] gap-4 items-center flex-shrink-0">
                    <div className="text-xs font-semibold uppercase">
                      Office
                    </div>
                    <div className="text-xs font-semibold uppercase">
                      Active Status
                    </div>
                    <div className="text-xs font-semibold uppercase text-right">
                      Last Password Update
                    </div>
                  </div>

                  {/* Table Body - Scrollable Container */}
                  {usersLoading ? (
                    <div className="bg-white rounded-xl shadow-md p-12 text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4D49FC] mx-auto"></div>
                      <p className="text-gray-500 mt-4">Loading users...</p>
                    </div>
                  ) : filteredUsers.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md p-12 text-center">
                      <svg
                        className="w-16 h-16 text-gray-300 mx-auto mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p
                        className="text-gray-500 text-lg"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        No users found matching your search
                      </p>
                    </div>
                  ) : (
                    <div className="flex-1 overflow-y-auto overflow-x-hidden pr-2 users-scroll-container min-h-0">
                      <div className="space-y-1.5">
                        {filteredUsers.map((user) => (
                          <div
                            key={user.id}
                            className="bg-[#F4F4F4] hover:bg-[#E5E5FF] transition-colors rounded-lg px-6 py-3 grid grid-cols-[250px_1fr_250px] gap-4 items-center"
                          >
                            <div className="flex items-center gap-3">
                              {getOfficeLogo(user.office) && (
                                <img
                                  src={getOfficeLogo(user.office)}
                                  alt={`${user.office} Logo`}
                                  className="w-10 h-10 object-contain rounded-lg"
                                />
                              )}
                              <span
                                className="text-[#4D49FC] font-semibold text-sm"
                                style={{ fontFamily: "Inter, sans-serif" }}
                              >
                                {user.office}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  user.isActive ? "bg-green-500" : "bg-red-500"
                                }`}
                              ></div>
                              <span
                                className="text-gray-700 text-sm"
                                style={{ fontFamily: "Inter, sans-serif" }}
                              >
                                {user.isActive ? "Active Now" : "Inactive"}
                              </span>
                            </div>
                            <div className="flex items-center justify-end">
                              <span
                                className="text-gray-600 text-xs font-medium"
                                style={{ fontFamily: "Inter, sans-serif" }}
                              >
                                {user.lastPasswordUpdate
                                  ? new Date(
                                      user.lastPasswordUpdate
                                    ).toLocaleString("en-US", {
                                      year: "numeric",
                                      month: "2-digit",
                                      day: "2-digit",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: true,
                                    })
                                  : "Never"}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Reset Requests List */}
              {activeTab === "reset-requests" && (
                <div className="space-y-4">
                  {resetRequestsLoading ? (
                    <div className="bg-white rounded-xl shadow-md p-12 text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4D49FC] mx-auto"></div>
                      <p className="text-gray-500 mt-4">Loading reset requests...</p>
                    </div>
                  ) : resetRequests.filter((r) => r.status === "pending").length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md p-12 text-center">
                      <svg
                        className="w-16 h-16 text-gray-300 mx-auto mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p
                        className="text-gray-500 text-lg"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        No pending password reset requests
                      </p>
                    </div>
                  ) : (
                    resetRequests
                      .filter((request) => request.status === "pending")
                      .map((request) => (
                        <div
                          key={request.id}
                          className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                {getOfficeLogo(request.office) ? (
                                  <img
                                    src={getOfficeLogo(request.office)}
                                    alt={`${request.office} Logo`}
                                    className="w-12 h-12 object-contain rounded-lg"
                                  />
                                ) : (
                                  <div className="w-12 h-12 bg-[#FFAE00] rounded-full flex items-center justify-center text-white font-bold text-lg">
                                    {request.office.charAt(0).toUpperCase()}
                                  </div>
                                )}
                                <div>
                                  <h3
                                    className="text-lg font-bold text-[#040195]"
                                    style={{ fontFamily: "Inter, sans-serif" }}
                                  >
                                    {request.office}
                                  </h3>
                                  <p
                                    className="text-sm text-gray-600"
                                    style={{ fontFamily: "Inter, sans-serif" }}
                                  >
                                    Password Reset Request
                                  </p>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                  <span
                                    className="text-gray-600"
                                    style={{ fontFamily: "Inter, sans-serif" }}
                                  >
                                    Requested on:{" "}
                                    <strong>
                                      {new Date(request.requestDate).toLocaleString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                        hour: 'numeric',
                                        minute: '2-digit',
                                        hour12: true
                                      })}
                                    </strong>
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col gap-2 ml-4">
                              <button
                                onClick={() => handleApproveReset(request)}
                                disabled={approveResetMutation.isPending}
                                className="px-6 py-2 bg-[#18B703] text-white font-semibold rounded-lg hover:bg-[#159502] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                style={{ fontFamily: "Inter, sans-serif" }}
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleRejectReset(request)}
                                disabled={rejectResetMutation.isPending}
                                className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                style={{ fontFamily: "Inter, sans-serif" }}
                              >
                                Deny
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </WhiteContainer>

      {/* Success Modal */}
      <SuccessModal
        show={showSuccessModal}
        action="approved"
        itemName="Password reset"
        onClose={() => setShowSuccessModal(false)}
      />
    </div>
  );
}
