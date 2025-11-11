import Link from "next/link";
import { searchCaregivers } from "@/lib/data/caregivers";
import { FilterBar } from "./filter-bar";
import { Suspense } from "react";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    city?: string;
    petType?: string;
    minRate?: string;
    maxRate?: string;
  }>;
}

export default async function CaregiversPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const caregivers = await searchCaregivers({
    search: params.search,
    city: params.city,
    petType: params.petType,
    minRate: params.minRate ? parseFloat(params.minRate) : undefined,
    maxRate: params.maxRate ? parseFloat(params.maxRate) : undefined,
  });

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      {/* Header */}
      <div className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <Link
            href="/"
            className="text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
          >
            ← Αρχική
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Βρες Φροντιστή
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Επαγγελματίες φροντιστές κατοικιδίων στην περιοχή σου
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Sidebar - Filters */}
          <aside className="lg:col-span-1">
            <div className="sticky top-8">
              <Suspense
                fallback={
                  <div className="h-96 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-700" />
                }
              >
                <FilterBar />
              </Suspense>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Results Count */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                {caregivers.length} Φροντιστ
                {caregivers.length === 1 ? "ής" : "ές"}
              </h2>
            </div>

            {caregivers.length === 0 ? (
              <div className="rounded-lg border-2 border-dashed border-zinc-300 bg-white p-12 text-center dark:border-zinc-700 dark:bg-zinc-800">
                <p className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
                  Δεν βρέθηκαν φροντιστές
                </p>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  Δοκίμασε να αλλάξεις τα φίλτρα αναζήτησης
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                {caregivers.map((caregiver: any) => (
                  <Link
                    key={caregiver.id}
                    href={`/caregivers/${caregiver.id}`}
                    className="group rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:bg-zinc-800"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-zinc-900 group-hover:text-zinc-700 dark:text-zinc-50 dark:group-hover:text-zinc-300">
                          {caregiver.profiles?.full_name || "Φροντιστής"}
                        </h3>
                        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                          📍 {caregiver.city}
                        </p>
                      </div>
                      {caregiver.verified && (
                        <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          ✓ Επιβεβαιωμένος
                        </span>
                      )}
                    </div>

                    {caregiver.bio && (
                      <p className="mt-3 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
                        {caregiver.bio}
                      </p>
                    )}

                    {/* Services */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {caregiver.accepts_dogs && (
                        <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300">
                          🐕 Σκύλοι
                        </span>
                      )}
                      {caregiver.accepts_cats && (
                        <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300">
                          🐈 Γάτες
                        </span>
                      )}
                      {caregiver.accepts_birds && (
                        <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300">
                          🦜 Πουλιά
                        </span>
                      )}
                      {caregiver.accepts_rabbits && (
                        <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300">
                          🐰 Κουνέλια
                        </span>
                      )}
                      {caregiver.accepts_other && (
                        <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300">
                          🦎 Άλλα
                        </span>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="mt-4 space-y-3 border-t border-zinc-200 pt-4 dark:border-zinc-700">
                      <div className="flex items-center justify-between text-sm">
                        <div>
                          {caregiver.experience_years && (
                            <span className="text-zinc-600 dark:text-zinc-400">
                              {caregiver.experience_years} έτη εμπειρίας
                            </span>
                          )}
                        </div>
                        {caregiver.hourly_rate && (
                          <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                            {caregiver.hourly_rate}€/ώρα
                          </div>
                        )}
                      </div>

                      {/* Contact Info */}
                      {(caregiver.contact_phone ||
                        caregiver.whatsapp ||
                        caregiver.viber) && (
                        <div className="flex flex-wrap gap-2 text-xs">
                          {caregiver.contact_phone && (
                            <a
                              href={`tel:${caregiver.contact_phone}`}
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-1 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
                            >
                              📞 {caregiver.contact_phone}
                            </a>
                          )}
                          {caregiver.whatsapp && (
                            <a
                              href={`https://wa.me/${caregiver.whatsapp.replace(/[^0-9]/g, "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800"
                            >
                              💬 WhatsApp
                            </a>
                          )}
                          {caregiver.viber && (
                            <a
                              href={`viber://chat?number=${caregiver.viber.replace(/[^0-9]/g, "")}`}
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2 py-1 text-purple-700 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-300 dark:hover:bg-purple-800"
                            >
                              💜 Viber
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
