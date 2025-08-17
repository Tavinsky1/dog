"use client";

import { useState } from "react";
import Link from "next/link";

const locations = [
  { name: "Berlin", href: "/berlin", flag: "🇩🇪" },
  // Future locations can be added here
  // { name: "Munich", href: "/munich", flag: "🇩🇪" },
  // { name: "Paris", href: "/paris", flag: "🇫🇷" },
  // { name: "London", href: "/london", flag: "🇬🇧" },
];

export default function LocationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 hover:text-orange-600 transition-colors text-sm"
        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
      >
        <span>Locations</span>
        <span className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-amber-200 rounded-lg shadow-lg py-2 min-w-[160px] z-50">
          {locations.map((location) => (
            <Link
              key={location.name}
              href={location.href}
              className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-orange-50 hover:text-orange-600 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <span className="text-lg">{location.flag}</span>
              <span>{location.name}</span>
            </Link>
          ))}
          <div className="border-t border-gray-100 mt-2 pt-2">
            <div className="px-4 py-2 text-xs text-gray-500">
              More cities coming soon...
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
