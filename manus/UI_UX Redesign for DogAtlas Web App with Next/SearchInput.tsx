"use client";
import { useEffect, useState } from "react";

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
      // Trigger a refresh for server component
      // @ts-ignore
      if (window?.next?.router?.refresh) window.next.router.refresh();
    }, 300);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <input
      className="w-full md:w-80 border rounded-md px-3 py-2 text-sm"
      value={q}
      onChange={(e) => setQ(e.target.value)}
      placeholder={placeholder}
      aria-label="Search places"
    />
  );
}
