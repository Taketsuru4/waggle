export function StatsSection() {
  const stats = [
    { label: "Επαγγελματίες", value: "500+" },
    { label: "Κατοικίδια", value: "1000+" },
    { label: "Μέση Αξιολόγηση", value: "4.8/5" },
  ];

  return (
    <section className="mx-auto max-w-5xl px-4">
      <div className="grid gap-6 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-800 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
              {s.value}
            </div>
            <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
