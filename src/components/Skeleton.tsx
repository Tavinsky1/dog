export function SkeletonCard() {
  return (
    <div className="border rounded-2xl p-4 bg-white animate-pulse">
      <div className="h-3 w-24 bg-gray-200 rounded mb-2" />
      <div className="h-5 w-3/4 bg-gray-200 rounded mb-2" />
      <div className="h-3 w-1/2 bg-gray-200 rounded" />
      <div className="mt-3 flex gap-2">
        <div className="h-5 w-16 bg-gray-200 rounded-full" />
        <div className="h-5 w-20 bg-gray-200 rounded-full" />
      </div>
    </div>
  );
}
