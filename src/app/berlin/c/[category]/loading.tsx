import { SkeletonCard } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="rounded-xl p-4 border bg-white">
        <div className="h-6 w-64 bg-gray-200 rounded mb-2 animate-pulse" />
        <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    </div>
  );
}
