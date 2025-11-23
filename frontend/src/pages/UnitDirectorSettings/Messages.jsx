import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import WhiteContainer from "@/components/WhiteContainer";
import Sidebar from "@/components/Sidebar";
import SettingsNavbar from "./SettingsNavbar";
import UnitDirectorService from "@/services/unitDirectorService";

export default function MessagesManagement() {
  const navigate = useNavigate();
  const [selectedOffice, setSelectedOffice] = useState("");
  const queryClient = useQueryClient();

  /**
   * Function to count messages for a specific office
   * @param {string} officeId - The ID of the office
   * @returns {Promise<number>} - The count of messages for that office
   */
  const countMessagesForOffice = async (officeId) => {
    try {
      const response = await UnitDirectorService.getOfficeConversationCount(
        officeId
      );
      return response?.data?.conversationCount || 0;
    } catch (error) {
      console.error(`Error counting messages for office ${officeId}:`, error);
      return 0;
    }
  };

  /**
   * Function to count messages for all offices
   * @param {Array} offices - Array of office objects
   * @returns {Promise<Object>} - Object with officeId as key and message count as value
   */
  const countMessagesForAllOffices = async (offices) => {
    const counts = {};

    await Promise.all(
      offices.map(async (office) => {
        const count = await countMessagesForOffice(office.id);
        counts[office.id] = count;
      })
    );

    return counts;
  };

  // Fetch message statistics
  const { data: messageStats, isLoading } = useQuery({
    queryKey: ["message-stats"],
    queryFn: async () => {
      // TODO: Replace with actual API call
      return {
        unreadMessages: 52,
        systemTotal: 154,
      };
    },
    staleTime: 2 * 60 * 1000,
  });

  // Fetch messages for selected office
  const { data: officeMessages, isLoading: isLoadingMessages } = useQuery({
    queryKey: ["office-messages", selectedOffice],
    queryFn: async () => {
      // TODO: Replace with actual API call
      if (!selectedOffice) return null;
      // Mock data for now
      return {
        totalMessages: 23,
        officeAcronym: officesData?.offices?.find(
          (o) => o.id === selectedOffice
        )?.acronym,
      };
    },
    enabled: !!selectedOffice,
    staleTime: 2 * 60 * 1000,
  });

  // Fetch offices for the selector
  const { data: officesData } = useQuery({
    queryKey: ["offices-list"],
    queryFn: async () => {
      // TODO: Replace with actual API call
      return {
        offices: [
          {
            id: "1",
            name: "AdZu Center for Culture and Arts",
            acronym: "ACCA",
          },
          {
            id: "2",
            name: "AdZu Center for Engagement and Social Development",
            acronym: "ACES",
          },
          {
            id: "3",
            name: "AdZu Center for Local Governance",
            acronym: "ACLG",
          },
          {
            id: "4",
            name: "AdZu Language and Technology Center",
            acronym: "ALTEC",
          },
          { id: "5", name: "AdZu Peace Center", acronym: "APC" },
          {
            id: "6",
            name: "Center for Community Engagement and Service",
            acronym: "CCES",
          },
        ],
      };
    },
  });

  // Delete office messages mutation
  const deleteOfficeMessagesMutation = useMutation({
    mutationFn: async (officeId) => {
      // TODO: Replace with actual API call
      console.log(`Deleting all messages for office: ${officeId}`);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["message-stats"]);
      queryClient.invalidateQueries(["office-messages"]);
      setSelectedOffice("");
      alert("All messages from this office have been deleted.");
    },
    onError: (error) => {
      alert(`Error deleting messages: ${error.message}`);
    },
  });

  const handleDeleteOfficeMessages = () => {
    if (!selectedOffice) return;
    const officeAcronym = officesData?.offices?.find(
      (o) => o.id === selectedOffice
    )?.acronym;
    const confirmed = window.confirm(
      `Are you sure you want to delete all message conversations from ${officeAcronym}? This action cannot be undone.`
    );
    if (confirmed) {
      deleteOfficeMessagesMutation.mutate(selectedOffice);
    }
  };

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
              <div className="mb-4">
                <h1
                  className="text-2xl font-bold text-[#040195] mb-1"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Message Management
                </h1>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                {/* Left Column - Stats Cards */}
                <div className="lg:col-span-2 space-y-4">
                  {/* Stats Cards Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Unread Messages Card */}
                    <div className="bg-[#040195] rounded-2xl p-4 text-white shadow-lg">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-5 h-5"
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
                            {isLoading
                              ? "..."
                              : messageStats?.unreadMessages || 0}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* System Total Card */}
                    <div className="bg-white rounded-2xl p-4 border-2 border-gray-200 shadow-lg">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-[#040195]/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-5 h-5 text-[#040195]"
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
                            {isLoading ? "..." : messageStats?.systemTotal || 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Office Selector */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-xl p-4 border-2 border-[#040195] shadow-lg">
                    <h3
                      className="text-sm font-bold text-white bg-[#040195] px-3 py-2 rounded-lg mb-3 text-center"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      SELECT AN OFFICE
                    </h3>
                    <div className="space-y-1.5 max-h-[300px] overflow-y-auto">
                      {officesData?.offices?.map((office) => (
                        <button
                          key={office.id}
                          onClick={() => setSelectedOffice(office.id)}
                          className={`w-full flex items-center gap-2 p-2 rounded-lg hover:cursor-pointer transition-all ${
                            selectedOffice === office.id
                              ? "bg-[#040195] text-white shadow-md"
                              : "bg-gray-50 text-[#040195] hover:bg-gray-100"
                          }`}
                        >
                          {getOfficeLogo(office.acronym) && (
                            <img
                              src={getOfficeLogo(office.acronym)}
                              alt={office.acronym}
                              className="w-5 h-5 object-contain flex-shrink-0"
                            />
                          )}
                          <span
                            className={`text-xs font-semibold text-left ${
                              selectedOffice === office.id
                                ? "text-white"
                                : "text-[#040195]"
                            }`}
                            style={{ fontFamily: "Inter, sans-serif" }}
                          >
                            {office.acronym}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Selected Office Messages Section */}
              {selectedOffice && officeMessages && (
                <div className="bg-white rounded-xl p-4 border-2 border-gray-200 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3
                        className="text-lg font-bold text-[#040195] mb-1"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        {officeMessages.officeAcronym} Messages
                      </h3>
                      <p
                        className="text-gray-500 text-xs"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        Total conversations:{" "}
                        <span className="font-bold text-[#040195]">
                          {isLoadingMessages
                            ? "..."
                            : officeMessages.totalMessages}
                        </span>
                      </p>
                    </div>
                    <button
                      onClick={handleDeleteOfficeMessages}
                      disabled={deleteOfficeMessagesMutation.isPending}
                      className="px-4 py-2 bg-red-600 text-white cursor-pointer text-sm font-bold rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      {deleteOfficeMessagesMutation.isPending
                        ? "Deleting..."
                        : "Delete All"}
                    </button>
                  </div>
                </div>
              )}

              {/* Retention Policy - Plain Text */}
              <p
                className="text-gray-500 text-xs mt-4 text-center"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Messages are automatically retained for 1 year. Messages older
                than this will be permanently deleted automatically.
              </p>
            </div>
          </div>
        </main>
      </WhiteContainer>
    </div>
  );
}
