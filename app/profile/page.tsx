import { redirect } from "next/navigation";
import { getUser, getUserProfile } from "@/app/auth/actions";
import { AvatarUpload } from "@/components/avatar-upload";
import { ProfileForm } from "./profile-form";
import Link from "next/link";

export default async function ProfilePage() {
  const user = await getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const profile = await getUserProfile();

  if (!profile) {
    redirect("/");
  }

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
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Ρυθμίσεις Προφίλ
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Διαχειρίσου τα στοιχεία του λογαριασμού σου
        </p>

        <div className="mt-12 space-y-12">
          {/* Avatar Section */}
          <section className="rounded-lg border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-800">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Φωτογραφία Προφίλ
            </h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Ανέβασε μια φωτογραφία για το προφίλ σου
            </p>
            <div className="mt-6">
              <AvatarUpload
                userId={user.id}
                currentAvatarUrl={profile.avatar_url}
              />
            </div>
          </section>

          {/* Profile Info Section */}
          <section className="rounded-lg border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-800">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Προσωπικές Πληροφορίες
            </h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Ενημέρωσε τα στοιχεία σου
            </p>
            <div className="mt-6">
              <ProfileForm profile={profile} />
            </div>
          </section>

          {/* Account Info */}
          <section className="rounded-lg border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-800">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              Πληροφορίες Λογαριασμού
            </h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Email
                </label>
                <p className="mt-1 text-zinc-900 dark:text-zinc-50">
                  {profile.email}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Ρόλος
                </label>
                <p className="mt-1 text-zinc-900 dark:text-zinc-50">
                  {profile.role === "owner"
                    ? "Ιδιοκτήτης"
                    : profile.role === "caregiver"
                      ? "Φροντιστής"
                      : "Ιδιοκτήτης & Φροντιστής"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Μέλος από
                </label>
                <p className="mt-1 text-zinc-900 dark:text-zinc-50">
                  {new Date(profile.created_at).toLocaleDateString("el-GR")}
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
