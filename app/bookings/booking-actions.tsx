"use client";

import { useState, useTransition } from "react";
import {
  acceptBooking,
  declineBooking,
  cancelBooking,
  completeBooking,
} from "./actions";

type BookingStatus =
  | "pending"
  | "accepted"
  | "declined"
  | "completed"
  | "cancelled";

interface BookingActionsProps {
  bookingId: string;
  status: BookingStatus;
  userRole: "owner" | "caregiver";
}

export function BookingActions({
  bookingId,
  status,
  userRole,
}: BookingActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleAction = (
    action: () => Promise<{ error?: string; success?: boolean }>,
  ) => {
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (result.error) {
        setError(result.error);
      }
    });
  };

  // Owner actions
  if (userRole === "owner") {
    return (
      <div className="space-y-3">
        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-200">
            {error}
          </div>
        )}

        {status === "pending" && (
          <button
            type="button"
            onClick={() => handleAction(() => cancelBooking(bookingId))}
            disabled={isPending}
            className="w-full rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            {isPending ? "Ακύρωση..." : "Ακύρωση Κράτησης"}
          </button>
        )}

        {status === "accepted" && (
          <>
            <button
              type="button"
              onClick={() => handleAction(() => completeBooking(bookingId))}
              disabled={isPending}
              className="w-full rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
            >
              {isPending ? "Ολοκλήρωση..." : "Ολοκλήρωση Κράτησης"}
            </button>
            <button
              type="button"
              onClick={() => handleAction(() => cancelBooking(bookingId))}
              disabled={isPending}
              className="w-full rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              {isPending ? "Ακύρωση..." : "Ακύρωση Κράτησης"}
            </button>
          </>
        )}
      </div>
    );
  }

  // Caregiver actions
  return (
    <div className="space-y-3">
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-200">
          {error}
        </div>
      )}

      {status === "pending" && (
        <>
          <button
            type="button"
            onClick={() => handleAction(() => acceptBooking(bookingId))}
            disabled={isPending}
            className="w-full rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
          >
            {isPending ? "Αποδοχή..." : "Αποδοχή Κράτησης"}
          </button>
          <button
            type="button"
            onClick={() => handleAction(() => declineBooking(bookingId))}
            disabled={isPending}
            className="w-full rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {isPending ? "Απόρριψη..." : "Απόρριψη Κράτησης"}
          </button>
        </>
      )}

      {status === "accepted" && (
        <button
          type="button"
          onClick={() => handleAction(() => completeBooking(bookingId))}
          disabled={isPending}
          className="w-full rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
        >
          {isPending ? "Ολοκλήρωση..." : "Ολοκλήρωση Κράτησης"}
        </button>
      )}
    </div>
  );
}
