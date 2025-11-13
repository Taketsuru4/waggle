"use client";

import { useState } from "react";

const faqs = [
  {
    question: "Τι είναι το Waggle;",
    answer:
      "Το Waggle είναι μια πλατφόρμα που συνδέει ιδιοκτήτες κατοικιδίων με επαγγελματίες φροντιστές. Μπορείς να βρεις τον ιδανικό φροντιστή για το κατοικίδιό σου με βάση την τοποθεσία, την εμπειρία και τη διαθεσιμότητά του.",
  },
  {
    question: "Πώς λειτουργεί η πλατφόρμα;",
    answer:
      "Δημιουργείς λογαριασμό, αναζητάς φροντιστές στην περιοχή σου, βλέπεις τα προφίλ τους και επικοινωνείς απευθείας μαζί τους για να κανονίσετε τις λεπτομέρειες. Είναι απλό, γρήγορο και ασφαλές!",
  },
  {
    question: "Χρειάζεται να πληρώσω για να χρησιμοποιήσω το Waggle;",
    answer:
      "Όχι! Η εγγραφή και η αναζήτηση φροντιστών είναι εντελώς δωρεάν. Η πληρωμή γίνεται απευθείας με τον φροντιστή που θα επιλέξεις.",
  },
  {
    question: "Πώς μπορώ να γίνω επαγγελματίας φροντιστής;",
    answer:
      "Κάνε εγγραφή, συμπλήρωσε το προφίλ σου με τα στοιχεία σου, την εμπειρία σου και τις υπηρεσίες που προσφέρεις. Μετά το προφίλ σου θα είναι ορατό σε όλους τους ιδιοκτήτες κατοικιδίων!",
  },
  {
    question: "Είναι ασφαλής η πλατφόρμα;",
    answer:
      "Ναι! Χρησιμοποιούμε σύγχρονες τεχνολογίες ασφαλείας για την προστασία των δεδομένων σου. Επίσης, ενθαρρύνουμε όλους τους χρήστες να επικοινωνούν και να γνωρίζονται πριν την κράτηση.",
  },
  {
    question: "Μπορώ να ακυρώσω μια κράτηση;",
    answer:
      "Οι όροι ακύρωσης καθορίζονται απευθείας μεταξύ σου και του φροντιστή. Συνιστούμε να συμφωνήσετε τις λεπτομέρειες πριν την οριστικοποίηση της κράτησης.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="mx-auto max-w-3xl px-4 py-20">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Συχνές Ερωτήσεις
        </h2>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          Βρες απαντήσεις στις πιο συχνές ερωτήσεις
        </p>
      </div>

      <div className="mt-12 space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-800"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="flex w-full items-center justify-between p-6 text-left"
            >
              <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                {faq.question}
              </span>
              <span className="ml-6 flex-shrink-0 text-zinc-500 dark:text-zinc-400">
                {openIndex === index ? "−" : "+"}
              </span>
            </button>
            {openIndex === index && (
              <div className="px-6 pb-6">
                <p className="text-zinc-600 dark:text-zinc-400">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
