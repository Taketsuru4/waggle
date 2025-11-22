"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Bell, Check, Trash2, X } from "lucide-react";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  deleteNotification,
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
  return date.toLocaleDateString("el-GR");
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

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadNotifications = async () => {
    setLoading(true);
    const [notifs, count] = await Promise.all([
      getNotifications(10),
      getUnreadCount(),
    ]);
    setNotifications(notifs);
    setUnreadCount(count);
    setLoading(false);
  };

  useEffect(() => {
    loadNotifications();

    // Set up real-time subscription
    const supabase = createClient();
    const channel = supabase
      .channel("notifications")
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const handleDelete = async (id: string) => {
    await deleteNotification(id);
    const notif = notifications.find((n) => n.id === id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (notif && !notif.read) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-full p-2 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-800 z-50">
          <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-700">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Ειδοποιήσεις
            </h3>
            <Link
              href="/notifications"
              className="text-xs text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              onClick={() => setIsOpen(false)}
            >
              Δες όλες
            </Link>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-sm text-zinc-600 dark:text-zinc-400">
                Φόρτωση...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="mx-auto h-12 w-12 text-zinc-300 dark:text-zinc-600" />
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  Δεν έχεις ειδοποιήσεις
                </p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-100 dark:divide-zinc-700">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-700/50 ${
                      !notification.read
                        ? "bg-blue-50/50 dark:bg-blue-900/10"
                        : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">
                        {getNotificationIcon(notification.type)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                              {notification.title}
                            </p>
                            <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
                              {formatTimeAgo(notification.created_at)}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            {!notification.read && (
                              <button
                                type="button"
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="rounded p-1 text-zinc-600 hover:bg-zinc-200 dark:text-zinc-400 dark:hover:bg-zinc-600"
                                title="Μάρκαρε ως διαβασμένο"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleDelete(notification.id)}
                              className="rounded p-1 text-zinc-600 hover:bg-zinc-200 dark:text-zinc-400 dark:hover:bg-zinc-600"
                              title="Διαγραφή"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        {notification.link && (
                          <Link
                            href={notification.link}
                            onClick={() => {
                              if (!notification.read) {
                                handleMarkAsRead(notification.id);
                              }
                              setIsOpen(false);
                            }}
                            className="mt-2 inline-block text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            Προβολή →
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
