/**
 * Table Skeleton Loader
 * Shows a skeleton UI for table loading states
 */
export default function TableSkeleton({ rows = 5, columns = 6 }) {
  return (
    <div className="h-full flex flex-col animate-pulse" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header Row */}
      <div className="bg-gray-300 rounded-xl px-3 py-2.5 mb-1 grid gap-3 items-center flex-shrink-0" 
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="h-4 bg-gray-400 rounded"></div>
        ))}
      </div>

      {/* Data Rows */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden pr-2 min-h-0">
        <div className="space-y-1.5">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div 
              key={rowIndex}
              className="bg-gray-200 rounded-xl px-3 py-4 grid gap-3 items-center"
              style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
            >
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div key={colIndex} className="h-4 bg-gray-300 rounded"></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
