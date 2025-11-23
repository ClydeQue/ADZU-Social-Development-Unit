/**
 * Calendar Skeleton Loader
 * Shows skeleton UI for calendar loading state
 */
export default function CalendarSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 h-full flex flex-col animate-pulse">
      {/* Header with navigation */}
      <div className="flex items-center justify-between mb-6">
        <div className="h-8 bg-gray-300 rounded w-48"></div>
        <div className="flex gap-2">
          <div className="w-10 h-10 bg-gray-300 rounded"></div>
          <div className="w-10 h-10 bg-gray-300 rounded"></div>
        </div>
      </div>

      {/* Calendar toolbar */}
      <div className="flex gap-2 mb-4">
        <div className="h-10 bg-gray-300 rounded w-24"></div>
        <div className="h-10 bg-gray-300 rounded w-24"></div>
        <div className="h-10 bg-gray-300 rounded w-24"></div>
      </div>

      {/* Calendar grid */}
      <div className="flex-1 grid grid-cols-7 gap-2">
        {/* Day headers */}
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={`header-${i}`} className="h-8 bg-gray-300 rounded"></div>
        ))}
        
        {/* Calendar cells */}
        {Array.from({ length: 35 }).map((_, i) => (
          <div key={`cell-${i}`} className="h-20 bg-gray-200 rounded flex flex-col p-2">
            <div className="h-4 bg-gray-300 rounded w-8 mb-2"></div>
            {i % 3 === 0 && <div className="h-3 bg-gray-400 rounded w-full"></div>}
          </div>
        ))}
      </div>
    </div>
  );
}
