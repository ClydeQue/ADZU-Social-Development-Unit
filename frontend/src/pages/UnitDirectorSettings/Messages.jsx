import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import WhiteContainer from "@/components/WhiteContainer";
import Sidebar from "@/components/Sidebar";
import SettingsNavbar from "./SettingsNavbar";
import MessageService from "@/services/messageService";

export default function MessagesManagement() {
  const navigate = useNavigate();
  const [cleanupResult, setCleanupResult] = useState(null);

  // Fetch message statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
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
    <div className="flex bg-[#EAE9E9] min-h-screen max-h-screen p-[35px] overflow-hidden">
      <WhiteContainer>
        <Sidebar />

        <main className="flex-grow pt-6 pb-10 md:pb-6 p-2 flex flex-col overflow-hidden">
          <div className="h-full flex flex-col max-w-[1536px] w-full mx-auto">
            {/* Navbar */}
            <SettingsNavbar title="Messages" showSearch={false} />

            <div className="bg-[#F4F4F4] rounded-[15px] p-6 mx-4 flex-1 overflow-y-auto">
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
                  className="text-3xl font-bold text-[#040195]"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Message Management
                </h1>
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* System Total */}
                {!statsLoading && stats?.stats && (
                  <div className="bg-white rounded-xl p-5 border-2 border-[#040195] shadow-md">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-[#040195]/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-6 h-6 text-[#040195]"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                          <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3
                          className="text-sm font-semibold text-[#040195] mb-1"
                          style={{ fontFamily: "Inter, sans-serif" }}
                        >
                          System Total
                        </h3>
                        <p
                          className="text-3xl font-bold text-[#040195]"
                          style={{ fontFamily: "Inter, sans-serif" }}
                        >
                          {stats.stats.total}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Read Messages */}
                <div className="bg-white rounded-xl p-5 border-2 border-gray-200 shadow-md">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-green-600"
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
                    <div className="flex-1">
                      <h3
                        className="text-sm font-semibold text-gray-700 mb-1"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        Read Messages
                      </h3>
                      <p
                        className="text-3xl font-bold text-gray-900"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        {readCount}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Unread Messages */}
                <div className="bg-[#040195] rounded-xl p-5 text-white shadow-md">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3
                        className="text-sm font-semibold mb-1"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        Unread Messages
                      </h3>
                      <p
                        className="text-3xl font-bold"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        {unreadCount}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Automatic Cleanup Notice */}
              <div className="mt-6">
                {/* Automatic Deletion Warning */}
                <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-md">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-7 h-7 text-red-600"
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
                      <h4
                        className="text-xl font-bold text-[#040195] mb-3"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        Automatic Message Deletion Notice
                      </h4>
                      <div className="bg-red-50 rounded-lg p-4 mb-3 border-l-4 border-red-600">
                        <p
                          className="text-base text-red-900 font-bold"
                          style={{ fontFamily: "Inter, sans-serif" }}
                        >
                          ALL MESSAGES WILL BE AUTOMATICALLY DELETED IN{" "}
                          {daysUntilDeletion}{" "}
                          {daysUntilDeletion === 1 ? "DAY" : "DAYS"}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 mb-3 border border-gray-200">
                        <p
                          className="text-sm text-gray-900 font-semibold mb-2"
                          style={{ fontFamily: "Inter, sans-serif" }}
                        >
                          Messages are retained for 1 year only.
                        </p>
                        <p
                          className="text-sm text-gray-700 mb-2"
                          style={{ fontFamily: "Inter, sans-serif" }}
                        >
                          Before the year ends, all messages including:
                        </p>
                        <ul
                          className="list-disc list-inside text-sm text-gray-700 ml-3 space-y-1"
                          style={{ fontFamily: "Inter, sans-serif" }}
                        >
                          <li>Unit Director messages</li>
                          <li>Office messages</li>
                          <li>All conversation threads</li>
                          <li>Both read and unread messages</li>
                        </ul>
                        <p
                          className="text-sm text-gray-900 font-semibold mt-3"
                          style={{ fontFamily: "Inter, sans-serif" }}
                        >
                          will be permanently deleted automatically by the
                          system.
                        </p>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-600">
                        <p
                          className="text-sm text-blue-900 font-semibold flex items-start gap-2"
                          style={{ fontFamily: "Inter, sans-serif" }}
                        >
                          <svg
                            className="w-5 h-5 flex-shrink-0 mt-0.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>
                            IMPORTANT: Save or archive any important
                            conversations before they are deleted!
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cleanup Result (if any) */}
              {cleanupResult && (
                <div
                  className={`mt-4 p-4 rounded-xl border-2 shadow-md ${
                    cleanupResult.success
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
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
                          cleanupResult.success
                            ? "text-green-900"
                            : "text-red-900"
                        }`}
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        {cleanupResult.message}
                      </p>
                      {cleanupResult.deletedCount !== undefined && (
                        <p
                          className="text-xs text-green-700 mt-1"
                          style={{ fontFamily: "Inter, sans-serif" }}
                        >
                          {cleanupResult.deletedCount} message
                          {cleanupResult.deletedCount !== 1 ? "s" : ""} removed
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </WhiteContainer>
    </div>
  );
}
