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
  const { data: officesData } = useQuery({
    queryKey: ["offices-for-messaging"],
    queryFn: MessageService.getOffices,
    enabled: user?.userType === "unit_director",
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
    mutationFn: () =>
      MessageService.sendMessage(
        formData.receiverId,
        formData.receiverType,
        formData.subject,
        formData.message
      ),
    onSuccess: () => {
      queryClient.invalidateQueries(["messages"]);
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#4D49FC] text-white px-6 py-4 flex items-center justify-between">
          <h2
            className="text-xl font-bold"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            {replyTo ? "Reply to Message" : "Compose Message"}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex-1 overflow-y-auto">
          {/* To Field */}
          <div className="mb-4">
            <label
              className="block text-sm font-semibold text-[#040195] mb-2"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              To
            </label>
            {user?.userType === "unit_director" ? (
              <select
                value={formData.receiverId}
                onChange={(e) => {
                  const selectedOffice = officesData?.offices?.find(
                    (o) => o.id === e.target.value
                  );
                  setFormData({
                    ...formData,
                    receiverId: e.target.value,
                    receiverType: "office_user",
                  });
                }}
                disabled={!!replyTo}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4D49FC] focus:border-transparent disabled:bg-gray-100"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                <option value="">Select an office</option>
                {officesData?.offices?.map((office) => (
                  <option key={office.id} value={office.id}>
                    {office.acronym} - {office.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value="Unit Director"
                disabled
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100"
                style={{ fontFamily: "Inter, sans-serif" }}
              />
            )}
          </div>

          {/* Subject Field */}
          <div className="mb-4">
            <label
              className="block text-sm font-semibold text-[#040195] mb-2"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Subject
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4D49FC] focus:border-transparent"
              style={{ fontFamily: "Inter, sans-serif" }}
              placeholder="Enter subject"
            />
          </div>

          {/* Message Field */}
          <div className="mb-4">
            <label
              className="block text-sm font-semibold text-[#040195] mb-2"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Message
            </label>
            <textarea
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              rows={10}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4D49FC] focus:border-transparent resize-none"
              style={{ fontFamily: "Inter, sans-serif" }}
              placeholder="Type your message here..."
            />
          </div>

          {/* Original Message (if replying) */}
          {replyTo && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p
                className="text-xs font-semibold text-gray-500 mb-2"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Original Message:
              </p>
              <p
                className="text-sm text-gray-700 whitespace-pre-wrap"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {replyTo.message}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={sendMessageMutation.isPending}
            className="px-6 py-2.5 bg-[#4D49FC] text-white rounded-lg font-semibold hover:bg-[#3D39EC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            {sendMessageMutation.isPending ? "Sending..." : "Send Message"}
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
