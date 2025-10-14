import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCountry, getCity, getPlaces, getCountries } from '@/lib/data';
import { cityUrl, placeUrl, getCategoryLabel, getCategoryIcon, CATEGORY_LABELS } from '@/lib/routing';
import { featureFlags } from '@/lib/featureFlags';

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
  searchParams: Promise<{ category?: string }>;
}

export default async function CityPage({ params, searchParams }: PageProps) {
  const { country: countrySlug, city: citySlug } = await params;
  const { category } = await searchParams;

  const country = getCountry(countrySlug);
  const city = getCity(countrySlug, citySlug);

  if (!country || !city) {
    notFound();
  }

  // Get places (from seed file or database)
  const allPlaces = await getPlaces(countrySlug, citySlug, undefined, featureFlags.useDatabase);
  const filteredPlaces = category
    ? allPlaces.filter(p => p.category === category)
    : allPlaces;

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

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {city.name}
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                {city.description}
              </p>
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <span>{country.flag}</span>
                  <span>{country.name}</span>
                </div>
                {city.population && (
                  <div className="flex items-center gap-2">
                    <span>👥</span>
                    <span>{(city.population / 1_000_000).toFixed(1)}M people</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span>📍</span>
                  <span>{filteredPlaces.length} {category ? getCategoryLabel(category).toLowerCase() : 'places'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex gap-3 min-w-max">
            <Link
              href={cityUrl(countrySlug, citySlug)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                !category
                  ? 'bg-orange-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              All Places ({allPlaces.length})
            </Link>
            {Object.entries(CATEGORY_LABELS).map(([cat, label]) => {
              const count = allPlaces.filter(p => p.category === cat).length;
              if (count === 0) return null;
              
              return (
                <Link
                  key={cat}
                  href={`${cityUrl(countrySlug, citySlug)}?category=${cat}`}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                    category === cat
                      ? 'bg-orange-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {getCategoryIcon(cat)} {label} ({count})
                </Link>
              );
            })}
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
