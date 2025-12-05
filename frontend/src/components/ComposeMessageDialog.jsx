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
  const { data: officesData, isLoading: isLoadingOffices } = useQuery({
    queryKey: ["offices-for-messaging"],
    queryFn: () => MessageService.getOffices(),
    enabled: user?.userType === "unit_director",
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    retry: 1,
  });

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
    if (!formData.subject.trim()) {
      setErrorMessage("Please enter a subject");
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
      <div className="fixed sm:absolute inset-0 sm:inset-auto sm:right-0 sm:top-full sm:mt-2 w-full sm:w-80 md:w-96 sm:max-w-[400px] z-50 shadow-2xl">
        <div className="bg-white sm:rounded-xl overflow-hidden flex flex-col h-full sm:h-auto sm:max-h-[70vh] border-0 sm:border border-gray-200">
          {/* Header */}
          <div className="bg-[#E8E7FF] px-4 py-3 flex items-center justify-between flex-shrink-0">
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
            <div className="mb-2 flex items-center gap-2">
              <span
                className="text-xs font-semibold text-gray-900 w-12 flex-shrink-0"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                TO:
              </span>
              {user?.userType === "unit_director" ? (
                <div className="flex-1">
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
                    className="w-full px-2 py-1.5 text-xs font-semibold text-[#4D49FC] bg-white border border-gray-300 rounded-md focus:outline-none focus:border-[#4D49FC] disabled:opacity-50 disabled:bg-gray-50"
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
                </div>
              ) : (
                <div className="flex-1">
                  <div
                    className="px-3 py-2 text-sm font-semibold text-[#4D49FC] bg-gray-50 border border-gray-300 rounded-lg"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Unit Director
                  </div>
                </div>
              )}
            </div>

            {/* Subject Field */}
            <div className="mb-2 flex items-center gap-2">
              <span
                className="text-xs font-semibold text-gray-900 w-12 flex-shrink-0"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                SUBJECT:
              </span>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                disabled={!!replyTo}
                className="flex-1 px-2 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:border-[#4D49FC] bg-white disabled:bg-gray-50 disabled:opacity-50"
                style={{ fontFamily: "Inter, sans-serif" }}
                placeholder="Enter subject..."
              />
            </div>

            {/* Message Field */}
            <div className="mb-2">
              <textarea
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                rows={6}
                className="w-full px-3 py-2 text-xs border-2 border-dashed border-gray-300 rounded-md focus:outline-none focus:border-[#4D49FC] resize-none bg-white"
                style={{ fontFamily: "Inter, sans-serif" }}
                placeholder="Type your message here..."
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
          <div className="px-3 py-2 flex justify-start gap-2 border-t border-gray-100">
            <button
              onClick={handleSend}
              disabled={sendMessageMutation.isPending}
              className="px-4 py-1.5 bg-[#4D49FC] text-white rounded-md text-xs font-semibold hover:bg-[#3D39EC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
