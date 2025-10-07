"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CategorySelector from "@/components/CategorySelector";
import type { PlaceCategory } from "@/lib/categories";

export default function CategoryFilter({ selectedCategory }: { selectedCategory?: string | null }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const handleCategoryChange = (category: PlaceCategory | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }

    // Reset to first page when changing category
    params.delete("page");

    router.push(`?${params.toString()}`, { scroll: false });
    setIsOpen(false);
  };

  const getSelectedCategoryName = () => {
    if (!selectedCategory) return "All Categories";
    // This is a simplified version - in a real app you'd look up the category name
    return selectedCategory.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="relative">
      {/* Mobile dropdown trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-medium">{getSelectedCategoryName()}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Mobile dropdown */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10 max-h-64 overflow-y-auto">
          <CategorySelector
            selectedCategory={selectedCategory as PlaceCategory | null}
            onCategoryChange={handleCategoryChange}
            showAll={true}
            groupBy={false}
          />
        </div>
      )}

      {/* Desktop inline selector */}
      <div className="hidden md:block">
        <CategorySelector
          selectedCategory={selectedCategory as PlaceCategory | null}
          onCategoryChange={handleCategoryChange}
          showAll={true}
          groupBy={false}
        />
      </div>
    </div>
  );
}