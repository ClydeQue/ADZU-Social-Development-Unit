/**
 * Chart Skeleton Loader
 * Shows skeleton UI for donut/pie charts
 */
export default function ChartSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center animate-pulse">
      {/* Donut chart skeleton */}
      <div className="relative w-48 h-48 sm:w-56 sm:h-56">
        <div className="absolute inset-0 rounded-full border-[40px] border-gray-300"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-2">
            <div className="h-8 w-16 bg-gray-300 rounded mx-auto"></div>
            <div className="h-4 w-20 bg-gray-200 rounded mx-auto"></div>
          </div>
        </div>
      </div>
      {/* Legend skeleton */}
      <div className="flex gap-4 mt-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-300"></div>
            <div className="h-3 w-16 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
