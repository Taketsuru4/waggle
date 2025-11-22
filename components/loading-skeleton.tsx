export function CaregiverCardSkeleton() {
  return (
    <div className="rounded-lg bg-white p-4 sm:p-6 shadow-sm dark:bg-zinc-800 animate-pulse">
      <div className="flex flex-col sm:flex-row items-start gap-4">
        {/* Avatar */}
        <div className="flex w-full sm:w-auto items-start justify-between sm:justify-start gap-4">
          <div className="flex-1 sm:hidden space-y-2">
            <div className="h-6 bg-zinc-200 dark:bg-zinc-700 rounded w-32" />
            <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-24" />
          </div>
          <div className="w-16 h-16 bg-zinc-200 dark:bg-zinc-700 rounded-full" />
        </div>

        {/* Content */}
        <div className="flex-1 w-full space-y-3">
          <div className="hidden sm:block space-y-2">
            <div className="h-6 bg-zinc-200 dark:bg-zinc-700 rounded w-40" />
            <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-32" />
          </div>

          <div className="h-12 bg-zinc-200 dark:bg-zinc-700 rounded" />

          <div className="flex gap-2">
            <div className="h-6 bg-zinc-200 dark:bg-zinc-700 rounded-full w-24" />
            <div className="h-6 bg-zinc-200 dark:bg-zinc-700 rounded-full w-20" />
            <div className="h-6 bg-zinc-200 dark:bg-zinc-700 rounded-full w-16" />
          </div>

          <div className="border-t border-zinc-200 dark:border-zinc-700 pt-3">
            <div className="flex justify-between">
              <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-32" />
              <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DashboardCardSkeleton() {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-800 animate-pulse">
      <div className="space-y-3">
        <div className="h-6 bg-zinc-200 dark:bg-zinc-700 rounded w-48" />
        <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-full" />
        <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4" />
        <div className="flex gap-2 mt-4">
          <div className="h-8 bg-zinc-200 dark:bg-zinc-700 rounded flex-1" />
          <div className="h-8 bg-zinc-200 dark:bg-zinc-700 rounded flex-1" />
        </div>
      </div>
    </div>
  );
}

export function ListItemSkeleton() {
  return (
    <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-zinc-800 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-zinc-200 dark:bg-zinc-700 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4" />
          <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-1/2" />
        </div>
      </div>
    </div>
  );
}
