"use client";

import { useState, useTransition } from "react";
import { signUp } from "../actions";

export function SignUpForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const result = await signUp(formData);
      if (result?.error) {
        // If it's an email confirmation message, show as info instead of error
        if (result.error.includes("Επιβεβαίωση")) {
          setSuccess(result.error);
        } else {
          setError(result.error);
        }
      }
    });
  };

  return (
    <form className="mt-8 space-y-6" action={handleSubmit}>
      {error && (
        <div className="rounded-md bg-red-50 p-3 dark:bg-red-900/20">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {success && (
        <div className="rounded-md bg-blue-50 p-3 dark:bg-blue-900/20">
          <p className="text-sm text-blue-800 dark:text-blue-200">{success}</p>
        </div>
      )}

      <div className="space-y-4 rounded-md">
        <div>
          <label
            htmlFor="full_name"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Ονοματεπώνυμο
          </label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            autoComplete="name"
            required
            className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-zinc-900 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-50 dark:placeholder-zinc-500"
            placeholder="Γιάννης Παπαδόπουλος"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-zinc-900 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-50 dark:placeholder-zinc-500"
            placeholder="email@example.com"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Κωδικός
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-zinc-900 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-50 dark:placeholder-zinc-500"
            placeholder="••••••••"
          />
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Τουλάχιστον 6 χαρακτήρες
          </p>
        </div>

        {/* Role Selection */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Ρόλος
          </label>
          <div className="mt-2 grid gap-2 sm:grid-cols-3">
            <label className="flex items-center gap-2 rounded-md border border-zinc-300 p-3 hover:bg-zinc-50 dark:border-zinc-600 dark:hover:bg-zinc-700/50">
              <input type="radio" name="role" value="owner" defaultChecked />
              <span className="text-sm text-zinc-900 dark:text-zinc-50">
                Ιδιοκτήτης
              </span>
            </label>
            <label className="flex items-center gap-2 rounded-md border border-zinc-300 p-3 hover:bg-zinc-50 dark:border-zinc-600 dark:hover:bg-zinc-700/50">
              <input type="radio" name="role" value="caregiver" />
              <span className="text-sm text-zinc-900 dark:text-zinc-50">
                Φροντιστής
              </span>
            </label>
            <label className="flex items-center gap-2 rounded-md border border-zinc-300 p-3 hover:bg-zinc-50 dark:border-zinc-600 dark:hover:bg-zinc-700/50">
              <input type="radio" name="role" value="both" />
              <span className="text-sm text-zinc-900 dark:text-zinc-50">
                Και τα δύο
              </span>
            </label>
          </div>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Μπορείς να το αλλάξεις αργότερα από το προφίλ σου.
          </p>
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="flex w-full justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {isPending ? "Δημιουργία..." : "Δημιουργία Λογαριασμού"}
      </button>
    </form>
  );
}
