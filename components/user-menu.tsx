"use client";

import { Avatar } from "./avatar";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { signOut } from "@/app/auth/actions";

interface UserMenuProps {
  avatarUrl?: string | null;
  fullName?: string | null;
  email?: string | null;
}

export function UserMenu({ avatarUrl, fullName, email }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-md p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800"
      >
        <Avatar src={avatarUrl} alt={fullName || email || "User"} size="sm" />
        <span className="text-sm text-zinc-600 dark:text-zinc-400">
          {fullName || email}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
          <div className="p-2">
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="block rounded-md px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              Ρυθμίσεις Προφίλ
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="block rounded-md px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              Dashboard
            </Link>
            <hr className="my-2 border-zinc-200 dark:border-zinc-700" />
            <form action={signOut}>
              <button
                type="submit"
                className="w-full rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                Αποσύνδεση
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
