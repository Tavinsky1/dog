export default function Loading() {
  return (
    <div className="space-y-8">
      {/* Header skeleton */}
      <div className="space-y-4">
        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-96 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Photo strip skeleton */}
      <div className="h-64 w-full bg-gray-200 rounded-2xl animate-pulse" />

      {/* Content grid skeleton */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main content skeleton */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4">
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 bg-gray-200 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-gray-200 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar skeleton */}
        <div className="space-y-6">
          <div className="h-32 bg-gray-200 rounded-2xl animate-pulse" />
          <div className="h-64 bg-gray-200 rounded-2xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}