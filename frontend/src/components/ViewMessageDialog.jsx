import { useState } from "react";
import PropTypes from "prop-types";
import {
  Close as CloseIcon,
  Reply as ReplyIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import MessageService from "@/services/messageService";
import { formatDate } from "@/utils/timeFormat";
import SuccessModal from "@/components/SuccessModal";
import ErrorModal from "@/components/alerts/ErrorModal";

/**
 * View Message Dialog
 * Modal for viewing message details with reply and delete options
 */
export default function ViewMessageDialog({ message, onClose, onReply }) {
  const queryClient = useQueryClient();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Delete message mutation
  const deleteMessageMutation = useMutation({
    mutationFn: () => MessageService.deleteMessage(message.id),
    onSuccess: () => {
      queryClient.invalidateQueries(["messages"]);
      setShowSuccessModal(true);
    },
    onError: (error) => {
      setErrorMessage(
        `Failed to delete message: ${error.message || "Unknown error"}`
      );
      setShowErrorModal(true);
    },
  });

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    deleteMessageMutation.mutate();
  };

  const handleReply = () => {
    onReply(message);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-[#4D49FC] text-white px-6 py-4 flex items-center justify-between">
            <h2
              className="text-xl font-bold"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Message
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
            {/* Message Header Info */}
            <div className="mb-6 pb-4 border-b border-gray-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-xs font-semibold text-gray-500"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      From:
                    </span>
                    <span
                      className="text-sm font-bold text-gray-900"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      {message.sender}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-semibold text-gray-500"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      Date:
                    </span>
                    <span
                      className="text-xs text-gray-600"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      {formatDate(message.createdAt)}
                    </span>
                  </div>
                </div>
                {message.unread && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                    New
                  </span>
                )}
              </div>

              {/* Subject */}
              <h3
                className="text-2xl font-bold text-[#040195] mb-2"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {message.subject}
              </h3>
            </div>

            {/* Message Body */}
            <div className="mb-6">
              <p
                className="text-base text-gray-700 whitespace-pre-wrap leading-relaxed"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {message.message}
              </p>
            </div>
          </div>

          {/* Footer with Actions */}
          <div className="px-6 py-4 bg-gray-50 flex justify-between items-center gap-3 border-t border-gray-200">
            <button
              onClick={handleDelete}
              disabled={deleteMessageMutation.isPending}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              <DeleteIcon sx={{ fontSize: 18 }} />
              Delete
            </button>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Close
              </button>
              {!message.isSent && (
                <button
                  onClick={handleReply}
                  className="px-6 py-2 bg-[#4D49FC] text-white rounded-lg font-semibold hover:bg-[#3D39EC] transition-colors flex items-center gap-2"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  <ReplyIcon sx={{ fontSize: 18 }} />
                  Reply
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl">
            <div className="bg-red-600 text-white px-6 py-4 rounded-t-xl">
              <h3
                className="text-lg font-bold"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Confirm Delete
              </h3>
            </div>
            <div className="p-6">
              <p
                className="text-gray-700 mb-6"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Are you sure you want to delete this message? This action cannot
                be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleteMessageMutation.isPending}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {deleteMessageMutation.isPending ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      <SuccessModal
        show={showSuccessModal}
        action="deleted"
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
    </>
  );
}

ViewMessageDialog.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.string.isRequired,
    sender: PropTypes.string.isRequired,
    senderId: PropTypes.string,
    senderType: PropTypes.string,
    subject: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    unread: PropTypes.bool,
    isSent: PropTypes.bool,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onReply: PropTypes.func.isRequired,
};
