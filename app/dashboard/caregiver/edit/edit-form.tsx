"use client";

import { updateCaregiverProfile } from "../actions";
import { useState } from "react";
import {
  Dog,
  Cat,
  Bird,
  Rabbit,
  Squirrel,
  Phone,
  MessageCircle,
  Send,
} from "lucide-react";
import type { Database } from "@/lib/database.types";

type CaregiverProfile =
  Database["public"]["Tables"]["caregiver_profiles"]["Row"];

interface EditFormProps {
  caregiverProfile?: Partial<CaregiverProfile>;
  isSetup?: boolean;
}

export default function EditForm({
  caregiverProfile = {},
  isSetup = false,
}: EditFormProps) {
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    setError("");
    const result = await updateCaregiverProfile(formData);
    if (result?.error) {
      setError(result.error);
    }
  }

  return (
    <form
      action={handleSubmit}
      className="space-y-8 rounded-lg bg-white p-8 shadow-sm dark:bg-zinc-800"
    >
      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Bio Section */}
      <div>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Σχετικά με εσένα
        </h2>
        <div className="mt-4 space-y-4">
          <div>
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Βιογραφικό
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              required
              defaultValue={caregiverProfile.bio || ""}
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-zinc-900 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-50 dark:placeholder-zinc-500"
              placeholder="Διηγήσου λίγα πράγματα για την εμπειρία σου με κατοικίδια..."
            />
          </div>

          <div>
            <label
              htmlFor="experience_years"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Χρόνια Εμπειρίας
            </label>
            <input
              id="experience_years"
              name="experience_years"
              type="number"
              min="0"
              max="50"
              required
              defaultValue={caregiverProfile.experience_years || 0}
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-zinc-900 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-50 dark:placeholder-zinc-500"
              placeholder="5"
            />
          </div>
        </div>
      </div>

      {/* Location Section */}
      <div>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Τοποθεσία
        </h2>
        <div className="mt-4 space-y-4">
          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Πόλη *
            </label>
            <input
              id="city"
              name="city"
              type="text"
              required
              defaultValue={caregiverProfile.city}
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-zinc-900 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-50 dark:placeholder-zinc-500"
              placeholder="Αθήνα"
            />
          </div>

          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Διεύθυνση
            </label>
            <input
              id="address"
              name="address"
              type="text"
              defaultValue={caregiverProfile.address || ""}
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-zinc-900 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-50 dark:placeholder-zinc-500"
              placeholder="Οδός 123"
            />
          </div>

          <div>
            <label
              htmlFor="postal_code"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Ταχυδρομικός Κώδικας
            </label>
            <input
              id="postal_code"
              name="postal_code"
              type="text"
              defaultValue={caregiverProfile.postal_code || ""}
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-zinc-900 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-50 dark:placeholder-zinc-500"
              placeholder="10001"
            />
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Υπηρεσίες
        </h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Τι είδη κατοικιδίων μπορείς να φροντίσεις;
        </p>
        <div className="mt-4 space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="accepts_dogs"
              defaultChecked={caregiverProfile.accepts_dogs || false}
              className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 dark:border-zinc-600 dark:bg-zinc-700"
            />
            <span className="ml-2 text-sm text-zinc-900 dark:text-zinc-50 flex items-center gap-1">
              <Dog className="h-4 w-4" /> Σκύλοι
            </span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="accepts_cats"
              defaultChecked={caregiverProfile.accepts_cats || false}
              className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 dark:border-zinc-600 dark:bg-zinc-700"
            />
            <span className="ml-2 text-sm text-zinc-900 dark:text-zinc-50 flex items-center gap-1">
              <Cat className="h-4 w-4" /> Γάτες
            </span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="accepts_birds"
              defaultChecked={caregiverProfile.accepts_birds || false}
              className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 dark:border-zinc-600 dark:bg-zinc-700"
            />
            <span className="ml-2 text-sm text-zinc-900 dark:text-zinc-50 flex items-center gap-1">
              <Bird className="h-4 w-4" /> Πουλιά
            </span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="accepts_rabbits"
              defaultChecked={caregiverProfile.accepts_rabbits || false}
              className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 dark:border-zinc-600 dark:bg-zinc-700"
            />
            <span className="ml-2 text-sm text-zinc-900 dark:text-zinc-50 flex items-center gap-1">
              <Rabbit className="h-4 w-4" /> Κουνέλια
            </span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="accepts_other"
              defaultChecked={caregiverProfile.accepts_other || false}
              className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 dark:border-zinc-600 dark:bg-zinc-700"
            />
            <span className="ml-2 text-sm text-zinc-900 dark:text-zinc-50 flex items-center gap-1">
              <Squirrel className="h-4 w-4" /> Άλλα
            </span>
          </label>
        </div>
      </div>

      {/* Pricing Section */}
      <div>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Τιμολόγηση
        </h2>
        <div className="mt-4">
          <label
            htmlFor="hourly_rate"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Ωριαία Τιμή (€)
          </label>
          <input
            id="hourly_rate"
            name="hourly_rate"
            type="number"
            min="0"
            step="0.01"
            defaultValue={caregiverProfile.hourly_rate || ""}
            className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-zinc-900 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-50 dark:placeholder-zinc-500"
            placeholder="15.00"
          />
        </div>
      </div>

      {/* Contact Section */}
      <div>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Επικοινωνία
        </h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Πώς μπορούν να επικοινωνήσουν μαζί σου οι ιδιοκτήτες;
        </p>
        <div className="mt-4 space-y-4">
          <div>
            <label
              htmlFor="contact_phone"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1"
            >
              <Phone className="h-4 w-4" /> Τηλέφωνο
            </label>
            <input
              id="contact_phone"
              name="contact_phone"
              type="tel"
              defaultValue={caregiverProfile.contact_phone || ""}
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-zinc-900 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-50 dark:placeholder-zinc-500"
              placeholder="+30 6912345678"
            />
          </div>

          <div>
            <label
              htmlFor="whatsapp"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </label>
            <input
              id="whatsapp"
              name="whatsapp"
              type="tel"
              defaultValue={caregiverProfile.whatsapp || ""}
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-zinc-900 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-50 dark:placeholder-zinc-500"
              placeholder="+30 6912345678"
            />
          </div>

          <div>
            <label
              htmlFor="viber"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1"
            >
              <Send className="h-4 w-4" /> Viber
            </label>
            <input
              id="viber"
              name="viber"
              type="tel"
              defaultValue={caregiverProfile.viber || ""}
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-zinc-900 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-50 dark:placeholder-zinc-500"
              placeholder="+30 6912345678"
            />
          </div>
        </div>
      </div>

      {/* Availability Toggle */}
      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            name="available"
            defaultChecked={caregiverProfile.available || false}
            className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 dark:border-zinc-600 dark:bg-zinc-700"
          />
          <span className="ml-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Διαθέσιμος για κρατήσεις
          </span>
        </label>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Αν απενεργοποιηθεί, δεν θα εμφανίζεσαι στα αποτελέσματα αναζήτησης
        </p>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          className="flex-1 rounded-md bg-zinc-900 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Αποθήκευση Αλλαγών
        </button>
      </div>
    </form>
  );
}
