/**
 * Form Skeleton Loader
 * Shows skeleton UI for form pages while data is loading
 */
export default function FormSkeleton() {
  return (
    <div className="h-full flex flex-col p-2 sm:p-4 md:p-6 overflow-auto bg-gray-50">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between mb-8">
          <div className="h-10 bg-gray-300 rounded w-64"></div>
          <div className="flex gap-3">
            <div className="w-24 h-10 bg-gray-300 rounded-xl"></div>
            <div className="w-24 h-10 bg-gray-300 rounded-xl"></div>
          </div>
        </div>

        {/* Form Grid Layout Skeleton */}
        <div className="space-y-4">
          {/* Row 1 */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-24"></div>
              <div className="h-10 bg-gray-300 rounded-[11px]"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-32"></div>
              <div className="h-10 bg-gray-300 rounded-[11px]"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-16"></div>
              <div className="h-10 bg-gray-300 rounded-[11px]"></div>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 space-y-2">
              <div className="h-4 bg-gray-300 rounded w-24"></div>
              <div className="h-20 bg-gray-300 rounded-[11px]"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-16"></div>
              <div className="h-10 bg-gray-300 rounded-[11px]"></div>
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-20"></div>
              <div className="h-20 bg-gray-300 rounded-[11px]"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-40"></div>
              <div className="h-16 bg-gray-300 rounded-[11px]"></div>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-20"></div>
                <div className="h-10 bg-gray-300 rounded-[11px]"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-28"></div>
                <div className="h-10 bg-gray-300 rounded-[11px]"></div>
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className="grid grid-cols-3 gap-3">
            {/* Left side */}
            <div className="col-span-2 space-y-4">
              {/* Venue fields */}
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-16"></div>
                  <div className="h-10 bg-gray-300 rounded-[11px]"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-24"></div>
                  <div className="h-10 bg-gray-300 rounded-[11px]"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-12"></div>
                  <div className="h-10 bg-gray-300 rounded-[11px] w-16"></div>
                </div>
              </div>

              {/* Partners section */}
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-20"></div>
                <div className="border border-gray-200 rounded-[11px] p-3">
                  <div className="grid grid-cols-4 gap-2">
                    <div className="h-10 bg-gray-300 rounded-[11px]"></div>
                    <div className="h-10 bg-gray-300 rounded-[11px]"></div>
                    <div className="h-10 bg-gray-300 rounded-[11px]"></div>
                    <div className="h-10 bg-gray-300 rounded-full w-10"></div>
                  </div>
                </div>
              </div>

              {/* Budget section */}
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-32"></div>
                <div className="border border-gray-200 rounded-[11px] p-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-10 bg-gray-300 rounded-[11px]"></div>
                    <div className="h-10 bg-gray-300 rounded-[11px]"></div>
                    <div className="h-10 bg-gray-300 rounded-full w-10"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - SDG section */}
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-48"></div>
                <div className="border border-gray-200 rounded-[11px] p-3">
                  <div className="grid grid-cols-5 gap-2">
                    {[...Array(17)].map((_, i) => (
                      <div key={i} className="aspect-square bg-gray-300 rounded-lg"></div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Report URL */}
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-28"></div>
                <div className="h-10 bg-gray-300 rounded-[11px]"></div>
              </div>

              {/* Thumbnail */}
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-20"></div>
                <div className="h-10 bg-gray-300 rounded-[11px]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
