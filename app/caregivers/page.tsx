import Link from "next/link";
import { searchCaregivers } from "@/lib/data/caregivers";
import { FilterBar } from "./filter-bar";
import { CaregiverCard } from "./caregiver-card";
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
                  <CaregiverCard key={caregiver.id} caregiver={caregiver} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
