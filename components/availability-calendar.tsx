"use client";

import { useState } from "react";
import {
  addAvailabilitySlot,
  removeAvailabilitySlot,
} from "@/app/availability/actions";
import { toast } from "sonner";

interface AvailabilitySlot {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
}

interface AvailabilityCalendarProps {
  existingSlots: AvailabilitySlot[];
}

export function AvailabilityCalendar({
  existingSlots,
}: AvailabilityCalendarProps) {
  const [slots, setSlots] = useState<AvailabilitySlot[]>(existingSlots);
  const [loading, setLoading] = useState(false);

  const handleAddSlot = async (formData: FormData) => {
    setLoading(true);
    const result = await addAvailabilitySlot(formData);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Η διαθεσιμότητα προστέθηκε!");
      // Refresh - in production you'd update the state properly
      window.location.reload();
    }
    setLoading(false);
  };

  const handleRemoveSlot = async (slotId: string) => {
    if (!confirm("Είσαι σίγουρος ότι θέλεις να διαγράψεις αυτό το slot;")) {
      return;
    }

    const result = await removeAvailabilitySlot(slotId);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Το slot διαγράφηκε!");
      setSlots(slots.filter((s) => s.id !== slotId));
    }
  };

  return (
    <div className="space-y-8">
      {/* Add New Slot Form */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-800">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Προσθήκη Διαθεσιμότητας
        </h3>
        <form action={handleAddSlot} className="mt-4 space-y-4">
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Ημερομηνία
            </label>
            <input
              type="date"
              id="date"
              name="date"
              required
              min={new Date().toISOString().split("T")[0]}
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="start_time"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Ώρα Έναρξης
              </label>
              <input
                type="time"
                id="start_time"
                name="start_time"
                required
                className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
              />
            </div>

            <div>
              <label
                htmlFor="end_time"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Ώρα Λήξης
              </label>
              <input
                type="time"
                id="end_time"
                name="end_time"
                required
                className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-md px-4 py-2 text-sm font-medium ${
              loading
                ? "bg-zinc-400 text-white"
                : "bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            }`}
          >
            {loading ? "Προσθήκη..." : "Προσθήκη Διαθεσιμότητας"}
          </button>
        </form>
      </div>

      {/* Existing Slots */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-800">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Τα Διαθέσιμα Slots Σου
        </h3>

        {slots.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
            Δεν έχεις ακόμα καθορίσει διαθεσιμότητα. Πρόσθεσε slots παραπάνω!
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {slots.map((slot) => (
              <div
                key={slot.id}
                className="flex items-center justify-between rounded-md border border-zinc-200 p-3 dark:border-zinc-700"
              >
                <div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">
                    {new Date(slot.date).toLocaleDateString("el-GR", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {slot.start_time} - {slot.end_time}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveSlot(slot.id)}
                  className="rounded-md px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  Διαγραφή
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
