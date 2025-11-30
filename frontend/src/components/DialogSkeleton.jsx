import PropTypes from "prop-types";

/**
 * Dialog Skeleton Loader
 * Shows skeleton UI for dialog/modal content while loading
 */
export default function DialogSkeleton({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(4, 1, 149, 0.4)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-6 shadow-xl max-w-lg w-full animate-pulse"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 bg-gray-300 rounded w-48"></div>
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {/* Form field 1 */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-24"></div>
            <div className="h-10 bg-gray-300 rounded-lg"></div>
          </div>

          {/* Form field 2 */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-32"></div>
            <div className="h-10 bg-gray-300 rounded-lg"></div>
          </div>

          {/* Form field 3 */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-20"></div>
            <div className="h-20 bg-gray-300 rounded-lg"></div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <div className="w-20 h-10 bg-gray-300 rounded-lg"></div>
          <div className="w-24 h-10 bg-gray-300 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}

DialogSkeleton.propTypes = {
  onClose: PropTypes.func,
};
