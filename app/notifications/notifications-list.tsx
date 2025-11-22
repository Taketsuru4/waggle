"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, Check, CheckCheck, Trash2, Filter } from "lucide-react";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllRead,
  type Notification,
} from "@/lib/data/notifications";
import { createClient } from "@/lib/supabase/client";

function formatTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "τώρα";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} λεπτά πριν`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} ώρες πριν`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} ημέρες πριν`;
  return date.toLocaleDateString("el-GR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getNotificationIcon(type: string): string {
  switch (type) {
    case "booking_request":
      return "📅";
    case "booking_accepted":
      return "✅";
    case "booking_declined":
      return "❌";
    case "booking_completed":
      return "🎉";
    case "booking_cancelled":
      return "🚫";
    case "new_message":
      return "💬";
    case "new_review":
      return "⭐";
    case "system":
      return "ℹ️";
    default:
      return "🔔";
  }
}

export function NotificationsList() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    setLoading(true);
    const notifs = await getNotifications(100);
    setNotifications(notifs);
    setLoading(false);
  };

  useEffect(() => {
    loadNotifications();

    // Set up real-time subscription
    const supabase = createClient();
    const channel = supabase
      .channel("notifications-page")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
        },
        () => {
          loadNotifications();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleDelete = async (id: string) => {
    await deleteNotification(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleDeleteAllRead = async () => {
    if (
      confirm(
        "Είσαι σίγουρος ότι θέλεις να διαγράψεις όλες τις διαβασμένες ειδοποιήσεις;",
      )
    ) {
      await deleteAllRead();
      setNotifications((prev) => prev.filter((n) => !n.read));
    }
  };

  const filteredNotifications =
    filter === "unread"
      ? notifications.filter((n) => !n.read)
      : notifications;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Actions Bar */}
      <div className="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm dark:bg-zinc-800">
        <div className="flex items-center gap-4">
          <div className="flex rounded-lg bg-zinc-100 p-1 dark:bg-zinc-700">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                filter === "all"
                  ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-600 dark:text-zinc-50"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              }`}
            >
              Όλες ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("unread")}
              className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                filter === "unread"
                  ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-600 dark:text-zinc-50"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              }`}
            >
              Μη αναγνωσμένες ({unreadCount})
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllAsRead}
              className="inline-flex items-center gap-2 rounded-md bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
            >
              <CheckCheck className="h-4 w-4" />
              Μάρκαρε όλες ως αναγνωσμένες
            </button>
          )}
          {notifications.some((n) => n.read) && (
            <button
              type="button"
              onClick={handleDeleteAllRead}
              className="inline-flex items-center gap-2 rounded-md bg-red-100 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800"
            >
              <Trash2 className="h-4 w-4" />
              Διαγραφή διαβασμένων
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="rounded-lg bg-white p-12 text-center shadow-sm dark:bg-zinc-800">
          <p className="text-zinc-600 dark:text-zinc-400">Φόρτωση...</p>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="rounded-lg bg-white p-12 text-center shadow-sm dark:bg-zinc-800">
          <Bell className="mx-auto h-16 w-16 text-zinc-300 dark:text-zinc-600" />
          <p className="mt-4 text-lg font-medium text-zinc-900 dark:text-zinc-50">
            {filter === "unread"
              ? "Δεν έχεις μη αναγνωσμένες ειδοποιήσεις"
              : "Δεν έχεις ειδοποιήσεις"}
          </p>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Θα ειδοποιηθείς εδώ για σημαντικές ενέργειες
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`rounded-lg bg-white p-6 shadow-sm transition-colors dark:bg-zinc-800 ${
                !notification.read
                  ? "border-l-4 border-blue-500 bg-blue-50/50 dark:bg-blue-900/10"
                  : ""
              }`}
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl">
                  {getNotificationIcon(notification.type)}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                        {notification.title}
                      </h3>
                      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                        {notification.message}
                      </p>
                      <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-500">
                        {formatTimeAgo(notification.created_at)}
                      </p>
                      {notification.link && (
                        <Link
                          href={notification.link}
                          onClick={() => {
                            if (!notification.read) {
                              handleMarkAsRead(notification.id);
                            }
                          }}
                          className="mt-3 inline-block text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Προβολή →
                        </Link>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {!notification.read && (
                        <button
                          type="button"
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="rounded-md p-2 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-700"
                          title="Μάρκαρε ως διαβασμένο"
                        >
                          <Check className="h-5 w-5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDelete(notification.id)}
                        className="rounded-md p-2 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-700"
                        title="Διαγραφή"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
