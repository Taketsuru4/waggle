import Link from "next/link";
import { redirect } from "next/navigation";
import { getCaregiverById } from "@/lib/data/caregivers";
import { getUser } from "@/app/auth/actions";
import { getUserPets } from "@/lib/data/dashboard";
import BookingForm from "./booking-form";
import { ReviewCard } from "@/components/review-card";
import { RatingStars } from "@/components/rating-stars";
import { ContactButtons } from "@/components/contact-buttons";
import { AvailabilityDisplay } from "@/components/availability-display";
import { getAvailabilitySlots } from "@/app/availability/actions";
import { Avatar } from "@/components/avatar";
import { MapPin, Dog, Cat, Bird, Rabbit, Squirrel } from "lucide-react";

export default async function CaregiverPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUser();
  const caregiver = await getCaregiverById(id);
  const userPets = user ? await getUserPets(user.id) : [];
  const availabilityResult = await getAvailabilitySlots(id);
  const availableSlots = availabilityResult.data || [];

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
          <div className="mt-6 flex items-start gap-6">
            <Avatar
              src={caregiver.profiles?.avatar_url}
              alt={caregiver.profiles?.full_name || "Φροντιστής"}
              size="xl"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                {caregiver.profiles?.full_name || "Φροντιστής"}
              </h1>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400 flex items-center gap-1">
                <MapPin className="h-5 w-5" /> {caregiver.city}
              </p>
            </div>
          </div>
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
                  <span className="rounded-full bg-zinc-100 px-2 py-1 dark:bg-zinc-700 inline-flex items-center gap-1">
                    <Dog className="h-4 w-4" /> Σκύλοι
                  </span>
                )}
                {caregiver.accepts_cats && (
                  <span className="rounded-full bg-zinc-100 px-2 py-1 dark:bg-zinc-700 inline-flex items-center gap-1">
                    <Cat className="h-4 w-4" /> Γάτες
                  </span>
                )}
                {caregiver.accepts_birds && (
                  <span className="rounded-full bg-zinc-100 px-2 py-1 dark:bg-zinc-700 inline-flex items-center gap-1">
                    <Bird className="h-4 w-4" /> Πουλιά
                  </span>
                )}
                {caregiver.accepts_rabbits && (
                  <span className="rounded-full bg-zinc-100 px-2 py-1 dark:bg-zinc-700 inline-flex items-center gap-1">
                    <Rabbit className="h-4 w-4" /> Κουνέλια
                  </span>
                )}
                {caregiver.accepts_other && (
                  <span className="rounded-full bg-zinc-100 px-2 py-1 dark:bg-zinc-700 inline-flex items-center gap-1">
                    <Squirrel className="h-4 w-4" /> Άλλα
                  </span>
                )}
              </div>
            </div>

            {/* Availability */}
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-800">
              <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                Διαθεσιμότητα
              </h3>
              <AvailabilityDisplay slots={availableSlots} compact={true} />
            </div>

            {/* Contact Info */}
            <ContactButtons
              contactPhone={caregiver.contact_phone}
              whatsapp={caregiver.whatsapp}
              viber={caregiver.viber}
            />

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
                <BookingForm caregiverId={id} userPets={userPets} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
