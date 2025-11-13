import Link from "next/link";

export default function TermsPage() {
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
            href="/"
            className="text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
          >
            ← Αρχική
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-4 py-16">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Όροι Χρήσης
        </h1>
        <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-500">
          Τελευταία ενημέρωση: {new Date().toLocaleDateString("el-GR")}
        </p>

        <div className="mt-12 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              1. Αποδοχή Όρων
            </h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400">
              Με τη χρήση της πλατφόρμας Waggle, αποδέχεστε αυτούς τους όρους
              χρήσης. Εάν δεν συμφωνείτε με αυτούς τους όρους, παρακαλούμε μην
              χρησιμοποιήσετε την υπηρεσία μας.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              2. Χρήση της Υπηρεσίας
            </h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400">
              Το Waggle είναι μια πλατφόρμα σύνδεσης μεταξύ ιδιοκτητών
              κατοικιδίων και επαγγελματιών φροντιστών. Δεν είμαστε υπεύθυνοι
              για τις συναλλαγές ή τις υπηρεσίες που παρέχονται μεταξύ των
              χρηστών.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              3. Λογαριασμός Χρήστη
            </h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400">
              Είστε υπεύθυνοι για τη διατήρηση της εμπιστευτικότητας του
              λογαριασμού σας και του κωδικού πρόσβασής σας. Συμφωνείτε να
              αποδεχτείτε την ευθύνη για όλες τις δραστηριότητες που
              πραγματοποιούνται με τον λογαριασμό σας.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              4. Περιεχόμενο Χρήστη
            </h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400">
              Διατηρείτε όλα τα δικαιώματα στο περιεχόμενο που δημοσιεύετε στην
              πλατφόρμα μας. Ωστόσο, μας παραχωρείτε άδεια χρήσης αυτού του
              περιεχομένου για τη λειτουργία και προώθηση της υπηρεσίας μας.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              5. Περιορισμός Ευθύνης
            </h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400">
              Το Waggle δεν φέρει ευθύνη για τυχόν ζημιές που προκύπτουν από τη
              χρήση ή την αδυναμία χρήσης της υπηρεσίας μας. Η υπηρεσία
              παρέχεται "ως έχει" χωρίς καμία εγγύηση.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              6. Τροποποιήσεις Όρων
            </h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400">
              Διατηρούμε το δικαίωμα να τροποποιήσουμε αυτούς τους όρους
              οποιαδήποτε στιγμή. Οι αλλαγές θα τίθενται σε ισχύ αμέσως μετά τη
              δημοσίευσή τους στην πλατφόρμα.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              7. Επικοινωνία
            </h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400">
              Για οποιεσδήποτε ερωτήσεις σχετικά με αυτούς τους όρους, μπορείτε
              να επικοινωνήσετε μαζί μας στο:{" "}
              <a
                href="mailto:support@waggle.gr"
                className="text-zinc-900 underline dark:text-zinc-50"
              >
                support@waggle.gr
              </a>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
