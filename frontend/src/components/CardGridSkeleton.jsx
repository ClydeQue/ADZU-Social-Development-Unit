/**
 * Card Grid Skeleton Loader
 * Shows skeleton UI for card-based project/activity grids
 */
export default function CardGridSkeleton({ cards = 8 }) {
  return (
    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 auto-rows-min content-start overflow-auto p-1 animate-pulse">
      {Array.from({ length: cards }).map((_, index) => (
        <div 
          key={index}
          className="bg-gray-200 rounded-2xl p-4 flex flex-col h-[280px]"
        >
          {/* Image skeleton */}
          <div className="w-full h-32 bg-gray-300 rounded-xl mb-3"></div>
          
          {/* Title skeleton */}
          <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
          
          {/* Description lines */}
          <div className="space-y-2 flex-1">
            <div className="h-3 bg-gray-300 rounded w-full"></div>
            <div className="h-3 bg-gray-300 rounded w-5/6"></div>
            <div className="h-3 bg-gray-300 rounded w-4/6"></div>
          </div>
          
          {/* Bottom info skeleton */}
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-300">
            <div className="h-4 bg-gray-300 rounded w-20"></div>
            <div className="h-4 bg-gray-300 rounded w-24"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
