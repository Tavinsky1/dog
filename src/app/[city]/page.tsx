import Link from "next/link";
import { notFound } from "next/navigation";
import Map from "@/components/Map";
import ItineraryGenerator from "@/components/ItineraryGenerator";
import SearchInput from "@/components/SearchInput";
import CategoryFilter from "@/components/CategoryFilter";
import { prisma } from "@/lib/prisma";

const FALLBACK_IMAGES: Record<string, string> = {
  // Consolidated categories
  parks: "https://images.unsplash.com/photo-1544717684-7ad52a7bf8e1?auto=format&fit=crop&w=800&q=80",
  cafes_restaurants: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80",
  accommodation: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
  shops_services: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80",
  walks_trails: "https://images.unsplash.com/photo-1551632811-1e306?auto=format&fit=crop&w=800&q=80",
  tips_local_info: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80",
  default: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80",
};

type NormalizedPlace = {
  id: string;
  slug: string;
  name: string;
  type: string;
  lat: number | null;
  lng: number | null;
  shortDescription: string | null;
  dogFriendlyLevel: number | null;
  imageUrl: string;
  tags: string[];
  amenities: string[];
  openingHours: string | null;
};

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }
  return [];
}

function friendlyType(type: string) {
  return type
    .replace(/_/g, " ")
    .split(" ")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function getCategoryForType(type: string): string {
  const categoryMap: Record<string, string> = {
    parks: "Parks",
    cafes_restaurants: "Cafés & Restaurants",
    accommodation: "Accommodation",
    shops_services: "Shops & Services",
    walks_trails: "Walks & Trails",
    tips_local_info: "Tips & Local Info",
  };
  
  return categoryMap[type] || "Other";
}

function groupPlacesByCategory(places: NormalizedPlace[]): Record<string, NormalizedPlace[]> {
  const grouped: Record<string, NormalizedPlace[]> = {};
  
  places.forEach((place) => {
    const category = getCategoryForType(place.type);
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(place);
  });
  
  // Sort places within each category by dog-friendly level and name
  Object.keys(grouped).forEach((category) => {
    grouped[category].sort((a, b) => {
      if (a.dogFriendlyLevel !== b.dogFriendlyLevel) {
        return (b.dogFriendlyLevel || 0) - (a.dogFriendlyLevel || 0);
      }
      return a.name.localeCompare(b.name);
    });
  });
  
  return grouped;
}

export default async function CityPage({ params, searchParams }: { params: Promise<{ city: string }>, searchParams: Promise<{ q?: string, category?: string }> }) {
  const { city: citySlug } = await params;
  const { q: searchQuery, category: selectedCategory } = await searchParams;

  const city = await prisma.city.findUnique({
    where: { slug: citySlug, active: true },
    select: {
      id: true,
      name: true,
      country: true,
      lat: true,
      lng: true,
      places: {
        orderBy: [
          { dogFriendlyLevel: "desc" },
          { name: "asc" },
        ],
        select: {
          id: true,
          slug: true,
          name: true,
          type: true,
          lat: true,
          lng: true,
          shortDescription: true,
          dogFriendlyLevel: true,
          imageUrl: true,
          amenities: true,
          tags: true,
          openingHours: true,
        },
      },
    },
  });

  if (!city) {
    notFound();
  }

  const places: NormalizedPlace[] = city.places.map((place) => ({
    id: place.id,
    slug: place.slug,
    name: place.name,
    type: place.type,
    lat: place.lat,
    lng: place.lng,
    shortDescription: place.shortDescription,
    dogFriendlyLevel: place.dogFriendlyLevel,
    imageUrl: place.imageUrl || FALLBACK_IMAGES[place.type] || FALLBACK_IMAGES.default,
    tags: toStringArray(place.tags),
    amenities: toStringArray(place.amenities),
    openingHours: place.openingHours,
  }));

  // Filter places based on search query and category
  const filteredPlaces = places.filter((place) => {
    // Category filter - match against the actual database type value
    if (selectedCategory && place.type !== selectedCategory) {
      return false;
    }
    
    // Search filter
    if (searchQuery) {
      return (
        place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.shortDescription?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        place.amenities.some(amenity => amenity.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    return true;
  });

  const groupedPlaces = groupPlacesByCategory(filteredPlaces);

  const typeSummary = Object.entries(
    filteredPlaces.reduce<Record<string, number>>((acc, place) => {
      acc[place.type] = (acc[place.type] ?? 0) + 1;
      return acc;
    }, {})
  )
    .sort(([, aCount], [, bCount]) => bCount - aCount)
    .slice(0, 4);

  const mapPlaces = filteredPlaces
    .filter((place) => typeof place.lat === "number" && typeof place.lng === "number")
    .map((place) => ({
      id: place.id,
      name: place.name,
      type: friendlyType(place.type),
      lat: place.lat as number,
      lng: place.lng as number,
    }));

  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-600 transition-colors hover:text-blue-600"
        >
          <span aria-hidden="true">←</span>
          Back home
        </Link>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">{city.country}</p>
          <h1 className="text-4xl font-display font-bold text-slate-900">Dog-friendly {city.name}</h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-600">
            Explore curated places loved by the DogAtlas community. Find parks, cafés, services, and unique spots to enjoy with your companion.
          </p>
        </div>
        <div className="space-y-4">
          <SearchInput placeholder={`Search ${city.name} places...`} initial={searchQuery || ""} />
          
          {/* Category Cards */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Browse by category</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <Link
                href={`/${citySlug}`}
                className={`group relative overflow-hidden rounded-xl border-2 p-4 text-center transition-all hover:shadow-md ${
                  !selectedCategory 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-slate-200 bg-white hover:border-blue-300'
                }`}
              >
                <div className="text-3xl mb-2">🌍</div>
                <div className={`text-sm font-semibold ${!selectedCategory ? 'text-blue-700' : 'text-slate-900'}`}>
                  All
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {places.length}
                </div>
              </Link>
              
              <Link
                href={`/${citySlug}?category=parks`}
                className={`group relative overflow-hidden rounded-xl border-2 p-4 text-center transition-all hover:shadow-md ${
                  selectedCategory === 'parks'
                    ? 'border-emerald-500 bg-emerald-50' 
                    : 'border-slate-200 bg-white hover:border-emerald-300'
                }`}
              >
                <div className="text-3xl mb-2">🏞️</div>
                <div className={`text-sm font-semibold ${selectedCategory === 'parks' ? 'text-emerald-700' : 'text-slate-900'}`}>
                  Parks
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {places.filter(p => p.type === 'parks').length}
                </div>
              </Link>
              
              <Link
                href={`/${citySlug}?category=cafes_restaurants`}
                className={`group relative overflow-hidden rounded-xl border-2 p-4 text-center transition-all hover:shadow-md ${
                  selectedCategory === 'cafes_restaurants'
                    ? 'border-amber-500 bg-amber-50' 
                    : 'border-slate-200 bg-white hover:border-amber-300'
                }`}
              >
                <div className="text-3xl mb-2">☕</div>
                <div className={`text-sm font-semibold ${selectedCategory === 'cafes_restaurants' ? 'text-amber-700' : 'text-slate-900'}`}>
                  Cafés
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {places.filter(p => p.type === 'cafes_restaurants').length}
                </div>
              </Link>
              
              <Link
                href={`/${citySlug}?category=walks_trails`}
                className={`group relative overflow-hidden rounded-xl border-2 p-4 text-center transition-all hover:shadow-md ${
                  selectedCategory === 'walks_trails'
                    ? 'border-violet-500 bg-violet-50' 
                    : 'border-slate-200 bg-white hover:border-violet-300'
                }`}
              >
                <div className="text-3xl mb-2">🚶</div>
                <div className={`text-sm font-semibold ${selectedCategory === 'walks_trails' ? 'text-violet-700' : 'text-slate-900'}`}>
                  Trails
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {places.filter(p => p.type === 'walks_trails').length}
                </div>
              </Link>
              
              <Link
                href={`/${citySlug}?category=shops_services`}
                className={`group relative overflow-hidden rounded-xl border-2 p-4 text-center transition-all hover:shadow-md ${
                  selectedCategory === 'shops_services'
                    ? 'border-red-500 bg-red-50' 
                    : 'border-slate-200 bg-white hover:border-red-300'
                }`}
              >
                <div className="text-3xl mb-2">🛍️</div>
                <div className={`text-sm font-semibold ${selectedCategory === 'shops_services' ? 'text-red-700' : 'text-slate-900'}`}>
                  Services
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {places.filter(p => p.type === 'shops_services').length}
                </div>
              </Link>
              
              <Link
                href={`/${citySlug}?category=accommodation`}
                className={`group relative overflow-hidden rounded-xl border-2 p-4 text-center transition-all hover:shadow-md ${
                  selectedCategory === 'accommodation'
                    ? 'border-purple-500 bg-purple-50' 
                    : 'border-slate-200 bg-white hover:border-purple-300'
                }`}
              >
                <div className="text-3xl mb-2">🏨</div>
                <div className={`text-sm font-semibold ${selectedCategory === 'accommodation' ? 'text-purple-700' : 'text-slate-900'}`}>
                  Hotels
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {places.filter(p => p.type === 'accommodation').length}
                </div>
              </Link>
            </div>
          </div>
        </div>
        {typeSummary.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {typeSummary.map(([type, count]) => (
              <span
                key={type}
                className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-1 text-xs font-semibold text-blue-700"
              >
                <span aria-hidden="true">🐾</span>
                {friendlyType(type)} · {count}
              </span>
            ))}
          </div>
        )}
      </section>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,6fr)]">
        <div className="space-y-6">
          <Map places={mapPlaces} />
          {filteredPlaces.length > 0 ? (
            <ItineraryGenerator
              city={{ name: city.name, slug: citySlug }}
              places={filteredPlaces.map((place) => ({
                id: place.id,
                name: place.name,
                type: place.type,
                shortDescription: place.shortDescription,
              }))}
            />
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
              Add your first place in {city.name} to unlock itinerary ideas for local dog adventures.
            </div>
          )}
        </div>

        <div className="space-y-8">
          {filteredPlaces.length === 0 && (
            <div className="card p-6 text-sm text-slate-500">
              {searchQuery
                ? `No places found matching "${searchQuery}". Try a different search term.`
                : `We are still collecting dog-friendly spots in ${city.name}. Know a great one?`
              }
              {!searchQuery && (
                <Link href="/submit" className="text-blue-600 hover:underline">Share it with the community</Link>
              )}
            </div>
          )}

          {Object.entries(groupedPlaces).map(([category, categoryPlaces]) => (
            <section key={category} className="space-y-4">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-display font-bold text-slate-900">{category}</h2>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                  {categoryPlaces.length} {categoryPlaces.length === 1 ? 'place' : 'places'}
                </span>
              </div>
              
              <div className="space-y-4">
                {categoryPlaces.map((place) => (
                  <Link
                    key={place.id}
                    href={`/${citySlug}/p/${place.slug}`}
                    className="card-hover flex flex-col overflow-hidden sm:flex-row"
                  >
                    <div className="h-48 w-full sm:h-full sm:w-48">
                      <img
                        src={place.imageUrl}
                        alt={place.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex flex-1 flex-col gap-3 p-6">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                            {friendlyType(place.type)}
                          </p>
                          <h3 className="text-xl font-display font-bold text-slate-900">{place.name}</h3>
                        </div>
                        {place.dogFriendlyLevel != null && (
                          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                            Level {place.dogFriendlyLevel}/5
                          </span>
                        )}
                      </div>
                      {place.shortDescription && (
                        <p className="text-sm text-slate-600">{place.shortDescription}</p>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {place.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600">
                            #{tag}
                          </span>
                        ))}
                        {place.openingHours && (
                          <span className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600">
                            {place.openingHours}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
