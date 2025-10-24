'use client';

import { useState } from 'react';
import Link from 'next/link';

interface YelpBusiness {
  id: string;
  name: string;
  image_url: string;
  rating: number;
  review_count: number;
  location: {
    address1: string;
    city: string;
    state: string;
    country: string;
  };
  categories: Array<{ title: string }>;
  phone: string;
}

export default function YelpImportPage() {
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('');
  const [results, setResults] = useState<YelpBusiness[]>([]);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const handleSearch = async () => {
    if (!city) {
      setMessage('Please enter a city name');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const params = new URLSearchParams({ city });
      if (category) params.append('category', category);

      const response = await fetch(`/api/admin/yelp?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Search failed');
      }

      setResults(data.businesses);
      setMessage(data.message);
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (businessId: string, citySlug: string) => {
    setImporting(businessId);
    setMessage('');

    try {
      // First, get the city ID from slug
      const cityResponse = await fetch(`/api/cities`);
      const cities = await cityResponse.json();
      const cityData = cities.find((c: any) => 
        c.name.toLowerCase().includes(citySlug.toLowerCase())
      );

      if (!cityData) {
        throw new Error('City not found in database. Please create the city first.');
      }

      const response = await fetch('/api/admin/yelp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId,
          cityId: cityData.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Import failed');
      }

      setMessage(`✅ ${data.message}`);
      // Remove imported business from results
      setResults(results.filter(b => b.id !== businessId));
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setImporting(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Import from Yelp</h1>
          <p className="text-slate-600 mt-1">
            Search and import dog-friendly places from Yelp (500 free searches/day)
          </p>
        </div>
        <Link
          href="/admin"
          className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
        >
          ← Back to Admin
        </Link>
      </div>

      {/* Search Form */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              City Name
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g., Paris, France"
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Category (Optional)
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              <option value="parks">Parks</option>
              <option value="cafes_restaurants">Cafés & Restaurants</option>
              <option value="accommodation">Hotels & Accommodation</option>
              <option value="shops_services">Pet Shops & Services</option>
              <option value="walks_trails">Walks & Trails</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700 disabled:bg-slate-300"
            >
              {loading ? 'Searching...' : 'Search Yelp'}
            </button>
          </div>
        </div>

        {message && (
          <div className={`mt-4 rounded-lg p-4 ${
            message.startsWith('✅') 
              ? 'bg-green-50 text-green-800' 
              : message.startsWith('❌')
              ? 'bg-red-50 text-red-800'
              : 'bg-blue-50 text-blue-800'
          }`}>
            {message}
          </div>
        )}
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">
            Found {results.length} dog-friendly places
          </h2>

          <div className="grid gap-4">
            {results.map((business) => (
              <div
                key={business.id}
                className="flex gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
              >
                {/* Image */}
                {business.image_url && (
                  <img
                    src={business.image_url}
                    alt={business.name}
                    className="h-24 w-24 rounded-lg object-cover"
                  />
                )}

                {/* Details */}
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900">
                    {business.name}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {business.location.address1}, {business.location.city}
                  </p>
                  <div className="mt-1 flex items-center gap-2 text-sm">
                    <span className="text-yellow-600">
                      ⭐ {business.rating}
                    </span>
                    <span className="text-slate-500">
                      ({business.review_count} reviews)
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {business.categories.map((cat, idx) => (
                      <span
                        key={idx}
                        className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800"
                      >
                        {cat.title}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Import Button */}
                <div className="flex items-center">
                  <button
                    onClick={() => handleImport(business.id, city.split(',')[0])}
                    disabled={importing === business.id}
                    className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:bg-slate-300"
                  >
                    {importing === business.id ? 'Importing...' : 'Import'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {!loading && results.length === 0 && message && !message.startsWith('Error') && (
        <div className="rounded-lg border border-slate-200 bg-white p-12 text-center">
          <p className="text-slate-600">
            No results found. Try a different city or category.
          </p>
        </div>
      )}
    </div>
  );
}
