"use client";

import { createBooking } from "@/app/bookings/actions";
import { useState } from "react";
import type { Database } from "@/lib/database.types";

type Pet = Database["public"]["Tables"]["pets"]["Row"];

interface BookingFormProps {
  caregiverId: string;
  userPets: Pet[];
}

export default function BookingForm({
  caregiverId,
  userPets,
}: BookingFormProps) {
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    setError("");
    const result = await createBooking(formData);
    if (result?.error) {
      setError(result.error);
    }
  }

  return (
    <form action={handleSubmit} className="mt-4 space-y-4">
      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      <input type="hidden" name="caregiver_id" value={caregiverId} />
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Κατοικίδιο
        </label>
        <select
          name="pet_id"
          required
          className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-50"
        >
          <option value="">Επίλεξε κατοικίδιο</option>
          {userPets.map((pet) => (
            <option key={pet.id} value={pet.id}>
              {pet.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Από
        </label>
        <input
          type="date"
          name="start_date"
          required
          className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-50"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Έως
        </label>
        <input
          type="date"
          name="end_date"
          required
          className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-50"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Σημειώσεις
        </label>
        <textarea
          name="notes"
          rows={3}
          className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-50"
          placeholder="Πρόσθετες πληροφορίες..."
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-md bg-zinc-900 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        Κλείσε Κράτηση
      </button>
    </form>
  );
}
