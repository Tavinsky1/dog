"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type DogSizeAllowed = "all" | "small_only" | "small_medium" | "large_ok";

const DOG_SIZE_OPTIONS: { value: DogSizeAllowed | ""; label: string }[] = [
  { value: "", label: "Any size" },
  { value: "all", label: "All sizes welcome" },
  { value: "small_only", label: "Small dogs only" },
  { value: "small_medium", label: "Small-Medium dogs" },
  { value: "large_ok", label: "Large dogs OK" },
];

const TOGGLE_FILTERS = [
  { key: "waterBowl", label: "Water bowl", icon: "💧" },
  { key: "offLeash", label: "Off-leash OK", icon: "🐕" },
  { key: "outdoorSeating", label: "Outdoor seating", icon: "🌳" },
] as const;

interface PlaceFiltersProps {
  className?: string;
}

export default function PlaceFilters({ className = "" }: PlaceFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Initialize state from URL params
  const [dogSize, setDogSize] = useState<DogSizeAllowed | "">(
    (searchParams.get("dogSize") as DogSizeAllowed) || ""
  );
  const [activeToggles, setActiveToggles] = useState<Set<string>>(() => {
    const toggles = new Set<string>();
    TOGGLE_FILTERS.forEach(({ key }) => {
      if (searchParams.get(key) === "true") {
        toggles.add(key);
      }
    });
    return toggles;
  });

  const updateFilters = useCallback(
    (newDogSize: DogSizeAllowed | "", newToggles: Set<string>) => {
      const params = new URLSearchParams(searchParams.toString());
      
      // Update dog size
      if (newDogSize) {
        params.set("dogSize", newDogSize);
      } else {
        params.delete("dogSize");
      }
      
      // Update toggle filters
      TOGGLE_FILTERS.forEach(({ key }) => {
        if (newToggles.has(key)) {
          params.set(key, "true");
        } else {
          params.delete(key);
        }
      });
      
      // Navigate with new params
      const queryString = params.toString();
      router.push(queryString ? `?${queryString}` : "?", { scroll: false });
    },
    [router, searchParams]
  );

  const handleDogSizeChange = (value: DogSizeAllowed | "") => {
    setDogSize(value);
    updateFilters(value, activeToggles);
  };

  const handleToggleClick = (key: string) => {
    const newToggles = new Set(activeToggles);
    if (newToggles.has(key)) {
      newToggles.delete(key);
    } else {
      newToggles.add(key);
    }
    setActiveToggles(newToggles);
    updateFilters(dogSize, newToggles);
  };

  const clearFilters = () => {
    setDogSize("");
    setActiveToggles(new Set());
    router.push("?", { scroll: false });
  };

  const hasActiveFilters = dogSize !== "" || activeToggles.size > 0;

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-wrap items-center gap-3">
        {/* Dog Size Dropdown */}
        <select
          value={dogSize}
          onChange={(e) => handleDogSizeChange(e.target.value as DogSizeAllowed | "")}
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Filter by dog size"
        >
          {DOG_SIZE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Toggle Filter Chips */}
        {TOGGLE_FILTERS.map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => handleToggleClick(key)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
              activeToggles.has(key)
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
            }`}
            aria-pressed={activeToggles.has(key)}
          >
            <span>{icon}</span>
            <span>{label}</span>
          </button>
        ))}

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-slate-500 hover:text-slate-700 underline"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
