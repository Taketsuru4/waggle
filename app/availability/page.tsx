import { redirect } from "next/navigation";
import { getUser } from "@/app/auth/actions";
import { createClient } from "@/lib/supabase/server";
import { AvailabilityCalendar } from "@/components/availability-calendar";
import Link from "next/link";

export default async function AvailabilityPage() {
  const user = await getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const supabase = await createClient();

  // Check if user is a caregiver
  const { data: caregiver } = await supabase
    .from("caregiver_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!caregiver) {
    redirect("/dashboard");
  }

  // Get existing availability slots
  const { data: slots } = await supabase
    .from("caregiver_availability")
    .select("*")
    .eq("caregiver_id", caregiver.id)
    .eq("is_available", true)
    .gte("date", new Date().toISOString().split("T")[0])
    .order("date", { ascending: true })
    .order("start_time", { ascending: true });

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <nav className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link
            href="/"
            className="text-2xl font-bold text-zinc-900 dark:text-zinc-50"
          >
            🐾 Waggle
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
          >
            ← Πίσω στο Dashboard
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-4 py-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Διαχείριση Διαθεσιμότητας
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Όρισε τις ώρες και ημέρες που είσαι διαθέσιμος για φροντίδα
            κατοικιδίων
          </p>
        </div>

        <AvailabilityCalendar existingSlots={slots || []} />
      </main>
    </div>
  );
}
