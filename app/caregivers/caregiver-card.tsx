"use client";

import Link from "next/link";
import { Avatar } from "@/components/avatar";
import { Dog, Cat, Bird, Rabbit, Squirrel, MapPin, Phone, MessageCircle, Calendar, BadgeCheck } from "lucide-react";

interface CaregiverCardProps {
  caregiver: any;
  hasAvailability?: boolean;
}

export function CaregiverCard({
  caregiver,
  hasAvailability = false,
}: CaregiverCardProps) {
  const handleViberClick = (e: React.MouseEvent, number: string) => {
    e.preventDefault();
    const cleanNumber = number.replace(/[^0-9]/g, "");
    // Try to open Viber app first
    window.location.href = `viber://chat?number=%2B${cleanNumber}`;

    // Fallback to web version after a short delay if app doesn't open
    setTimeout(() => {
      window.open(`https://msng.link/vi/${cleanNumber}`, "_blank");
    }, 1000);
  };

  return (
    <div className="group rounded-lg bg-white p-4 sm:p-6 shadow-sm transition-all hover:shadow-lg dark:bg-zinc-800">
      <Link href={`/caregivers/${caregiver.id}`} className="block">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          {/* Mobile: Avatar at top, Desktop: Same layout */}
          <div className="flex w-full sm:w-auto items-start justify-between sm:justify-start gap-4 sm:flex-col sm:items-end">
            <div className="flex-1 sm:hidden">
              <h3 className="text-lg font-semibold text-zinc-900 group-hover:text-zinc-700 dark:text-zinc-50 dark:group-hover:text-zinc-300">
                {caregiver.profiles?.full_name || "Φροντιστής"}
              </h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 flex items-center gap-1">
                <MapPin className="h-4 w-4 flex-shrink-0" /> {caregiver.city}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Avatar
                src={caregiver.profiles?.avatar_url}
                alt={caregiver.profiles?.full_name || "Φροντιστής"}
                size="lg"
              />
              {caregiver.verified && (
                <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200 inline-flex items-center gap-1 whitespace-nowrap">
                  <BadgeCheck className="h-3 w-3" /> Επιβεβαιωμένος
                </span>
              )}
            </div>
          </div>
          
          <div className="flex-1 w-full">
            {/* Desktop: Show title/location here */}
            <div className="hidden sm:block mb-2">
              <h3 className="text-lg font-semibold text-zinc-900 group-hover:text-zinc-700 dark:text-zinc-50 dark:group-hover:text-zinc-300">
                {caregiver.profiles?.full_name || "Φροντιστής"}
              </h3>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 flex items-center gap-1">
                <MapPin className="h-4 w-4" /> {caregiver.city}
              </p>
            </div>

            {caregiver.bio && (
              <p className="mt-3 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
                {caregiver.bio}
              </p>
            )}

            {/* Services */}
            <div className="mt-3 sm:mt-4 flex flex-wrap gap-1.5 sm:gap-2">
              {caregiver.accepts_dogs && (
                <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300 flex items-center gap-1">
                  <Dog className="h-3 w-3" /> Φύλαξη σκύλου
                </span>
              )}
              {caregiver.accepts_cats && (
                <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300 flex items-center gap-1">
                  <Cat className="h-3 w-3" /> Φύλαξη Γάτας
                </span>
              )}
              {caregiver.accepts_birds && (
                <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300 flex items-center gap-1">
                  <Bird className="h-3 w-3" /> Πουλιά
                </span>
              )}
              {caregiver.accepts_rabbits && (
                <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300 flex items-center gap-1">
                  <Rabbit className="h-3 w-3" /> Κουνέλια
                </span>
              )}
              {caregiver.accepts_other && (
                <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300 flex items-center gap-1">
                  <Squirrel className="h-3 w-3" /> Άλλα
                </span>
              )}
            </div>

            {/* Footer */}
            <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3 border-t border-zinc-200 pt-3 sm:pt-4 dark:border-zinc-700">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-sm">
                <div className="space-y-1">
                  {caregiver.experience_years && (
                    <span className="block text-zinc-600 dark:text-zinc-400">
                      {caregiver.experience_years} έτη εμπειρίας
                    </span>
                  )}
                  {hasAvailability && (
                    <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                      <Calendar className="h-3 w-3" /> Διαθέσιμα slots
                    </span>
                  )}
                </div>
                {caregiver.hourly_rate && (
                  <div className="text-base sm:text-sm font-bold sm:font-semibold text-zinc-900 dark:text-zinc-50">
                    {caregiver.hourly_rate}€/ώρα
                  </div>
                )}
              </div>
            </div>
          </div>
      </Link>

      {/* Contact Info */}
      {(caregiver.contact_phone || caregiver.whatsapp || caregiver.viber) && (
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          {caregiver.contact_phone && (
            <a
              href={`tel:${caregiver.contact_phone}`}
              className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-1 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
            >
              {caregiver.contact_phone}
            </a>
          )}
          {caregiver.whatsapp && (
            <a
              href={`https://wa.me/${caregiver.whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800"
            >
              <MessageCircle className="h-3 w-3" /> WhatsApp
            </a>
          )}
          {caregiver.viber && (
            <button
              onClick={(e) => handleViberClick(e, caregiver.viber)}
              type="button"
              className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2 py-1 text-purple-700 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-300 dark:hover:bg-purple-800 cursor-pointer"
            >
             <img src="../assets/viber-icon.avif"height={12}width={12}></img> Viber
            </button>
          )}
        </div>
      )}
    </div>
  );
}
