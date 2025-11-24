interface AvailabilitySlot {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
}

interface AvailabilityDisplayProps {
  slots: AvailabilitySlot[];
  compact?: boolean;
}

export function AvailabilityDisplay({
  slots,
  compact = false,
}: AvailabilityDisplayProps) {
  if (slots.length === 0) {
    return (
      <div className="rounded-md border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Δεν υπάρχουν διαθέσιμα slots αυτή τη στιγμή
        </p>
      </div>
    );
  }

  // Group slots by date
  const slotsByDate = slots.reduce(
    (acc, slot) => {
      if (!acc[slot.date]) {
        acc[slot.date] = [];
      }
      acc[slot.date].push(slot);
      return acc;
    },
    {} as Record<string, AvailabilitySlot[]>,
  );

  const dates = Object.keys(slotsByDate).sort();

  // Show only first 3 dates in compact mode
  const displayDates = compact ? dates.slice(0, 3) : dates;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          📅 Διαθέσιμες Ημερομηνίες
        </span>
        {compact && dates.length > 3 && (
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            (+{dates.length - 3} ακόμα)
          </span>
        )}
      </div>

      <div className="space-y-3">
        {displayDates.map((date) => {
          const dateSlots = slotsByDate[date];
          return (
            <div
              key={date}
              className="rounded-md border border-zinc-200 bg-white p-3 dark:border-zinc-700 dark:bg-zinc-800"
            >
              <p className="mb-2 text-sm font-medium text-zinc-900 dark:text-zinc-50">
                {new Date(date).toLocaleDateString("el-GR", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}
              </p>
              <div className="flex flex-wrap gap-2">
                {dateSlots.map((slot) => (
                  <span
                    key={slot.id}
                    className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400"
                  >
                    {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
