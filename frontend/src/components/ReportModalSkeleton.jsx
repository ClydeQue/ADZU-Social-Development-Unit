/**
 * Report Modal Skeleton Loader
 * Shows a skeleton UI while activity data is loading
 */
export default function ReportModalSkeleton({ onClose }) {
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
      style={{ backgroundColor: 'rgba(4, 1, 149, 0.4)', overflow: 'hidden' }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      {/* Modal Container */}
      <div 
        className="bg-[#fafafa] rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto animate-pulse"
        onClick={(e) => e.stopPropagation()}
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        {/* Action Buttons Skeleton */}
        <div className="flex items-center justify-end gap-2 mb-4">
          <div className="w-10 h-10 bg-gray-300 rounded-xl"></div>
          <div className="w-20 h-10 bg-gray-300 rounded-xl"></div>
          <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
        </div>

        {/* Header Section Skeleton */}
        <div className="relative sm:p-2 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:justify-between">
          <div className="flex items-center gap-3 sm:gap-6 w-full sm:w-auto">
            {/* Logo Skeleton */}
            <div className="w-20 h-20 sm:w-32 sm:h-32 bg-gray-300 rounded-lg flex-shrink-0"></div>

            {/* Title and Description Skeleton */}
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-300 rounded w-20"></div>
              <div className="h-8 bg-gray-300 rounded w-64"></div>
              <div className="h-4 bg-gray-300 rounded w-48"></div>
              <div className="h-3 bg-gray-300 rounded w-full"></div>
              <div className="h-3 bg-gray-300 rounded w-3/4"></div>
            </div>
          </div>

          {/* Status and Dates Skeleton */}
          <div className="w-full sm:w-auto">
            <div className="h-8 bg-gray-300 rounded-full w-32 mb-2"></div>
            <div className="space-y-1">
              <div className="h-3 bg-gray-300 rounded w-40"></div>
              <div className="h-3 bg-gray-300 rounded w-40"></div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-3 sm:mx-6 my-3 sm:my-2 h-1 bg-gray-300 rounded-full"></div>

        {/* Content Section Skeleton */}
        <div className="p-3 sm:p-6 pt-0 space-y-6">
          {/* Objectives and SDG Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="sm:col-span-2 space-y-2">
              <div className="h-4 bg-gray-300 rounded w-24"></div>
              <div className="h-3 bg-gray-300 rounded w-full"></div>
              <div className="h-3 bg-gray-300 rounded w-full"></div>
              <div className="h-3 bg-gray-300 rounded w-2/3"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-24"></div>
              <div className="flex gap-1.5">
                <div className="w-12 h-12 bg-gray-300 rounded-lg"></div>
                <div className="w-12 h-12 bg-gray-300 rounded-lg"></div>
                <div className="w-12 h-12 bg-gray-300 rounded-lg"></div>
              </div>
            </div>
          </div>

          <hr className="border-gray-300" />

          {/* Venue, Demographics, Sex Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-16"></div>
              <div className="h-3 bg-gray-300 rounded w-full"></div>
              <div className="h-3 bg-gray-300 rounded w-3/4"></div>
              <div className="h-3 bg-gray-300 rounded w-2/3"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-32"></div>
              <div className="h-3 bg-gray-300 rounded w-full"></div>
              <div className="h-3 bg-gray-300 rounded w-full"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-12"></div>
              <div className="h-3 bg-gray-300 rounded w-full"></div>
              <div className="h-3 bg-gray-300 rounded w-full"></div>
            </div>
          </div>

          <hr className="border-gray-300" />

          {/* Partners Row */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-24"></div>
            <div className="h-3 bg-gray-300 rounded w-2/3"></div>
          </div>

          <hr className="border-gray-300" />

          {/* Budget Row */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-32"></div>
            <div className="h-3 bg-gray-300 rounded w-48"></div>
          </div>

          {/* Button Skeleton */}
          <div className="flex justify-end mt-4">
            <div className="h-10 bg-gray-300 rounded-xl w-48"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

ReportModalSkeleton.propTypes = {
  onClose: function() {}
};
