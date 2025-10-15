import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCountry, getCity, getPlaces, getCountries } from '@/lib/data';
import { cityUrl, placeUrl, getCategoryLabel, getCategoryIcon, CATEGORY_LABELS } from '@/lib/routing';
import { featureFlags } from '@/lib/featureFlags';
import Map from "@/components/Map";
import ItineraryGenerator from "@/components/ItineraryGenerator";
import SearchInput from "@/components/SearchInput";

// Generate static params for all cities
export async function generateStaticParams() {
  const countries = getCountries();
  const paths: Array<{ country: string; city: string }> = [];

  for (const country of countries) {
    for (const city of country.cities) {
      paths.push({
        country: country.slug,
        city: city.slug,
      });
    }
  }

  return paths;
}

// ISR: Revalidate every hour
export const revalidate = featureFlags.isrRevalidate;

interface PageProps {
  params: Promise<{ country: string; city: string }>;
  searchParams: Promise<{ category?: string; q?: string }>;
}

export default async function CityPage({ params, searchParams }: PageProps) {
  const { country: countrySlug, city: citySlug } = await params;
  const { category, q: searchQuery } = await searchParams;

  const country = getCountry(countrySlug);
  const city = getCity(countrySlug, citySlug);

  if (!country || !city) {
    notFound();
  }

  // Get places (from seed file or database)
  const allPlaces = await getPlaces(countrySlug, citySlug, undefined, featureFlags.useDatabase);
  
  // Filter places based on category and search query
  const filteredPlaces = allPlaces.filter((place) => {
    // Category filter
    if (category && place.category !== category) {
      return false;
    }
    
    // Search filter
    if (searchQuery) {
      return (
        place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return true;
  });
  
  // Prepare places for map with coordinate validation
  const mapPlaces = filteredPlaces
    .filter((place) => {
      const lat = typeof place.lat === 'number' ? place.lat : parseFloat(place.lat);
      const lon = typeof place.lon === 'number' ? place.lon : parseFloat(place.lon);
      return !isNaN(lat) && !isNaN(lon) && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
    })
    .map((place) => ({
      id: place.id,
      name: place.name,
      type: place.category,
      lat: typeof place.lat === 'number' ? place.lat : parseFloat(place.lat),
      lng: typeof place.lon === 'number' ? place.lon : parseFloat(place.lon),
    }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* City Header */}
        <div className="mb-12">
          <nav className="mb-6 text-sm">
            <ol className="flex items-center gap-2 text-gray-600">
              <li>
                <Link href="/" className="hover:text-orange-600">Home</Link>
              </li>
              <li>/</li>
              <li>
                <Link href={`/${countrySlug}`} className="hover:text-orange-600">
                  {country.flag} {country.name}
                </Link>
              </li>
              <li>/</li>
              <li className="text-gray-900 font-medium">{city.name}</li>
            </ol>
          </nav>

          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Dog-friendly {city.name}
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              {city.description || `Explore curated dog-friendly places in ${city.name}. Find parks, cafés, services, and unique spots to enjoy with your companion.`}
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <span>{country.flag}</span>
                <span>{country.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>�</span>
                <span>{filteredPlaces.length} {category ? getCategoryLabel(category).toLowerCase() : 'places'}</span>
              </div>
            </div>
          </div>
          
          {/* Search Input */}
          <div className="mt-6">
            <SearchInput placeholder={`Search ${city.name} places...`} initial={searchQuery || ""} />
          </div>
        </div>

        {/* Category Cards with Images */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Browse by category</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* All Categories */}
            <Link
              href={cityUrl(countrySlug, citySlug)}
              className={`group relative overflow-hidden rounded-xl border-2 transition-all hover:shadow-lg hover:-translate-y-1 ${
                !category ? 'border-orange-400' : 'border-gray-200 hover:border-orange-300'
              }`}
            >
              <img 
                src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=400&q=80"
                alt="All categories"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
              <div className="relative z-10 p-4 flex flex-col justify-end h-full min-h-[120px]">
                <div className="text-3xl mb-2">🌍</div>
                <div className="text-sm font-semibold text-white">All</div>
                <div className="text-xs text-white/90 mt-1">{allPlaces.length}</div>
              </div>
            </Link>
            
            {/* Parks */}
            <Link
              href={`${cityUrl(countrySlug, citySlug)}?category=parks`}
              className={`group relative overflow-hidden rounded-xl border-2 transition-all hover:shadow-lg hover:-translate-y-1 ${
                category === 'parks' ? 'border-emerald-400' : 'border-gray-200 hover:border-emerald-300'
              }`}
            >
              <img 
                src="https://images.unsplash.com/photo-1568393691622-c7ba131d63b4?auto=format&fit=crop&w=400&q=80"
                alt="Parks"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className={`absolute inset-0 transition-colors ${
                category === 'parks' ? 'bg-emerald-600/70' : 'bg-slate-900/50 group-hover:bg-emerald-600/60'
              }`} />
              <div className="relative z-10 p-4 min-h-[120px] flex flex-col justify-end">
                <div className="text-3xl mb-2">🏞️</div>
                <div className="text-sm font-semibold text-white">Parks</div>
                <div className="text-xs text-white/90 mt-1">{allPlaces.filter(p => p.category === 'parks').length}</div>
              </div>
            </Link>
            
            {/* Cafés */}
            <Link
              href={`${cityUrl(countrySlug, citySlug)}?category=cafes_restaurants`}
              className={`group relative overflow-hidden rounded-xl border-2 transition-all hover:shadow-lg hover:-translate-y-1 ${
                category === 'cafes_restaurants' ? 'border-amber-400' : 'border-gray-200 hover:border-amber-300'
              }`}
            >
              <img 
                src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=400&q=80"
                alt="Cafés & Restaurants"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className={`absolute inset-0 transition-colors ${
                category === 'cafes_restaurants' ? 'bg-amber-600/70' : 'bg-slate-900/50 group-hover:bg-amber-600/60'
              }`} />
              <div className="relative z-10 p-4 min-h-[120px] flex flex-col justify-end">
                <div className="text-3xl mb-2">☕</div>
                <div className="text-sm font-semibold text-white">Cafés</div>
                <div className="text-xs text-white/90 mt-1">{allPlaces.filter(p => p.category === 'cafes_restaurants').length}</div>
              </div>
            </Link>
            
            {/* Trails */}
            <Link
              href={`${cityUrl(countrySlug, citySlug)}?category=walks_trails`}
              className={`group relative overflow-hidden rounded-xl border-2 transition-all hover:shadow-lg hover:-translate-y-1 ${
                category === 'walks_trails' ? 'border-violet-400' : 'border-gray-200 hover:border-violet-300'
              }`}
            >
              <img 
                src="https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=400&q=80"
                alt="Walks & Trails"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className={`absolute inset-0 transition-colors ${
                category === 'walks_trails' ? 'bg-violet-600/70' : 'bg-slate-900/50 group-hover:bg-violet-600/60'
              }`} />
              <div className="relative z-10 p-4 min-h-[120px] flex flex-col justify-end">
                <div className="text-3xl mb-2">🚶</div>
                <div className="text-sm font-semibold text-white">Trails</div>
                <div className="text-xs text-white/90 mt-1">{allPlaces.filter(p => p.category === 'walks_trails').length}</div>
              </div>
            </Link>
            
            {/* Services */}
            <Link
              href={`${cityUrl(countrySlug, citySlug)}?category=shops_services`}
              className={`group relative overflow-hidden rounded-xl border-2 transition-all hover:shadow-lg hover:-translate-y-1 ${
                category === 'shops_services' ? 'border-rose-400' : 'border-gray-200 hover:border-rose-300'
              }`}
            >
              <img 
                src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=400&q=80"
                alt="Shops & Services"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className={`absolute inset-0 transition-colors ${
                category === 'shops_services' ? 'bg-rose-600/70' : 'bg-slate-900/50 group-hover:bg-rose-600/60'
              }`} />
              <div className="relative z-10 p-4 min-h-[120px] flex flex-col justify-end">
                <div className="text-3xl mb-2">🛍️</div>
                <div className="text-sm font-semibold text-white">Services</div>
                <div className="text-xs text-white/90 mt-1">{allPlaces.filter(p => p.category === 'shops_services').length}</div>
              </div>
            </Link>
            
            {/* Hotels */}
            <Link
              href={`${cityUrl(countrySlug, citySlug)}?category=accommodation`}
              className={`group relative overflow-hidden rounded-xl border-2 transition-all hover:shadow-lg hover:-translate-y-1 ${
                category === 'accommodation' ? 'border-purple-400' : 'border-gray-200 hover:border-purple-300'
              }`}
            >
              <img 
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80"
                alt="Hotels & Accommodation"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className={`absolute inset-0 transition-colors ${
                category === 'accommodation' ? 'bg-purple-600/70' : 'bg-slate-900/50 group-hover:bg-purple-600/60'
              }`} />
              <div className="relative z-10 p-4 min-h-[120px] flex flex-col justify-end">
                <div className="text-3xl mb-2">🏨</div>
                <div className="text-sm font-semibold text-white">Hotels</div>
                <div className="text-xs text-white/90 mt-1">{allPlaces.filter(p => p.category === 'accommodation').length}</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Map and Itinerary Section */}
        <div className="mb-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Map */}
          <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
            <Map places={mapPlaces} />
          </div>
          
          {/* Itinerary Generator */}
          <div>
            {filteredPlaces.length > 0 ? (
              <ItineraryGenerator
                city={{ name: city.name, slug: citySlug }}
                places={filteredPlaces.map((place) => ({
                  id: place.id,
                  name: place.name,
                  type: place.category,
                  shortDescription: place.description || undefined,
                }))}
              />
            ) : (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-500">
                Add your first place in {city.name} to unlock itinerary ideas.
              </div>
            )}
          </div>
        </div>

        {/* Places Grid */}
        {filteredPlaces.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlaces.map((place) => (
              <Link
                key={place.id}
                href={placeUrl(countrySlug, citySlug, place.id)}
                className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                {/* Place Image */}
                <div className="h-48 bg-gradient-to-br from-orange-400 to-orange-600 relative overflow-hidden">
                  {place.photos.length > 0 ? (
                    <img
                      src={place.photos[0]}
                      alt={place.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-white text-6xl">
                      {getCategoryIcon(place.category)}
                    </div>
                  )}
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-900">
                    {getCategoryIcon(place.category)} {getCategoryLabel(place.category)}
                  </div>

                  {place.verified && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      ✓ Verified
                    </div>
                  )}
                </div>

                {/* Place Info */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                    {place.name}
                  </h3>

                  {place.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {place.description}
                    </p>
                  )}

                  {place.address && (
                    <div className="flex items-start gap-2 text-sm text-gray-500 mb-2">
                      <span className="text-orange-600">📍</span>
                      <span className="line-clamp-1">{place.address}</span>
                    </div>
                  )}

                  {place.website && (
                    <div className="flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700">
                      <span>🔗</span>
                      <span className="truncate">Visit website</span>
                    </div>
                  )}

                  {place.rating && (
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < Math.round(place.rating!) ? 'text-yellow-400' : 'text-gray-300'}>
                            ★
                          </span>
                        ))}
                      </div>
                      {place.reviewCount && (
                        <span className="text-xs text-gray-500">
                          ({place.reviewCount})
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-md">
            <div className="text-6xl mb-4">🐾</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No places yet in {category ? getCategoryLabel(category).toLowerCase() : 'this city'}
            </h2>
            <p className="text-gray-600 mb-6">
              Help us grow DogAtlas! Be the first to add a {category ? getCategoryLabel(category).toLowerCase().slice(0, -1) : 'place'} in {city.name}.
            </p>
            <div className="flex gap-4 justify-center">
              {category && (
                <Link
                  href={cityUrl(countrySlug, citySlug)}
                  className="inline-block bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  View All Categories
                </Link>
              )}
              <Link
                href="/submit"
                className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
              >
                Add a Place
              </Link>
            </div>
          </div>
        )}

        {/* Back Link */}
        <div className="mt-12 text-center">
          <Link
            href={`/${countrySlug}`}
            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
          >
            <span>←</span>
            <span>Back to {country.name}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

// Generate metadata with canonical URL
export async function generateMetadata({ params, searchParams }: PageProps) {
  const { country: countrySlug, city: citySlug } = await params;
  const { category } = await searchParams;

  const country = getCountry(countrySlug);
  const city = getCity(countrySlug, citySlug);

  if (!country || !city) {
    return {
      title: 'City Not Found',
    };
  }

  const places = await getPlaces(countrySlug, citySlug, category, featureFlags.useDatabase);
  const categoryLabel = category ? getCategoryLabel(category) : 'places';
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://dog-atlas.com';
  const canonical = `${baseUrl}/countries/${countrySlug}/${citySlug}`;

  return {
    title: `${city.name}, ${country.name} - ${places.length} Dog-Friendly ${categoryLabel} | DogAtlas`,
    description: city.description || `Discover ${places.length} dog-friendly ${categoryLabel.toLowerCase()} in ${city.name}, ${country.name}. Parks, cafés, trails, and more for you and your pup.`,
    alternates: {
      canonical,
    },
    openGraph: {
      title: `Dog-Friendly ${city.name}`,
      description: `${places.length} ${categoryLabel.toLowerCase()} in ${country.name}`,
      url: canonical,
      images: [{
        url: `/api/og?title=${encodeURIComponent(city.name)}&type=city`,
        width: 1200,
        height: 630,
      }],
    },
  };
}
