import { Suspense } from 'react';
import Link from 'next/link';
import { searchPlaces, type SearchResult } from '@/lib/searchIndex';
import { placeUrl, cityUrl, countryUrl } from '@/lib/routing';
import { CATEGORY_LABELS } from '@/lib/routing';

interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = typeof params.q === 'string' ? params.q : '';
  
  return {
    title: query ? `Search Results for "${query}" | DogAtlas` : 'Search | DogAtlas',
    description: `Find dog-friendly places${query ? ` matching "${query}"` : ''} across cities worldwide`,
  };
}

async function SearchResults({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = typeof params.q === 'string' ? params.q : '';
  const category = typeof params.category === 'string' ? params.category : undefined;
  const country = typeof params.country === 'string' ? params.country : undefined;
  const city = typeof params.city === 'string' ? params.city : undefined;
  const verified = params.verified === 'true';

  if (!query) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-slate-600">Enter a search query to find places</p>
      </div>
    );
  }

  const results = await searchPlaces({
    query,
    category,
    country,
    city,
    verified,
    limit: 50,
  });

  return (
    <div>
      {/* Search Summary */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Search Results for <span className="text-orange-500">"{query}"</span>
        </h1>
        <p className="mt-2 text-slate-600">
          {results.length === 0 ? 'No results found' : `${results.length} ${results.length === 1 ? 'place' : 'places'} found`}
        </p>
      </div>

      {/* Filter Pills */}
      {(category || country || city || verified) && (
        <div className="mb-6 flex flex-wrap gap-2">
          {category && (
            <Link
              href={`/search?q=${query}`}
              className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-medium text-orange-700 hover:bg-orange-200"
            >
              <span>{CATEGORY_LABELS[category] || category}</span>
              <span>×</span>
            </Link>
          )}
          {country && (
            <Link
              href={`/search?q=${query}${category ? `&category=${category}` : ''}`}
              className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200"
            >
              <span>Country: {country}</span>
              <span>×</span>
            </Link>
          )}
          {city && (
            <Link
              href={`/search?q=${query}${category ? `&category=${category}` : ''}${country ? `&country=${country}` : ''}`}
              className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-200"
            >
              <span>City: {city}</span>
              <span>×</span>
            </Link>
          )}
          {verified && (
            <Link
              href={`/search?q=${query}${category ? `&category=${category}` : ''}${country ? `&country=${country}` : ''}${city ? `&city=${city}` : ''}`}
              className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-200"
            >
              <span>✓ Verified Only</span>
              <span>×</span>
            </Link>
          )}
        </div>
      )}

      {/* Results Grid */}
      {results.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((result: SearchResult) => (
            <PlaceCard key={result.id} place={result} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-12 text-center">
          <p className="text-lg font-medium text-slate-900">No places found</p>
          <p className="mt-2 text-slate-600">Try a different search term or remove filters</p>
        </div>
      )}
    </div>
  );
}

function PlaceCard({ place }: { place: SearchResult }) {
  const defaultImage = 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80';
  const photo = place.photos[0] || defaultImage;

  return (
    <Link
      href={placeUrl(place.country, place.city, place.id)}
      className="group overflow-hidden rounded-2xl border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={photo}
          alt={place.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        {/* Verified Badge */}
        {place.verified && (
          <div className="absolute top-3 right-3 rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white shadow-lg">
            ✓ Verified
          </div>
        )}

        {/* Match Score (for debugging) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="absolute top-3 left-3 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white">
            {Math.round(place.score * 100)}% match
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-slate-900 group-hover:text-orange-500 transition-colors">
          {place.name}
        </h3>
        
        {/* Location */}
        <p className="mt-2 text-sm text-slate-500">
          {place.cityName}, {place.countryName}
        </p>

        {/* Category */}
        <div className="mt-3">
          <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            {CATEGORY_LABELS[place.category] || place.category}
          </span>
        </div>

        {/* Description */}
        {place.description && (
          <p className="mt-3 text-sm text-slate-600 line-clamp-2">
            {place.description}
          </p>
        )}

        {/* Matched Fields (for debugging) */}
        {process.env.NODE_ENV === 'development' && place.matchedFields.length > 0 && (
          <p className="mt-2 text-xs text-slate-400">
            Matched: {place.matchedFields.join(', ')}
          </p>
        )}
      </div>
    </Link>
  );
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <Suspense fallback={<div className="text-center py-16">Searching...</div>}>
          <SearchResults searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
