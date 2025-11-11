import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/app/auth/actions";
import { getCaregiverProfile } from "@/lib/data/dashboard";
import { updateCaregiverProfile } from "../actions";

export default async function CaregiverEditPage() {
  const user = await getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const caregiverProfile = await getCaregiverProfile(user.id);

  if (!caregiverProfile) {
    redirect("/dashboard/caregiver/setup");
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-3xl px-4 py-6">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
          >
            ← Πίσω
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Επεξεργασία Προφίλ Φροντιστή
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Ενημέρωσε τα στοιχεία του προφίλ σου
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-8">
        <form
          action={updateCaregiverProfile}
          className="space-y-8 rounded-lg bg-white p-8 shadow-sm dark:bg-zinc-800"
        >
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
                <span className="ml-2 text-sm text-zinc-900 dark:text-zinc-50">
                  🐕 Σκύλοι
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="accepts_cats"
                  defaultChecked={caregiverProfile.accepts_cats || false}
                  className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 dark:border-zinc-600 dark:bg-zinc-700"
                />
                <span className="ml-2 text-sm text-zinc-900 dark:text-zinc-50">
                  🐈 Γάτες
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="accepts_birds"
                  defaultChecked={caregiverProfile.accepts_birds || false}
                  className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 dark:border-zinc-600 dark:bg-zinc-700"
                />
                <span className="ml-2 text-sm text-zinc-900 dark:text-zinc-50">
                  🦜 Πουλιά
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="accepts_rabbits"
                  defaultChecked={caregiverProfile.accepts_rabbits || false}
                  className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 dark:border-zinc-600 dark:bg-zinc-700"
                />
                <span className="ml-2 text-sm text-zinc-900 dark:text-zinc-50">
                  🐰 Κουνέλια
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="accepts_other"
                  defaultChecked={caregiverProfile.accepts_other || false}
                  className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 dark:border-zinc-600 dark:bg-zinc-700"
                />
                <span className="ml-2 text-sm text-zinc-900 dark:text-zinc-50">
                  🦎 Άλλα
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
                Τιμή ανά Ώρα (€)
              </label>
              <input
                id="hourly_rate"
                name="hourly_rate"
                type="number"
                min="0"
                step="0.5"
                defaultValue={caregiverProfile.hourly_rate || ""}
                className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-zinc-900 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-50 dark:placeholder-zinc-500"
                placeholder="15.00"
              />
            </div>
          </div>

          {/* Contact Information Section */}
          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Στοιχεία Επικοινωνίας
            </h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Βοήθησε τους πελάτες να επικοινωνήσουν μαζί σου (προαιρετικό)
            </p>
            <div className="mt-4 space-y-4">
              <div>
                <label
                  htmlFor="contact_phone"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  📞 Τηλέφωνο Επικοινωνίας
                </label>
                <input
                  id="contact_phone"
                  name="contact_phone"
                  type="tel"
                  defaultValue={caregiverProfile.contact_phone || ""}
                  className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-zinc-900 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-50 dark:placeholder-zinc-500"
                  placeholder="6912345678"
                />
              </div>

              <div>
                <label
                  htmlFor="whatsapp"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  💬 WhatsApp
                </label>
                <input
                  id="whatsapp"
                  name="whatsapp"
                  type="tel"
                  defaultValue={caregiverProfile.whatsapp || ""}
                  className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-zinc-900 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-50 dark:placeholder-zinc-500"
                  placeholder="6912345678"
                />
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  Οι πελάτες θα μπορούν να σε στείλουν μήνυμα στο WhatsApp
                </p>
              </div>

              <div>
                <label
                  htmlFor="viber"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  💜 Viber
                </label>
                <input
                  id="viber"
                  name="viber"
                  type="tel"
                  defaultValue={caregiverProfile.viber || ""}
                  className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-zinc-900 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-50 dark:placeholder-zinc-500"
                  placeholder="6912345678"
                />
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  Οι πελάτες θα μπορούν να σε στείλουν μήνυμα στο Viber
                </p>
              </div>
            </div>
          </div>

          {/* Availability */}
          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Διαθεσιμότητα
            </h2>
            <div className="mt-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="available"
                  defaultChecked={caregiverProfile.available || false}
                  className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 dark:border-zinc-600 dark:bg-zinc-700"
                />
                <span className="ml-2 text-sm text-zinc-900 dark:text-zinc-50">
                  Είμαι διαθέσιμος για νέες κρατήσεις
                </span>
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <Link
              href="/dashboard"
              className="flex-1 rounded-md border border-zinc-300 px-6 py-3 text-center text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              Ακύρωση
            </Link>
            <button
              type="submit"
              className="flex-1 rounded-md bg-zinc-900 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Αποθήκευση Αλλαγών
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
