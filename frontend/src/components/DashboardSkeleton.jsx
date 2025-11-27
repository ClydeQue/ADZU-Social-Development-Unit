/**
 * Dashboard Skeleton Loader
 * Shows skeleton UI for office dashboard pages
 */
export default function DashboardSkeleton() {
  return (
    <div className="flex-1 flex flex-col lg:flex-row gap-3 animate-pulse">
      {/* Left Section - Upcoming Programs Skeleton */}
      <div className="flex-[1.5] min-w-[200px] max-w-full lg:max-w-[300px] bg-gray-100 rounded-xl p-4">
        <div className="h-6 bg-gray-300 rounded w-2/3 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3 p-2 bg-white rounded-lg">
              <div className="w-10 h-10 bg-gray-300 rounded-lg flex-shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                <div className="h-2 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Section - Stats and Content */}
      <div className="flex-[3] min-w-0 flex flex-col gap-3">
        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Card 1 */}
          <div className="bg-gray-200 rounded-[20px] p-4 h-32">
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-3"></div>
            <div className="h-10 bg-gray-300 rounded w-1/3 mb-2"></div>
            <div className="h-2 bg-gray-300 rounded w-2/3"></div>
          </div>
          {/* Card 2 */}
          <div className="bg-gray-200 rounded-[20px] p-4 h-32">
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-3"></div>
            <div className="h-10 bg-gray-300 rounded w-1/3 mb-2"></div>
            <div className="h-2 bg-gray-300 rounded w-2/3"></div>
          </div>
          {/* Card 3 */}
          <div className="bg-gray-200 rounded-[20px] p-4 h-32">
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-3"></div>
            <div className="h-10 bg-gray-300 rounded w-1/3 mb-2"></div>
            <div className="h-2 bg-gray-300 rounded w-2/3"></div>
          </div>
        </div>

        {/* Chart Section Skeleton */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 min-h-[200px]">
          {/* Chart 1 */}
          <div className="bg-gray-100 rounded-xl p-4 flex flex-col">
            <div className="h-5 bg-gray-300 rounded w-1/3 mb-4"></div>
            <div className="flex-1 flex items-center justify-center">
              <div className="w-32 h-32 bg-gray-300 rounded-full"></div>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              <div className="h-3 bg-gray-300 rounded w-16"></div>
              <div className="h-3 bg-gray-300 rounded w-16"></div>
              <div className="h-3 bg-gray-300 rounded w-16"></div>
            </div>
          </div>
          
          {/* Chart 2 */}
          <div className="bg-gray-100 rounded-xl p-4 flex flex-col">
            <div className="h-5 bg-gray-300 rounded w-1/3 mb-4"></div>
            <div className="flex-1 flex items-end gap-2 px-4">
              {[40, 60, 80, 50, 70, 90, 65].map((height, i) => (
                <div 
                  key={i} 
                  className="flex-1 bg-gray-300 rounded-t"
                  style={{ height: `${height}%` }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
