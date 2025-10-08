"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface City {
  id: string;
  slug: string;
  name: string;
  country: string;
}

export default function CitySelector() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetch('/api/cities')
      .then(res => res.json())
      .then(data => {
        setCities(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching cities:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded-full w-48"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-8 py-4 rounded-full border-2 border-white/40 bg-white/10 text-base font-bold text-white backdrop-blur-sm hover:bg-white/20 hover:border-white/60 transition-all shadow-lg"
        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
      >
        <span>Choose a City</span>
        <span className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-3 bg-white border border-gray-200 rounded-2xl shadow-2xl py-2 min-w-[240px] z-50 max-h-96 overflow-y-auto">
          {cities.map((city) => (
            <Link
              key={city.id}
              href={`/${city.slug}`}
              className="flex items-center justify-between px-5 py-3 text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors border-b border-gray-100 last:border-0"
              onClick={() => setIsOpen(false)}
            >
              <span className="font-semibold text-slate-900">{city.name}</span>
              <span className="text-xs text-gray-500 font-medium">{city.country}</span>
            </Link>
          ))}
          {cities.length === 0 && (
            <div className="px-5 py-3 text-sm text-gray-500">
              No cities available
            </div>
          )}
        </div>
      )}
    </div>
  );
}