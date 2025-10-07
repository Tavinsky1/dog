import { SkeletonCard, SkeletonMap } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="space-y-12">
      {/* Header skeleton */}
      <section className="space-y-4">
        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
        <div>
          <div className="h-3 w-24 bg-gray-200 rounded mb-2 animate-pulse" />
          <div className="h-8 w-64 bg-gray-200 rounded mb-3 animate-pulse" />
          <div className="h-4 w-96 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-8 w-24 bg-gray-200 rounded-full animate-pulse" />
          ))}
        </div>
      </section>

      {/* Main content skeleton */}
      <div className="grid gap-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,6fr)]">
        {/* Map skeleton */}
        <div className="space-y-6">
          <SkeletonMap />
          <div className="h-32 w-full bg-gray-200 rounded-2xl animate-pulse" />
        </div>

        {/* Places list skeleton */}
        <div className="space-y-8">
          {[1, 2, 3].map((categoryIndex) => (
            <section key={categoryIndex} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
              </div>

              <div className="space-y-4">
                {[1, 2, 3].map((placeIndex) => (
                  <SkeletonCard key={placeIndex} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}