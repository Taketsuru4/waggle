"use client";

import { Phone, MessageCircle, Send } from "lucide-react";

interface ContactButtonsProps {
  contactPhone?: string | null;
  whatsapp?: string | null;
  viber?: string | null;
}

export function ContactButtons({
  contactPhone,
  whatsapp,
  viber,
}: ContactButtonsProps) {
  const handleViberClick = (number: string) => {
    const cleanNumber = number.replace(/[^0-9]/g, "");
    // Try to open Viber app first
    window.location.href = `viber://chat?number=%2B${cleanNumber}`;

    // Fallback to web version after a short delay if app doesn't open
    setTimeout(() => {
      window.open(`https://msng.link/vi/${cleanNumber}`, "_blank");
    }, 1000);
  };

  if (!contactPhone && !whatsapp && !viber) {
    return null;
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-800">
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
        Επικοινωνία
      </h3>
      <div className="space-y-3">
        {contactPhone && (
          <a
            href={`tel:${contactPhone}`}
            className="flex items-center gap-3 rounded-lg bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-100 dark:bg-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-600 transition-colors"
          >
            <Phone className="h-5 w-5" />
            <div>
              <div className="font-semibold">Τηλέφωνο</div>
              <div className="text-xs text-zinc-600 dark:text-zinc-400">
                {contactPhone}
              </div>
            </div>
          </a>
        )}
        {whatsapp && (
          <a
            href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-900 hover:bg-green-100 dark:bg-green-900 dark:text-green-50 dark:hover:bg-green-800 transition-colors"
          >
            <MessageCircle className="h-5 w-5" />
            <div>
              <div className="font-semibold">WhatsApp</div>
              <div className="text-xs text-green-700 dark:text-green-300">
                Στείλε μήνυμα
              </div>
            </div>
          </a>
        )}
        {viber && (
          <button
            onClick={() => handleViberClick(viber)}
            type="button"
            className="w-full flex items-center gap-3 rounded-lg bg-purple-50 px-4 py-3 text-sm font-medium text-purple-900 hover:bg-purple-100 dark:bg-purple-900 dark:text-purple-50 dark:hover:bg-purple-800 transition-colors cursor-pointer"
          >
            <Send className="h-5 w-5" />
            <div>
              <div className="font-semibold">Viber</div>
              <div className="text-xs text-purple-700 dark:text-purple-300">
                Στείλε μήνυμα
              </div>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
