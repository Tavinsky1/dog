export function SkeletonCard() {
  return (
    <div className="card-hover flex flex-col overflow-hidden sm:flex-row animate-pulse">
      <div className="h-48 w-full sm:h-full sm:w-48 bg-gray-200" />
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="h-3 w-20 bg-gray-200 rounded mb-2" />
            <div className="h-5 w-3/4 bg-gray-200 rounded mb-2" />
          </div>
          <div className="h-6 w-16 bg-gray-200 rounded-full" />
        </div>
        <div className="h-4 w-full bg-gray-200 rounded mb-1" />
        <div className="h-4 w-2/3 bg-gray-200 rounded" />
        <div className="flex flex-wrap gap-2 mt-2">
          <div className="h-6 w-16 bg-gray-200 rounded-full" />
          <div className="h-6 w-20 bg-gray-200 rounded-full" />
          <div className="h-6 w-24 bg-gray-200 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonMap() {
  return (
    <div className="h-[360px] w-full overflow-hidden rounded-2xl border bg-gray-200 animate-pulse flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
        <div className="h-4 w-24 bg-gray-300 rounded mx-auto" />
      </div>
    </div>
  );
}
