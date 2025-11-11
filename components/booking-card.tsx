"use client";

import Link from "next/link";
import { UnreadBadge } from "./unread-badge";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface BookingCardProps {
  booking: {
    id: string;
    start_date: string;
    end_date: string;
    status: string;
    pet?: { name: string } | null;
    caregiver?: { profile: { full_name: string | null } } | null;
  };
  currentUserId: string;
}

export function BookingCard({ booking, currentUserId }: BookingCardProps) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      const supabase = createClient();

      const { count } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("booking_id", booking.id)
        .eq("read", false)
        .neq("sender_id", currentUserId);

      setUnreadCount(count || 0);
    };

    fetchUnreadCount();

    // Set up realtime subscription for unread count updates
    const supabase = createClient();
    const channel = supabase
      .channel(`booking-messages:${booking.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `booking_id=eq.${booking.id}`,
        },
        () => {
          fetchUnreadCount();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [booking.id, currentUserId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "accepted":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "declined":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "cancelled":
        return "bg-zinc-100 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200";
      default:
        return "bg-zinc-100 text-zinc-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Εκκρεμεί";
      case "accepted":
        return "Εγκρίθηκε";
      case "declined":
        return "Απορρίφθηκε";
      case "completed":
        return "Ολοκληρώθηκε";
      case "cancelled":
        return "Ακυρώθηκε";
      default:
        return status;
    }
  };

  return (
    <div className="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm hover:shadow-md transition-shadow dark:bg-zinc-800">
      <Link href={`/bookings/${booking.id}`} className="flex-1">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-medium text-zinc-900 dark:text-zinc-50">
                {booking.pet?.name || `Κράτηση #${booking.id.slice(0, 8)}`}
              </p>
              {unreadCount > 0 && <UnreadBadge count={unreadCount} />}
            </div>
            {booking.caregiver?.profile?.full_name && (
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-0.5">
                Φροντιστής: {booking.caregiver.profile.full_name}
              </p>
            )}
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              {new Date(booking.start_date).toLocaleDateString("el-GR")} -{" "}
              {new Date(booking.end_date).toLocaleDateString("el-GR")}
            </p>
          </div>
          <span
            className={`ml-4 rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap ${getStatusColor(booking.status)}`}
          >
            {getStatusLabel(booking.status)}
          </span>
        </div>
      </Link>

      {/* Message button */}
      <Link
        href={`/messages/${booking.id}`}
        className="ml-4 flex items-center gap-1 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium text-sm"
        onClick={(e) => e.stopPropagation()}
      >
        💬
      </Link>
    </div>
  );
}
