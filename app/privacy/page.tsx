import Link from "next/link";

export default function PrivacyPage() {
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
          Πολιτική Απορρήτου
        </h1>
        <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-500">
          Τελευταία ενημέρωση: {new Date().toLocaleDateString("el-GR")}
        </p>

        <div className="mt-12 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              1. Εισαγωγή
            </h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400">
              Στο Waggle, σεβόμαστε την ιδιωτικότητά σας και δεσμευόμαστε να
              προστατεύουμε τα προσωπικά σας δεδομένα. Αυτή η πολιτική απορρήτου
              εξηγεί πώς συλλέγουμε, χρησιμοποιούμε και προστατεύουμε τα
              δεδομένα σας.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              2. Δεδομένα που Συλλέγουμε
            </h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400">
              Συλλέγουμε πληροφορίες που μας παρέχετε κατά την εγγραφή σας,
              συμπεριλαμβανομένων του email, του ονόματος και των πληροφοριών
              προφίλ. Για τους επαγγελματίες φροντιστές, συλλέγουμε επιπλέον
              πληροφορίες όπως τοποθεσία, εμπειρία και διαθεσιμότητα.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              3. Χρήση των Δεδομένων
            </h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400">
              Χρησιμοποιούμε τα δεδομένα σας για να παρέχουμε και να βελτιώνουμε
              τις υπηρεσίες μας, να διευκολύνουμε τη σύνδεση μεταξύ ιδιοκτητών
              κατοικιδίων και φροντιστών, και να επικοινωνούμε μαζί σας σχετικά
              με την πλατφόρμα.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              4. Κοινοποίηση Δεδομένων
            </h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400">
              Δεν πουλάμε τα προσωπικά σας δεδομένα. Τα δεδομένα σας
              κοινοποιούνται μόνο με άλλους χρήστες της πλατφόρμας όπως
              απαιτείται για τη λειτουργία της υπηρεσίας (π.χ. εμφάνιση προφίλ
              φροντιστή σε αναζητήσεις).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              5. Ασφάλεια Δεδομένων
            </h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400">
              Λαμβάνουμε κατάλληλα τεχνικά και οργανωτικά μέτρα για την
              προστασία των δεδομένων σας από μη εξουσιοδοτημένη πρόσβαση,
              απώλεια ή κακή χρήση. Χρησιμοποιούμε κρυπτογράφηση και ασφαλείς
              πρακτικές αποθήκευσης.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              6. Τα Δικαιώματά Σας
            </h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400">
              Έχετε το δικαίωμα πρόσβασης, διόρθωσης ή διαγραφής των προσωπικών
              σας δεδομένων. Μπορείτε επίσης να αντιταχθείτε στην επεξεργασία
              των δεδομένων σας ή να ζητήσετε τη μεταφορά τους. Επικοινωνήστε
              μαζί μας για να ασκήσετε αυτά τα δικαιώματα.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              7. Cookies
            </h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400">
              Χρησιμοποιούμε cookies για τη διατήρηση της σύνδεσής σας και για
              τη βελτίωση της εμπειρίας σας στην πλατφόρμα. Μπορείτε να
              διαχειριστείτε τις προτιμήσεις cookies από τον περιηγητή σας.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              8. Αλλαγές στην Πολιτική
            </h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400">
              Ενδέχεται να ενημερώσουμε αυτήν την πολιτική απορρήτου κατά
              καιρούς. Θα σας ειδοποιήσουμε για τυχόν σημαντικές αλλαγές μέσω
              email ή ειδοποίησης στην πλατφόρμα.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              9. Επικοινωνία
            </h2>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400">
              Για ερωτήσεις σχετικά με την πολιτική απορρήτου μας ή για να
              ασκήσετε τα δικαιώματά σας, επικοινωνήστε μαζί μας στο:{" "}
              <a
                href="mailto:privacy@waggle.gr"
                className="text-zinc-900 underline dark:text-zinc-50"
              >
                privacy@waggle.gr
              </a>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
