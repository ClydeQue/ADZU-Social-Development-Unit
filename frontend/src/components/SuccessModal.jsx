import React from "react";
import PropTypes from "prop-types";

/**
 * SuccessModal Component - A reusable modal for displaying success messages
 * Supports all CRUD operations: Create, Read, Update, Delete
 * @param {boolean} show - Controls modal visibility
 * @param {string} title - Modal title (default: "Success!")
 * @param {string} message - Success message to display
 * @param {string} action - Action type: 'created', 'updated', 'deleted', 'added', 'removed', 'saved', etc.
 * @param {string} itemName - Name of the item affected (e.g., "Activity", "User", "Program")
 * @param {function} onClose - Callback function when modal is closed
 * @param {string} buttonText - Custom button text (default: "Continue")
 */
const SuccessModal = ({
  show,
  title,
  message,
  action,
  itemName,
  onClose,
  buttonText = "Continue",
}) => {
  if (!show) return null;

  // Auto-generate title and message based on action and itemName if not provided
  const getDefaultTitle = () => {
    if (title) return title;
    if (!action) return "Success!";

    const actionMap = {
      created: "Successfully Created",
      added: "Successfully Added",
      updated: "Successfully Updated",
      deleted: "Successfully Deleted",
      removed: "Successfully Removed",
      saved: "Successfully Saved",
      submitted: "Successfully Submitted",
      approved: "Successfully Approved",
      rejected: "Successfully Rejected",
      archived: "Successfully Archived",
      restored: "Successfully Restored",
      published: "Successfully Published",
      unpublished: "Successfully Unpublished",
    };

    return actionMap[action.toLowerCase()] || "Success!";
  };

  const getDefaultMessage = () => {
    if (message) return message;
    if (!action || !itemName) return "Operation completed successfully!";

    const actionMap = {
      created: `${itemName} has been created successfully!`,
      added: `${itemName} has been added successfully!`,
      updated: `${itemName} has been updated successfully!`,
      deleted: `${itemName} has been deleted successfully!`,
      removed: `${itemName} has been removed successfully!`,
      saved: `${itemName} has been saved successfully!`,
      submitted: `${itemName} has been submitted successfully!`,
      approved: `${itemName} has been approved successfully!`,
      rejected: `${itemName} has been rejected successfully!`,
      archived: `${itemName} has been archived successfully!`,
      restored: `${itemName} has been restored successfully!`,
      published: `${itemName} has been published successfully!`,
      unpublished: `${itemName} has been unpublished successfully!`,
    };

    return (
      actionMap[action.toLowerCase()] ||
      `${itemName} operation completed successfully!`
    );
  };

  const displayTitle = getDefaultTitle();
  const displayMessage = getDefaultMessage();

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-in fade-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-t-2xl p-6">
          <div className="flex items-center justify-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-8 text-center">
          <h3
            className="text-2xl font-bold text-gray-800 mb-3"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            {displayTitle}
          </h3>
          <p
            className="text-gray-600 text-base mb-6"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            {displayMessage}
          </p>

          <button
            onClick={onClose}
            className="w-full bg-[#040195] hover:bg-[#3d39cc] text-white font-bold py-3 px-6 rounded-full transition-all shadow-md hover:shadow-lg"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

SuccessModal.propTypes = {
  show: PropTypes.bool.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  action: PropTypes.oneOf([
    "created",
    "added",
    "updated",
    "deleted",
    "removed",
    "saved",
    "submitted",
    "approved",
    "rejected",
    "archived",
    "restored",
    "published",
    "unpublished",
  ]),
  itemName: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  buttonText: PropTypes.string,
};

export default SuccessModal;
