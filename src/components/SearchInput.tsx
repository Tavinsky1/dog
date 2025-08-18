"use client";
import { useEffect, useState } from "react";
import { trackSearch } from "@/lib/analytics";

export default function SearchInput({
  placeholder = "Search…",
  initial = ""
}: { placeholder?: string; initial?: string }) {
  const [q, setQ] = useState(initial);

  // push q to URL after short debounce
  useEffect(() => {
    const t = setTimeout(() => {
      const url = new URL(window.location.href);
      if (q) url.searchParams.set("q", q);
      else url.searchParams.delete("q");
      url.searchParams.delete("page"); // reset pagination on new query
      window.history.replaceState(null, "", url.toString());
      
      // Track search analytics
      if (q.trim().length > 0) {
        // Note: We can't easily get results count here since this is client-side
        // The actual results counting would happen server-side
        trackSearch(q.trim(), 0); // Pass 0 as placeholder
      }
      
      // Trigger a refresh for server component
      // @ts-ignore
      if (window?.next?.router?.refresh) window.next.router.refresh();
    }, 300);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <div className="relative w-full md:w-80">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        className="w-full pl-10 pr-4 py-3 border border-amber-200 rounded-xl text-sm bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        aria-label="Search places"
      />
    </div>
  );
}
