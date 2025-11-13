export function HowItWorksSection() {
  const steps = [
    {
      number: "1",
      title: "Δημιούργησε Λογαριασμό",
      description:
        "Κάνε εγγραφή δωρεάν και ξεκίνα να εξερευνάς τους φροντιστές στην περιοχή σου.",
    },
    {
      number: "2",
      title: "Βρες τον Ιδανικό Φροντιστή",
      description:
        "Αναζήτησε με βάση την τοποθεσία, την εμπειρία και τη διαθεσιμότητα.",
    },
    {
      number: "3",
      title: "Επικοινώνησε Άμεσα",
      description:
        "Στείλε μήνυμα ή κάλεσε απευθείας για να κανονίσετε τις λεπτομέρειες.",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-20">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Πώς Λειτουργεί
        </h2>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          "Τρία απλά βήματα για να βρεις τον τέλειο φροντιστή"
        </p>
      </div>

      <div className="mt-16 grid gap-8 md:grid-cols-3">
        {steps.map((step) => (
          <div
            key={step.number}
            className="relative rounded-lg border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-800"
          >
            <div className="absolute -top-4 left-8 flex size-8 items-center justify-center rounded-full bg-zinc-900 text-sm font-bold text-white dark:bg-zinc-50 dark:text-zinc-900">
              {step.number}
            </div>

            <h3 className="mt-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              {step.title}
            </h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
