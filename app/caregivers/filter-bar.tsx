"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

export function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [petType, setPetType] = useState(searchParams.get("petType") || "");
  const [minRate, setMinRate] = useState(searchParams.get("minRate") || "");
  const [maxRate, setMaxRate] = useState(searchParams.get("maxRate") || "");

  const handleFilter = () => {
    const params = new URLSearchParams();

    if (search) params.set("search", search);
    if (city) params.set("city", city);
    if (petType) params.set("petType", petType);
    if (minRate) params.set("minRate", minRate);
    if (maxRate) params.set("maxRate", maxRate);

    startTransition(() => {
      router.push(
        `/caregivers${params.toString() ? `?${params.toString()}` : ""}`,
      );
    });
  };

  const handleClear = () => {
    setSearch("");
    setCity("");
    setPetType("");
    setMinRate("");
    setMaxRate("");

    startTransition(() => {
      router.push("/caregivers");
    });
  };

  const hasFilters = search || city || petType || minRate || maxRate;

  return (
    <div className="space-y-4 rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-800">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Φίλτρα Αναζήτησης
        </h2>
        {hasFilters && (
          <button
            type="button"
            onClick={handleClear}
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            Καθαρισμός
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Search */}
        <div>
          <label
            htmlFor="search"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Αναζήτηση
          </label>
          <input
            id="search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleFilter()}
            placeholder="Πόλη ή περιγραφή..."
            className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-50 dark:placeholder-zinc-500"
          />
        </div>

        {/* Pet Type */}
        <div>
          <label
            htmlFor="petType"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Τύπος Κατοικιδίου
          </label>
          <select
            id="petType"
            value={petType}
            onChange={(e) => setPetType(e.target.value)}
            className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-50"
          >
            <option value="">Όλοι οι τύποι</option>
            <option value="dog">Σκύλος</option>
            <option value="cat">Γάτα</option>
            <option value="bird">Πουλί</option>
            <option value="rabbit">Κουνέλι</option>
            <option value="other">Άλλο</option>
          </select>
        </div>

        {/* City */}
        <div>
          <label
            htmlFor="city"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Πόλη
          </label>
          <input
            id="city"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleFilter()}
            placeholder="π.χ. Αθήνα"
            className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-50 dark:placeholder-zinc-500"
          />
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Τιμή ανά ώρα (€)
          </label>
          <div className="mt-1 grid grid-cols-2 gap-2">
            <input
              type="number"
              value={minRate}
              onChange={(e) => setMinRate(e.target.value)}
              placeholder="Από"
              min="0"
              step="1"
              className="block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-50 dark:placeholder-zinc-500"
            />
            <input
              type="number"
              value={maxRate}
              onChange={(e) => setMaxRate(e.target.value)}
              placeholder="Έως"
              min="0"
              step="1"
              className="block w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-50 dark:placeholder-zinc-500"
            />
          </div>
        </div>

        {/* Apply Button */}
        <button
          type="button"
          onClick={handleFilter}
          disabled={isPending}
          className="w-full rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {isPending ? "Αναζήτηση..." : "Εφαρμογή Φίλτρων"}
        </button>
      </div>
    </div>
  );
}
