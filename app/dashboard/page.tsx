import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "../auth/actions";
import {
  getCaregiverBookings,
  getCaregiverProfile,
  getCaregiverStats,
  getOwnerBookings,
  getProfile,
  getUserPets,
} from "@/lib/data/dashboard";

export default async function DashboardPage() {
  const user = await getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const profile = await getProfile(user.id);
  const caregiverProfile = await getCaregiverProfile(user.id);
  const pets = await getUserPets(user.id);
  const ownerBookings = await getOwnerBookings(user.id);

  const isOwner = profile?.role === "owner" || profile?.role === "both";
  const isCaregiver = profile?.role === "caregiver" || profile?.role === "both";

  // Get caregiver bookings if user is a caregiver
  const caregiverBookings = caregiverProfile
    ? await getCaregiverBookings(caregiverProfile.id)
    : [];

  // Get caregiver stats if user is a caregiver
  const caregiverStats = caregiverProfile
    ? await getCaregiverStats(caregiverProfile.id)
    : null;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      {/* Header */}
      <div className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                Πίνακας Ελέγχου
              </h1>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Καλώς ήρθες, {profile?.full_name || user.email}
              </p>
            </div>
            <Link
              href="/"
              className="text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
            >
              ← Αρχική
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Role Tabs (if both) */}
        {profile?.role === "both" && (
          <div className="mb-8 flex gap-2 rounded-lg bg-white p-1 dark:bg-zinc-800">
            <button
              type="button"
              className="flex-1 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-zinc-50 dark:text-zinc-900"
            >
              Ως Ιδιοκτήτης
            </button>
            <button
              type="button"
              className="flex-1 rounded-md px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              Ως Φροντιστής
            </button>
          </div>
        )}

        {/* Owner Dashboard */}
        {isOwner && (
          <div className="space-y-8">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                  Τα Κατοικίδια Μου
                </h2>
                <Link
                  href="/dashboard/pets/new"
                  className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  + Προσθήκη Κατοικιδίου
                </Link>
              </div>

              {pets.length === 0 ? (
                <div className="rounded-lg border-2 border-dashed border-zinc-300 bg-white p-12 text-center dark:border-zinc-700 dark:bg-zinc-800">
                  <p className="text-zinc-600 dark:text-zinc-400">
                    Δεν έχεις προσθέσει κατοικίδια ακόμα
                  </p>
                  <Link
                    href="/dashboard/pets/new"
                    className="mt-4 inline-block text-sm font-medium text-zinc-900 hover:text-zinc-700 dark:text-zinc-50 dark:hover:text-zinc-300"
                  >
                    Πρόσθεσε το πρώτο σου κατοικίδιο →
                  </Link>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {pets.map((pet) => (
                    <div
                      key={pet.id}
                      className="rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-800"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                            {pet.name}
                          </h3>
                          <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            {pet.type}
                            {pet.breed && ` • ${pet.breed}`}
                          </p>
                          {pet.age && (
                            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
                              {pet.age} ετών
                            </p>
                          )}
                        </div>
                        <Link
                          href={`/dashboard/pets/${pet.id}`}
                          className="text-sm text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
                        >
                          Επεξεργασία
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bookings */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                  Οι Κρατήσεις Μου
                </h2>
                <Link
                  href="/caregivers"
                  className="text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
                >
                  Βρες Φροντιστή →
                </Link>
              </div>

              {ownerBookings.length === 0 ? (
                <div className="rounded-lg border-2 border-dashed border-zinc-300 bg-white p-12 text-center dark:border-zinc-700 dark:bg-zinc-800">
                  <p className="text-zinc-600 dark:text-zinc-400">
                    Δεν έχεις κρατήσεις ακόμα
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {ownerBookings.slice(0, 5).map((booking) => (
                    <Link
                      key={booking.id}
                      href={`/bookings/${booking.id}`}
                      className="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm hover:shadow-md transition-shadow dark:bg-zinc-800"
                    >
                      <div>
                        <p className="font-medium text-zinc-900 dark:text-zinc-50">
                          Κράτηση #{booking.id.slice(0, 8)}
                        </p>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                          {new Date(booking.start_date).toLocaleDateString(
                            "el-GR",
                          )}{" "}
                          -{" "}
                          {new Date(booking.end_date).toLocaleDateString(
                            "el-GR",
                          )}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          booking.status === "pending"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : booking.status === "accepted"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-zinc-100 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Caregiver Dashboard */}
        {isCaregiver && (
          <div className="mt-8 space-y-8">
            <div>
              <h2 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                Το Προφίλ μου ως Φροντιστής
              </h2>

              {!caregiverProfile ? (
                <div className="rounded-lg border-2 border-dashed border-zinc-300 bg-white p-12 text-center dark:border-zinc-700 dark:bg-zinc-800">
                  <p className="text-zinc-600 dark:text-zinc-400">
                    Δεν έχεις δημιουργήσει προφίλ φροντιστή ακόμα
                  </p>
                  <Link
                    href="/dashboard/caregiver/setup"
                    className="mt-4 inline-block rounded-md bg-zinc-900 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                  >
                    Δημιούργησε Προφίλ Φροντιστή
                  </Link>
                </div>
              ) : (
                <>
                  {/* Stats */}
                  <div className="mb-6 grid gap-4 sm:grid-cols-4">
                    <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-800">
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        Σύνολο Κρατήσεων
                      </p>
                      <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                        {caregiverStats?.totalBookings || 0}
                      </p>
                    </div>
                    <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-800">
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        Εκκρεμή Αιτήματα
                      </p>
                      <p className="mt-2 text-3xl font-bold text-yellow-600">
                        {caregiverStats?.pendingBookings || 0}
                      </p>
                    </div>
                    <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-800">
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        Μέση Αξιολόγηση
                      </p>
                      <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                        {caregiverStats?.averageRating.toFixed(1) || "—"}
                      </p>
                    </div>
                    <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-800">
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        Αξιολογήσεις
                      </p>
                      <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                        {caregiverStats?.totalReviews || 0}
                      </p>
                    </div>
                  </div>

                  {/* Profile Info */}
                  <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-800">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                            {caregiverProfile.city}
                          </h3>
                          {caregiverProfile.verified && (
                            <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                              ✓ Επιβεβαιωμένος
                            </span>
                          )}
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-medium ${
                              caregiverProfile.available
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-zinc-100 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200"
                            }`}
                          >
                            {caregiverProfile.available
                              ? "Διαθέσιμος"
                              : "Μη Διαθέσιμος"}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                          {caregiverProfile.bio || "Δεν έχεις προσθέσει bio"}
                        </p>
                        <div className="mt-4 flex gap-4 text-sm">
                          {caregiverProfile.experience_years && (
                            <span className="text-zinc-600 dark:text-zinc-400">
                              Εμπειρία: {caregiverProfile.experience_years} έτη
                            </span>
                          )}
                          {caregiverProfile.hourly_rate && (
                            <span className="text-zinc-600 dark:text-zinc-400">
                              {caregiverProfile.hourly_rate}€/ώρα
                            </span>
                          )}
                        </div>
                      </div>
                      <Link
                        href="/dashboard/caregiver/edit"
                        className="text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
                      >
                        Επεξεργασία →
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Caregiver Bookings */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                  Κρατήσεις Πελατών
                </h2>
              </div>

              {caregiverBookings.length === 0 ? (
                <div className="rounded-lg border-2 border-dashed border-zinc-300 bg-white p-12 text-center dark:border-zinc-700 dark:bg-zinc-800">
                  <p className="text-zinc-600 dark:text-zinc-400">
                    Δεν έχεις λάβει κρατήσεις ακόμα
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {caregiverBookings.map((booking) => (
                    <Link
                      key={booking.id}
                      href={`/bookings/${booking.id}`}
                      className="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm hover:shadow-md transition-shadow dark:bg-zinc-800"
                    >
                      <div>
                        <p className="font-medium text-zinc-900 dark:text-zinc-50">
                          Κράτηση #{booking.id.slice(0, 8)}
                        </p>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                          {new Date(booking.start_date).toLocaleDateString(
                            "el-GR",
                          )}{" "}
                          -{" "}
                          {new Date(booking.end_date).toLocaleDateString(
                            "el-GR",
                          )}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          booking.status === "pending"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : booking.status === "accepted"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : booking.status === "declined"
                                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                : booking.status === "completed"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                  : "bg-zinc-100 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200"
                        }`}
                      >
                        {booking.status === "pending"
                          ? "Εκκρεμεί"
                          : booking.status === "accepted"
                            ? "Εγκρίθηκε"
                            : booking.status === "declined"
                              ? "Απορρίφθηκε"
                              : booking.status === "completed"
                                ? "Ολοκληρώθηκε"
                                : "Ακυρώθηκε"}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
