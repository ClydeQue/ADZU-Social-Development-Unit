import React from "react";
import PropTypes from "prop-types";

const DeleteConfirmationModal = ({
  open,
  title = "Are you sure you want to delete this reports?",
  message = "This action cannot be undone.",
  itemName = "",
  onConfirm,
  onCancel,
  isLoading = false,
  confirmButtonText = "DELETE",
  cancelButtonText = "CANCEL",
}) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full animate-in fade-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Warning Icon */}
        <div className="flex items-center justify-center pt-12 pb-6">
          <img
            src="/icons/warning.svg"
            alt="Warning"
            className="w-24 h-24"
          />
        </div>

        {/* Modal Body */}
        <div className="px-8 pb-8 text-center">
          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="px-12 py-3 border-4 border-[#4D49FC] text-[#4D49FC] font-bold text-lg rounded-full hover:bg-[#4D49FC] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              CANCEL
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="px-12 py-3 bg-[#DC3545] text-white font-bold text-lg rounded-full hover:bg-[#C82333] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {isLoading ? "DELETING..." : "DELETE"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

DeleteConfirmationModal.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  itemName: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  confirmButtonColor: PropTypes.string,
  confirmButtonText: PropTypes.string,
  cancelButtonText: PropTypes.string,
};

export default DeleteConfirmationModal;
