import Link from "next/link";
import { getUser, getUserProfile, signOut } from "./auth/actions";
import { ThemeToggle } from "@/components/theme-toggle";
import { StatsSection } from "@/components/stats-section";
import { VideoSection } from "@/components/video-section";
import { HowItWorksSection } from "@/components/how-it-works-section";
import { FAQSection } from "@/components/faq-section";
import { Footer } from "@/components/footer";
import { AnimatedHeroTitle } from "@/components/animated-hero";
import { UserMenu } from "@/components/user-menu";
import { NotificationBell } from "@/components/notification-bell";
import { User, MapPin, Phone } from "lucide-react";

export default async function Home() {
  const user = await getUser();
  const profile = user ? await getUserProfile() : null;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <nav className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link
            href="/"
            className="text-2xl font-bold text-zinc-900 dark:text-zinc-50"
          >
            <img
              src="assets/logo2.png"
              alt="Waggle Logo"
              className="h-14 w-auto"
            />
          </Link>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            {user && <NotificationBell />}
            {user ? (
              <UserMenu
                avatarUrl={profile?.avatar_url}
                fullName={profile?.full_name}
                email={user.email}
              />
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
                >
                  Σύνδεση
                </Link>
                <Link
                  href="/auth/signup"
                  className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  Εγγραφή
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-26 leading-17">
        <div className="text-center">
          <AnimatedHeroTitle />
          <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Η πλατφόρμα που συνδέει ιδιοκτήτες κατοικιδίων με επαγγελματίες
            φροντίδας
          </p>

          {user ? (
            <div className="mt-10 flex justify-center gap-4">
              <Link
                href="/dashboard"
                className=" rounded-md bg-zinc-900 px-6 py-6 text-base font-semibold text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Dashboard
              </Link>
              <Link
                href="/caregivers"
                className="rounded-md border border-zinc-300 px-6 py-6 text-base font-semibold text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-800"
              >
                Αναζήτηση
              </Link>
            </div>
          ) : (
            <div className="mt-10 flex justify-center gap-4">
              <Link
                href="/auth/signup"
                className="rounded-md bg-zinc-900 px-6 py-3 text-base font-semibold text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Ξεκίνα Τώρα
              </Link>
              <Link
                href="/caregivers"
                className="rounded-md border border-zinc-300 px-6 py-3 text-base font-semibold text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-800"
              >
                Δες Φροντιστές
              </Link>
            </div>
          )}
        </div>
        <br></br>

        {/* Stats Section */}
        <div className="mt-12">
          <StatsSection />
        </div>
        <br></br>
        {/* Video Section */}
        <VideoSection />
      </main>
      <hr></hr>

      {/* How It Works Section */}
      <HowItWorksSection />
      <br></br>

      <br></br>
      <br></br>
      <hr></hr>

      {/* Features Grid */}
      <h2 className="text-center mx-auto mt-20 max-w-7xl px-4 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
        Χαρακτηριστικά της Πλατφόρμας μας
      </h2>

      <div className="mx-auto max-w-7xl px-4 py-20">
        <div className="grid gap-8 sm:grid-cols-3 text-center">
          {/* Κάρτα 1 */}
          <div className="flex flex-col items-center rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-800">
            <User className="w-10 h-10 text-black-600 dark:text-blue-400" />
            <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Επαγγελματίες Φροντιστές
            </h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Βρες έμπειρους φροντιστές στην περιοχή σου
            </p>
          </div>

          {/* Κάρτα 2 */}
          <div className="flex flex-col items-center rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-800">
            <MapPin className="w-10 h-10 text-black-600 dark:text-blue-400" />
            <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Αναζήτηση ανά Περιοχή
            </h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Φίλτρα με βάση την τοποθεσία σου για εύκολη εύρεση
            </p>
          </div>

          {/* Κάρτα 3 */}
          <div className="flex flex-col items-center rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-800">
            <Phone className="w-10 h-10 text-black-600 dark:text-blue-400" />
            <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Άμεση Επικοινωνία
            </h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Επικοινώνησε απευθείας με τους φροντιστές
            </p>
          </div>
        </div>
      </div>

      <br></br>
      <hr></hr>
      {/* FAQ Section */}
      <div id="faq">
        <FAQSection />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
