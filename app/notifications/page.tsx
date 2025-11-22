import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "../auth/actions";
import { NotificationsList } from "./notifications-list";

export default async function NotificationsPage() {
  const user = await getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      {/* Header */}
      <div className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
          >
            ← Πίσω
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Ειδοποιήσεις
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Όλες οι ειδοποιήσεις σου
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8">
        <NotificationsList />
      </div>
    </div>
  );
}
