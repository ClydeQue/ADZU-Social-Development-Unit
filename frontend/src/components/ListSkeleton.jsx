/**
 * List Skeleton Loader
 * Shows skeleton UI for list items (like upcoming activities)
 */
export default function ListSkeleton({ items = 3 }) {
  return (
    <div className="flex flex-col gap-2 sm:gap-3 animate-pulse">
      {Array.from({ length: items }).map((_, index) => (
        <div 
          key={index}
          className="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 rounded-lg"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gray-300 flex-shrink-0"></div>
          <div className="flex-grow min-w-0 space-y-2">
            <div className="h-3 bg-gray-300 rounded w-16"></div>
            <div className="h-3 bg-gray-300 rounded w-full"></div>
            <div className="h-2 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
