"use client";

import { updateProfile } from "./actions";
import { toast } from "sonner";
import { useState } from "react";
import type { Database } from "@/lib/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface ProfileFormProps {
  profile: Profile;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    const result = await updateProfile(formData);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Το προφίλ ενημερώθηκε επιτυχώς!");
    }
    setLoading(false);
  };

  return (
    <form action={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="full_name"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Ονοματεπώνυμο
        </label>
        <input
          type="text"
          id="full_name"
          name="full_name"
          defaultValue={profile.full_name || ""}
          className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-500 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
          placeholder="Το ονοματεπώνυμό σου"
        />
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Τηλέφωνο
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          defaultValue={profile.phone || ""}
          className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-500 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
          placeholder="+30 123 456 7890"
        />
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
        {loading ? "Αποθήκευση..." : "Αποθήκευση Αλλαγών"}
      </button>
    </form>
  );
}
