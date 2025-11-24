import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import MessageService from "@/services/messageService";
import { useAuth } from "@/context/AuthContext";

/**
 * Message Management Component
 * Displays message statistics and automatic cleanup notice
 * Available for both Unit Director and Office users
 */
export default function MessageManagement({ isUnitDirector = false }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [cleanupResult, setCleanupResult] = useState(null);

  // Fetch message statistics
  const {
    data: stats,
    isLoading: statsLoading,
    refetch,
  } = useQuery({
    queryKey: ["message-stats"],
    queryFn: MessageService.getMessageStats,
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
  const readCount = messages.length - unreadCount;

  // Calculate days until end of year
  const getDaysUntilYearEnd = () => {
    const now = new Date();
    const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
    const diffTime = endOfYear - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilDeletion = getDaysUntilYearEnd();

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-[#040195] mb-2">
          Message Management
        </h3>
        <p className="text-sm text-gray-600">
          View message statistics and automatic cleanup information
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* System Total */}
        {!statsLoading && stats?.stats && (
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

        {/* Read Messages */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-green-900">
              Read Messages
            </span>
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
          <div className="text-3xl font-bold text-green-900">{readCount}</div>
          <div className="text-xs text-green-700 mt-1">Messages read</div>
        </div>

        {/* Unread Messages */}
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-yellow-900">
              Unread Messages
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
      </div>

      {/* Automatic Cleanup Notice */}
      <div className="border-t border-gray-200 pt-6">
        {/* Automatic Deletion Warning */}
        <div className="bg-red-50 rounded-lg p-5 mb-4 border-2 border-red-200">
          <div className="flex items-start gap-4">
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
              <h4 className="text-lg font-bold text-red-900 mb-2">
                ⚠️ Automatic Message Deletion Notice
              </h4>
              <p className="text-sm text-red-800 font-semibold mb-3">
                ALL MESSAGES WILL BE AUTOMATICALLY DELETED IN{" "}
                {daysUntilDeletion} {daysUntilDeletion === 1 ? "DAY" : "DAYS"}
              </p>
              <div className="bg-white rounded-lg p-3 mb-3 border border-red-300">
                <p className="text-sm text-gray-800 mb-2">
                  <strong className="text-red-700">
                    Messages are retained for 1 year only.
                  </strong>
                </p>
                <p className="text-sm text-gray-700">
                  Before the year ends, all messages including:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-700 ml-2 mt-1 space-y-1">
                  <li>Unit Director messages</li>
                  <li>Office messages</li>
                  <li>All conversation threads</li>
                  <li>Both read and unread messages</li>
                </ul>
                <p className="text-sm text-gray-700 mt-2">
                  will be{" "}
                  <strong className="text-red-700">permanently deleted</strong>{" "}
                  automatically by the system.
                </p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-300">
                <p className="text-xs text-yellow-900 font-semibold">
                  💡 IMPORTANT: Save or archive any important conversations
                  before they are deleted!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cleanup Result (if any) */}
      {cleanupResult && (
        <div
          className={`p-4 rounded-lg ${
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
  );
}

MessageManagement.propTypes = {
  isUnitDirector: PropTypes.bool,
};
