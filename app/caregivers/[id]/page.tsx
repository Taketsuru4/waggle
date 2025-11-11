import Link from "next/link";
import { redirect } from "next/navigation";
import { getCaregiverById } from "@/lib/data/caregivers";
import { getUser } from "@/app/auth/actions";
import { getUserPets } from "@/lib/data/dashboard";
import { createBooking } from "@/app/bookings/actions";
import { ReviewCard } from "@/components/review-card";
import { RatingStars } from "@/components/rating-stars";

export default async function CaregiverPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUser();
  const caregiver = await getCaregiverById(id);
  const userPets = user ? await getUserPets(user.id) : [];

  if (!caregiver) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center text-zinc-600 dark:text-zinc-400">
          Δεν βρέθηκε φροντιστής
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <Link
            href="/caregivers"
            className="text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
          >
            ← Επιστροφή στη λίστα
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            {caregiver.profiles?.full_name || "Φροντιστής"}
          </h1>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">
            📍 {caregiver.city}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio */}
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-800">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                Σχετικά
              </h2>
              <p className="mt-2 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                {caregiver.bio || "Ο φροντιστής δεν έχει προσθέσει bio ακόμα."}
              </p>
            </div>

            {/* Reviews */}
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-800">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  Αξιολογήσεις
                </h2>
                {caregiver.stats.totalReviews > 0 && (
                  <div className="mt-3 flex items-center gap-3">
                    <RatingStars
                      rating={Math.round(caregiver.stats.averageRating)}
                      readonly
                      size="md"
                    />
                    <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                      {caregiver.stats.averageRating.toFixed(1)}
                    </span>
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                      ({caregiver.stats.totalReviews}{" "}
                      {caregiver.stats.totalReviews === 1
                        ? "αξιολόγηση"
                        : "αξιολογήσεις"}
                      )
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {caregiver.reviews.length === 0 ? (
                  <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-8 text-center dark:border-zinc-700 dark:bg-zinc-900">
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Δεν υπάρχουν αξιολογήσεις ακόμα.
                    </p>
                    <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-500">
                      Γίνε ο πρώτος που θα αξιολογήσει αυτόν τον φροντιστή!
                    </p>
                  </div>
                ) : (
                  caregiver.reviews.map((r: any) => (
                    <ReviewCard
                      key={r.id}
                      rating={r.rating}
                      comment={r.comment}
                      reviewerName={r.profiles?.full_name || "Χρήστης"}
                      createdAt={r.created_at}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-800">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                Στοιχεία
              </h3>
              <div className="mt-3 space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
                <p>Εμπειρία: {caregiver.experience_years || "—"} έτη</p>
                <p>
                  Τιμή:{" "}
                  {caregiver.hourly_rate
                    ? `${caregiver.hourly_rate}€/ώρα`
                    : "—"}
                </p>
                <p>
                  Διαθεσιμότητα:{" "}
                  {caregiver.available ? "Διαθέσιμος" : "Μη διαθέσιμος"}
                </p>
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-800">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                Υπηρεσίες
              </h3>
              <div className="mt-3 flex flex-wrap gap-2 text-sm">
                {caregiver.accepts_dogs && (
                  <span className="rounded-full bg-zinc-100 px-2 py-1 dark:bg-zinc-700">
                    🐕 Σκύλοι
                  </span>
                )}
                {caregiver.accepts_cats && (
                  <span className="rounded-full bg-zinc-100 px-2 py-1 dark:bg-zinc-700">
                    🐈 Γάτες
                  </span>
                )}
                {caregiver.accepts_birds && (
                  <span className="rounded-full bg-zinc-100 px-2 py-1 dark:bg-zinc-700">
                    🦜 Πουλιά
                  </span>
                )}
                {caregiver.accepts_rabbits && (
                  <span className="rounded-full bg-zinc-100 px-2 py-1 dark:bg-zinc-700">
                    🐰 Κουνέλια
                  </span>
                )}
                {caregiver.accepts_other && (
                  <span className="rounded-full bg-zinc-100 px-2 py-1 dark:bg-zinc-700">
                    🦎 Άλλα
                  </span>
                )}
              </div>
            </div>

            {/* Contact Info */}
            {(caregiver.contact_phone ||
              caregiver.whatsapp ||
              caregiver.viber) && (
              <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-800">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
                  Επικοινωνία
                </h3>
                <div className="space-y-3">
                  {caregiver.contact_phone && (
                    <a
                      href={`tel:${caregiver.contact_phone}`}
                      className="flex items-center gap-3 rounded-lg bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-100 dark:bg-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-600 transition-colors"
                    >
                      📞
                      <div>
                        <div className="font-semibold">Τηλέφωνο</div>
                        <div className="text-xs text-zinc-600 dark:text-zinc-400">
                          {caregiver.contact_phone}
                        </div>
                      </div>
                    </a>
                  )}
                  {caregiver.whatsapp && (
                    <a
                      href={`https://wa.me/${caregiver.whatsapp.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-900 hover:bg-green-100 dark:bg-green-900 dark:text-green-50 dark:hover:bg-green-800 transition-colors"
                    >
                      💬
                      <div>
                        <div className="font-semibold">WhatsApp</div>
                        <div className="text-xs text-green-700 dark:text-green-300">
                          Στείλε μήνυμα
                        </div>
                      </div>
                    </a>
                  )}
                  {caregiver.viber && (
                    <a
                      href={`viber://chat?number=${caregiver.viber.replace(/[^0-9]/g, "")}`}
                      className="flex items-center gap-3 rounded-lg bg-purple-50 px-4 py-3 text-sm font-medium text-purple-900 hover:bg-purple-100 dark:bg-purple-900 dark:text-purple-50 dark:hover:bg-purple-800 transition-colors"
                    >
                      💜
                      <div>
                        <div className="font-semibold">Viber</div>
                        <div className="text-xs text-purple-700 dark:text-purple-300">
                          Στείλε μήνυμα
                        </div>
                      </div>
                    </a>
                  )}
                </div>
              </div>
            )}

            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-800">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                Κλείσε Κράτηση
              </h3>
              {!user ? (
                <div className="mt-4">
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Συνδέσου για να κλείσεις κράτηση
                  </p>
                  <Link
                    href="/auth/login"
                    className="mt-4 inline-block rounded-md bg-zinc-900 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                  >
                    Σύνδεση
                  </Link>
                </div>
              ) : userPets.length === 0 ? (
                <div className="mt-4">
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Πρόσθεσε ένα κατοικίδιο πρώτα
                  </p>
                  <Link
                    href="/dashboard/pets/new"
                    className="mt-4 inline-block rounded-md bg-zinc-900 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                  >
                    Προσθήκη Κατοικιδίου
                  </Link>
                </div>
              ) : (
                <form action={createBooking} className="mt-4 space-y-4">
                  <input type="hidden" name="caregiver_id" value={id} />
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
