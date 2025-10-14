'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// Simple SVG icons
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

const XMarkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Fetch suggestions
  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(searchQuery)}&suggestions=true&limit=5`
      );
      const data = await response.json();
      setSuggestions(data.suggestions || []);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced suggestions
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        fetchSuggestions(query);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, fetchSuggestions]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSelectSuggestion(suggestions[selectedIndex]);
        } else if (query.trim()) {
          handleSearch();
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  // Handle search submission
  const handleSearch = () => {
    if (query.trim()) {
      setIsOpen(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  // Handle suggestion selection
  const handleSelectSuggestion = (suggestion: string) => {
    setQuery(suggestion);
    setIsOpen(false);
    router.push(`/search?q=${encodeURIComponent(suggestion)}`);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyboardShortcut = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyboardShortcut);
    return () => document.removeEventListener('keydown', handleKeyboardShortcut);
  }, []);

  return (
    <div className="relative w-full max-w-lg">
      {/* Search Input */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
          <SearchIcon />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder="Search places, cities, countries..."
          className="block w-full rounded-full border border-slate-300 bg-white py-3 pl-12 pr-12 text-sm placeholder-slate-400 shadow-sm transition-all focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
          aria-label="Search"
          aria-autocomplete="list"
          aria-controls="search-suggestions"
          aria-expanded={isOpen && suggestions.length > 0}
        />

        {/* Clear button */}
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setSuggestions([]);
              inputRef.current?.focus();
            }}
            className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600"
            aria-label="Clear search"
          >
            <XMarkIcon />
          </button>
        )}

        {/* Keyboard shortcut hint */}
        {!query && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
            <kbd className="hidden rounded border border-slate-300 bg-slate-50 px-2 py-1 text-xs text-slate-500 sm:inline-block">
              ⌘K
            </kbd>
          </div>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && (query.length >= 2 || suggestions.length > 0) && (
        <div
          ref={dropdownRef}
          id="search-suggestions"
          className="absolute z-50 mt-2 w-full rounded-2xl border border-slate-200 bg-white shadow-2xl"
          role="listbox"
        >
          {isLoading ? (
            <div className="p-4 text-center text-sm text-slate-500">
              Searching...
            </div>
          ) : suggestions.length > 0 ? (
            <ul className="max-h-80 overflow-y-auto py-2">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  role="option"
                  aria-selected={index === selectedIndex}
                >
                  <button
                    type="button"
                    onClick={() => handleSelectSuggestion(suggestion)}
                    className={`w-full px-4 py-3 text-left text-sm transition-colors ${
                      index === selectedIndex
                        ? 'bg-orange-50 text-orange-900'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-slate-400">
                        <SearchIcon />
                      </div>
                      <span className="font-medium">{suggestion}</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : query.length >= 2 ? (
            <div className="p-4 text-center text-sm text-slate-500">
              No suggestions found
            </div>
          ) : null}

          {/* Search all button */}
          {query.trim() && (
            <div className="border-t border-slate-200 p-2">
              <button
                type="button"
                onClick={handleSearch}
                className="w-full rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
              >
                Search for "{query}"
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
