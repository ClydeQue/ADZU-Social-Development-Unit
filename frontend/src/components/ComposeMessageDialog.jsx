import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Close as CloseIcon } from "@mui/icons-material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import MessageService from "@/services/messageService";
import { useAuth } from "@/context/AuthContext";
import SuccessModal from "@/components/SuccessModal";
import ErrorModal from "@/components/alerts/ErrorModal";

/**
 * Compose Message Dialog
 * Modal for sending messages between offices and unit director
 */
export default function ComposeMessageDialog({ onClose, replyTo }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    receiverId: replyTo?.senderId || "",
    receiverType: replyTo?.senderType || "",
    subject: replyTo?.subject ? `Re: ${replyTo.subject}` : "",
    message: "",
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch offices list if user is unit director
  const { data: officesData, isLoading: isLoadingOffices, error: officesError } = useQuery({
    queryKey: ["offices-for-messaging"],
    queryFn: async () => {
      console.log("Fetching offices from API...");
      const result = await MessageService.getOffices();
      console.log("API Response:", result);
      return result;
    },
    enabled: user?.userType === "unit_director",
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    retry: 1,
  });

  // Debug log
  useEffect(() => {
    if (user?.userType === "unit_director") {
      console.log("=== COMPOSE MESSAGE DEBUG ===");
      console.log("Offices data:", officesData);
      console.log("Number of offices:", officesData?.offices?.length || 0);
      console.log("Office list:", officesData?.offices?.map(o => `${o.acronym} - ${o.office}`));
      console.log("Is loading offices:", isLoadingOffices);
      console.log("Error:", officesError);
      console.log("===========================");
    }
  }, [officesData, isLoadingOffices, officesError, user]);

  // Set receiver for office users (always unit director)
  useEffect(() => {
    if (user?.userType === "office_user" && !replyTo) {
      // For office users, receiver is always unit director
      // We'll need to get unit director ID from backend
      setFormData((prev) => ({
        ...prev,
        receiverType: "unit_director",
      }));
    }
  }, [user, replyTo]);

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: () => {
      const clientTimestamp = new Date().toISOString();
      return MessageService.sendMessage(
        formData.receiverId,
        formData.receiverType,
        formData.subject || "No Subject",
        formData.message,
        clientTimestamp
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["messages"]);
      queryClient.invalidateQueries(["allMessages"]);
      setShowSuccessModal(true);
    },
    onError: (error) => {
      setErrorMessage(
        `Failed to send message: ${error.message || "Unknown error"}`
      );
      setShowErrorModal(true);
    },
  });

  const handleSend = () => {
    // Validation
    if (user?.userType === "unit_director" && !formData.receiverId) {
      setErrorMessage("Please select a recipient");
      setShowErrorModal(true);
      return;
    }
    if (!formData.message.trim()) {
      setErrorMessage("Please enter a message");
      setShowErrorModal(true);
      return;
    }

    sendMessageMutation.mutate();
  };

  return (
    <div className="absolute right-0 top-full mt-2 z-50 w-[90vw] sm:w-[500px] shadow-2xl">
      <div className="bg-white rounded-xl overflow-hidden flex flex-col max-h-[80vh] border border-gray-200">
        {/* Header */}
        <div className="bg-[#E8E7FF] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-[#4D49FC] rounded-full"></div>
            <h2
              className="text-base font-bold text-[#040195]"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {replyTo ? "Reply to Message" : "New Message"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#040195] hover:bg-white hover:bg-opacity-50 rounded-full p-1 transition-colors"
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 flex-1 overflow-y-auto">
          {/* To Field */}
          <div className="mb-4 flex items-center gap-2">
            <span
              className="text-sm font-semibold text-gray-900"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              TO
            </span>
            {user?.userType === "unit_director" ? (
              <div className="flex-1 flex items-center justify-between">
                <select
                  value={formData.receiverId}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      receiverId: e.target.value,
                      receiverType: "office_user",
                    });
                  }}
                  disabled={!!replyTo || isLoadingOffices}
                  className="flex-1 text-sm font-semibold text-[#4D49FC] bg-transparent border-none focus:outline-none disabled:opacity-50"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  <option value="">
                    {isLoadingOffices ? "Loading offices..." : "Select an office"}
                  </option>
                  {officesData?.offices?.map((office) => (
                    <option key={office.id} value={office.id}>
                      {office.acronym} - {office.office}
                    </option>
                  ))}
                </select>
                <button className="w-6 h-6 rounded-full bg-[#4D49FC] flex items-center justify-center text-white hover:bg-[#3D39EC] transition-colors">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor"/>
                  </svg>
                </button>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-between">
                <span
                  className="text-sm font-semibold text-[#4D49FC]"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Unit Director
                </span>
                <button className="w-6 h-6 rounded-full bg-[#4D49FC] flex items-center justify-center text-white hover:bg-[#3D39EC] transition-colors">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor"/>
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Message Field */}
          <div className="mb-3">
            <textarea
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              rows={10}
              className="w-full px-4 py-3 text-sm border-2 border-dashed border-gray-300 rounded-lg focus:outline-none focus:border-[#4D49FC] resize-none bg-white"
              style={{ fontFamily: "Inter, sans-serif" }}
              placeholder=""
            />
          </div>

          {/* Original Message (if replying) */}
          {replyTo && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p
                className="text-[10px] font-semibold text-gray-500 mb-1"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Original Message:
              </p>
              <p
                className="text-xs text-gray-700 whitespace-pre-wrap"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {replyTo.message}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 flex justify-start gap-2">
          <button
            onClick={handleSend}
            disabled={sendMessageMutation.isPending}
            className="px-5 py-2 bg-[#4D49FC] text-white rounded-lg text-sm font-semibold hover:bg-[#3D39EC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor"/>
            </svg>
            {sendMessageMutation.isPending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        show={showSuccessModal}
        action="sent"
        itemName="Message"
        onClose={() => {
          setShowSuccessModal(false);
          onClose();
        }}
      />

      {/* Error Modal */}
      <ErrorModal
        show={showErrorModal}
        message={errorMessage}
        onClose={() => setShowErrorModal(false)}
      />
    </div>
  );
}

ComposeMessageDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  replyTo: PropTypes.shape({
    senderId: PropTypes.string,
    senderType: PropTypes.string,
    subject: PropTypes.string,
    message: PropTypes.string,
  }),
};
