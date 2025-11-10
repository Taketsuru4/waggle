import Link from "next/link";
import { getUser, signOut } from "./auth/actions";

export default async function Home() {
  const user = await getUser();

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

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  Γεια σου, {user.email}
                </span>
                <form action={signOut}>
                  <button
                    type="submit"
                    className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                  >
                    Αποσύνδεση
                  </button>
                </form>
              </>
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

      <main className="mx-auto max-w-7xl px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Καλώς ήρθες στο Waggle
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Η πλατφόρμα που συνδέει ιδιοκτήτες κατοικιδίων με επαγγελματίες
            φροντίδας
          </p>

          {user ? (
            <div className="mt-10 flex justify-center gap-4">
              <Link
                href="/dashboard"
                className="rounded-md bg-zinc-900 px-6 py-3 text-base font-semibold text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Πίνακας Ελέγχου
              </Link>
              <Link
                href="/caregivers"
                className="rounded-md border border-zinc-300 px-6 py-3 text-base font-semibold text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-800"
              >
                Αναζήτηση Φροντιστή
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

        <div className="mt-20 grid gap-8 sm:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-800">
            <div className="text-3xl">👤</div>
            <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Επαγγελματίες Φροντιστές
            </h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Βρες έμπειρους φροντιστές στην περιοχή σου
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-800">
            <div className="text-3xl">📍</div>
            <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Αναζήτηση ανά Περιοχή
            </h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Φίλτρα με βάση την τοποθεσία σου
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-800">
            <div className="text-3xl">📞</div>
            <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Άμεση Επικοινωνία
            </h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Επικοινώνησε απευθείας με τους φροντιστές
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
