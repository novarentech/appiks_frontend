import { Skeleton } from "@/components/ui/skeleton";

export function FilterSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6">
      {/* Filter header */}
      <div className="flex flex-col sm:flex-row mb-2 gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-24" />
        </div>
        <Skeleton className="h-9 w-20" />
      </div>

      {/* Active filter badge area */}
      <div className="mb-4">
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>

      {/* Filter content */}
      <div className="border-t border-gray-100 pt-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-6 w-20" />
        </div>

        {/* Filter tags */}
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-8 w-24 rounded-md" />
          ))}
        </div>
      </div>
    </div>
  );
}
