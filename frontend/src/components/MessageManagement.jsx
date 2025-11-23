import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import MessageService from "@/services/messageService";
import { useAuth } from "@/context/AuthContext";

/**
 * Message Management Component
 * Displays message statistics and cleanup options
 * Available for both Unit Director and Office users
 */
export default function MessageManagement({ isUnitDirector = false }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showConfirm, setShowConfirm] = useState(false);
  const [cleanupResult, setCleanupResult] = useState(null);

  // Fetch message statistics (Unit Director only)
  const {
    data: stats,
    isLoading: statsLoading,
    refetch,
  } = useQuery({
    queryKey: ["message-stats"],
    queryFn: MessageService.getMessageStats,
    enabled: isUnitDirector,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch user's message count
  const { data: messagesData } = useQuery({
    queryKey: ["messages"],
    queryFn: MessageService.getMessages,
    select: (data) => data || { messages: [], unread: 0 },
    staleTime: 10 * 60 * 1000,
  });

  const messages = messagesData?.messages || [];
  const unreadCount = messagesData?.unread || 0;

  // Cleanup mutation
  const cleanupMutation = useMutation({
    mutationFn: MessageService.cleanupOldMessages,
    onSuccess: (data) => {
      setCleanupResult(data);
      refetch();
      queryClient.invalidateQueries(["messages"]);
      setTimeout(() => setCleanupResult(null), 5000);
    },
    onError: (error) => {
      console.error("Cleanup failed:", error);
      setCleanupResult({
        success: false,
        message: "Cleanup failed. Please try again.",
      });
      setTimeout(() => setCleanupResult(null), 5000);
    },
  });

  const handleCleanup = () => {
    setShowConfirm(false);
    cleanupMutation.mutate();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-[#040195] mb-2">
          Message Management
        </h3>
        <p className="text-sm text-gray-600">
          {isUnitDirector
            ? "Manage messages and system cleanup. Messages are automatically deleted after 3 years."
            : "View your message history and statistics."}
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Your Messages */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-blue-900">
              Your Messages
            </span>
            <svg
              className="w-5 h-5 text-blue-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
          </div>
          <div className="text-3xl font-bold text-blue-900">
            {messages.length}
          </div>
          <div className="text-xs text-blue-700 mt-1">Total conversations</div>
        </div>

        {/* Unread Messages */}
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-yellow-900">
              Unread
            </span>
            <svg
              className="w-5 h-5 text-yellow-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
          </div>
          <div className="text-3xl font-bold text-yellow-900">
            {unreadCount}
          </div>
          <div className="text-xs text-yellow-700 mt-1">Need attention</div>
        </div>

        {/* System Total (Unit Director only) */}
        {isUnitDirector && !statsLoading && stats?.stats && (
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-purple-900">
                System Total
              </span>
              <svg
                className="w-5 h-5 text-purple-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
                <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
                <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-purple-900">
              {stats.stats.total}
            </div>
            <div className="text-xs text-purple-700 mt-1">All messages</div>
          </div>
        )}

        {/* Read Messages (Office users) */}
        {!isUnitDirector && (
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-green-900">Read</span>
              <svg
                className="w-5 h-5 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="text-3xl font-bold text-green-900">
              {messages.length - unreadCount}
            </div>
            <div className="text-xs text-green-700 mt-1">Messages read</div>
          </div>
        )}
      </div>

      {/* Unit Director Only - Cleanup Section */}
      {isUnitDirector && !statsLoading && stats?.stats && (
        <div className="border-t border-gray-200 pt-6">
          {/* Retention Policy Info */}
          <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-200">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="flex-1">
                <h4 className="font-semibold text-blue-900 mb-1">
                  Retention Policy
                </h4>
                <p className="text-sm text-blue-800">
                  Messages are automatically retained for{" "}
                  <strong>{stats.stats.retentionPeriod}</strong>. Messages older
                  than this will be permanently deleted.
                </p>
                <p className="text-xs text-blue-700 mt-2">
                  Cutoff Date:{" "}
                  <strong>{formatDate(stats.stats.cutoffDate)}</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Old Messages Warning */}
          {stats.stats.oldMessages > 0 && (
            <div className="bg-yellow-50 rounded-lg p-4 mb-4 border border-yellow-200">
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="flex-1">
                  <h4 className="font-semibold text-yellow-900 mb-1">
                    Old Messages Found
                  </h4>
                  <p className="text-sm text-yellow-800">
                    There are <strong>{stats.stats.oldMessages}</strong>{" "}
                    messages older than 3 years that can be cleaned up.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Cleanup Button */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-1">
                Manual Cleanup
              </h4>
              <p className="text-sm text-gray-600">
                Remove messages older than 3 years to free up database space.
              </p>
            </div>
            <button
              onClick={() => setShowConfirm(true)}
              disabled={
                cleanupMutation.isPending || stats.stats.oldMessages === 0
              }
              className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
                stats.stats.oldMessages === 0
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg"
              }`}
            >
              {cleanupMutation.isPending ? (
                <>
                  <svg
                    className="animate-spin w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Cleaning...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Cleanup Old Messages
                </>
              )}
            </button>
          </div>

          {/* Cleanup Result */}
          {cleanupResult && (
            <div
              className={`mt-4 p-4 rounded-lg ${
                cleanupResult.success
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <div className="flex items-start gap-3">
                {cleanupResult.success ? (
                  <svg
                    className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                <div className="flex-1">
                  <p
                    className={`text-sm font-semibold ${
                      cleanupResult.success ? "text-green-900" : "text-red-900"
                    }`}
                  >
                    {cleanupResult.message}
                  </p>
                  {cleanupResult.deletedCount !== undefined && (
                    <p className="text-xs text-green-700 mt-1">
                      {cleanupResult.deletedCount} message
                      {cleanupResult.deletedCount !== 1 ? "s" : ""} removed
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Office Users - Info Section */}
      {!isUnitDirector && (
        <div className="border-t border-gray-200 pt-6">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="flex-1">
                <h4 className="font-semibold text-blue-900 mb-1">
                  Message Retention
                </h4>
                <p className="text-sm text-blue-800">
                  Your messages with the Unit Director are automatically
                  retained for 3 years. Messages older than this period are
                  automatically removed by the system.
                </p>
                <p className="text-xs text-blue-700 mt-2">
                  Important conversations should be archived or documented
                  separately.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Confirm Cleanup
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  This will permanently delete{" "}
                  <strong>{stats?.stats.oldMessages}</strong> messages older
                  than 3 years. This action cannot be undone.
                </p>
                <p className="text-xs text-gray-500">
                  Are you sure you want to continue?
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCleanup}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Yes, Delete Messages
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

MessageManagement.propTypes = {
  isUnitDirector: PropTypes.bool,
};
