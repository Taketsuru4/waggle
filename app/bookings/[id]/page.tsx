import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { getUser } from "@/app/auth/actions";
import { getBookingDetails } from "@/lib/data/dashboard";
import { BookingActions } from "../booking-actions";
import { ReviewSection } from "./review-section";

interface PageProps {
  params: Promise<{ id: string }>;
}

function getStatusColor(status: string) {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "accepted":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "declined":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    case "completed":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "cancelled":
      return "bg-zinc-100 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200";
    default:
      return "bg-zinc-100 text-zinc-800";
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case "pending":
      return "Εκκρεμεί";
    case "accepted":
      return "Εγκρίθηκε";
    case "declined":
      return "Απορρίφθηκε";
    case "completed":
      return "Ολοκληρώθηκε";
    case "cancelled":
      return "Ακυρώθηκε";
    default:
      return status;
  }
}

export default async function BookingDetailPage({ params }: PageProps) {
  const { id } = await params;
  const user = await getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const booking = await getBookingDetails(id);

  if (!booking) {
    notFound();
  }

  // Determine user's role in this booking
  const isOwner = booking.owner_id === user.id;
  const isCaregiver = booking.caregiver.user_id === user.id;

  if (!isOwner && !isCaregiver) {
    redirect("/dashboard");
  }

  const userRole = isOwner ? "owner" : "caregiver";
  const otherParty = isOwner ? booking.caregiver : booking.owner;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      {/* Header */}
      <div className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
              >
                ← Πίνακας Ελέγχου
              </Link>
              <h1 className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                Λεπτομέρειες Κράτησης
              </h1>
            </div>
            <span
              className={`rounded-full px-4 py-2 text-sm font-medium ${getStatusColor(booking.status)}`}
            >
              {getStatusLabel(booking.status)}
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Booking Details */}
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-800">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
                Πληροφορίες Κράτησης
              </h2>

              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Ημερομηνία Έναρξης
                    </p>
                    <p className="mt-1 font-medium text-zinc-900 dark:text-zinc-50">
                      {new Date(booking.start_date).toLocaleDateString(
                        "el-GR",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Ημερομηνία Λήξης
                    </p>
                    <p className="mt-1 font-medium text-zinc-900 dark:text-zinc-50">
                      {new Date(booking.end_date).toLocaleDateString("el-GR", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Διάρκεια
                  </p>
                  <p className="mt-1 font-medium text-zinc-900 dark:text-zinc-50">
                    {Math.ceil(
                      (new Date(booking.end_date).getTime() -
                        new Date(booking.start_date).getTime()) /
                        (1000 * 60 * 60 * 24),
                    )}{" "}
                    ημέρες
                  </p>
                </div>

                {booking.notes && (
                  <div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Σημειώσεις
                    </p>
                    <p className="mt-1 text-zinc-900 dark:text-zinc-50">
                      {booking.notes}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Δημιουργήθηκε
                  </p>
                  <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
                    {new Date(booking.created_at).toLocaleDateString("el-GR")}
                  </p>
                </div>
              </div>
            </div>

            {/* Pet Details */}
            {booking.pet ? (
              <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-800">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
                  Κατοικίδιο
                </h2>

                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                      {booking.pet.name}
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {booking.pet.type}
                      {booking.pet.breed && ` • ${booking.pet.breed}`}
                    </p>
                  </div>

                  {booking.pet.age && (
                    <div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        Ηλικία
                      </p>
                      <p className="mt-1 text-zinc-900 dark:text-zinc-50">
                        {booking.pet.age} ετών
                      </p>
                    </div>
                  )}

                  {booking.pet.description && (
                    <div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        Περιγραφή
                      </p>
                      <p className="mt-1 text-zinc-900 dark:text-zinc-50">
                        {booking.pet.description}
                      </p>
                    </div>
                  )}

                  {booking.pet.special_needs && (
                    <div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        Ειδικές Ανάγκες
                      </p>
                      <p className="mt-1 text-zinc-900 dark:text-zinc-50">
                        {booking.pet.special_needs}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-800">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
                  Κατοικίδιο
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400">
                  Το κατοικίδιο δεν βρέθηκε ή έχει διαγραφεί.
                </p>
              </div>
            )}

            {/* Review Section (only for completed bookings by owner) */}
            <ReviewSection
              bookingId={booking.id}
              bookingStatus={booking.status}
              caregiverName={
                isOwner
                  ? otherParty.profile?.full_name ||
                    otherParty.profile?.email ||
                    "Φροντιστής"
                  : ""
              }
              isOwner={isOwner}
            />

            {/* Contact Info */}
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-800">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
                {isOwner ? "Φροντιστής" : "Ιδιοκτήτης"}
              </h2>

              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                    {isOwner
                      ? otherParty.profile.full_name || otherParty.profile.email
                      : otherParty.full_name || otherParty.email}
                  </h3>
                  {isOwner && "city" in otherParty && otherParty.city && (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {otherParty.city}
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Email
                  </p>
                  <p className="mt-1 text-zinc-900 dark:text-zinc-50">
                    {isOwner ? otherParty.profile.email : otherParty.email}
                  </p>
                </div>

                {((isOwner &&
                  "profile" in otherParty &&
                  otherParty.profile.phone) ||
                  (!isOwner && "phone" in otherParty && otherParty.phone)) && (
                  <div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Τηλέφωνο
                    </p>
                    <p className="mt-1 text-zinc-900 dark:text-zinc-50">
                      {isOwner && "profile" in otherParty
                        ? otherParty.profile.phone
                        : "phone" in otherParty
                          ? otherParty.phone
                          : null}
                    </p>
                  </div>
                )}

                {isOwner && "bio" in otherParty && otherParty.bio && (
                  <div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      Bio
                    </p>
                    <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
                      {otherParty.bio}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Actions */}
          <div className="lg:col-span-1">
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-800 sticky top-8">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
                Ενέργειες
              </h2>

              <BookingActions
                bookingId={booking.id}
                status={booking.status}
                userRole={userRole}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
