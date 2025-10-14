import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCountry, getCountries } from '@/lib/data';
import { cityUrl } from '@/lib/routing';
import { featureFlags } from '@/lib/featureFlags';

// Generate static params for all countries
export async function generateStaticParams() {
  const countries = getCountries();
  return countries.map((country) => ({
    country: country.slug,
  }));
}

// ISR: Revalidate every hour
export const revalidate = featureFlags.isrRevalidate;

interface PageProps {
  params: Promise<{ country: string }>;
}

export default async function CountryPage({ params }: PageProps) {
  const { country: countrySlug } = await params;
  const country = getCountry(countrySlug);

  if (!country) {
    notFound();
  }

  // Generate metadata
  const totalPlaces = country.cities.reduce((sum, city) => sum + city.placeCount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Country Header */}
        <div className="mb-12 text-center">
          <div className="text-6xl mb-4">{country.flag}</div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {country.name}
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Discover dog-friendly places across {country.cities.length} {country.cities.length === 1 ? 'city' : 'cities'}
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <span>🌍</span>
              <span>{country.continent}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>📍</span>
              <span>{totalPlaces} places</span>
            </div>
            <div className="flex items-center gap-2">
              <span>💬</span>
              <span>{country.language}</span>
            </div>
          </div>
        </div>

        {/* Breadcrumbs */}
        <nav className="mb-8 text-sm">
          <ol className="flex items-center gap-2 text-gray-600">
            <li>
              <Link href="/" className="hover:text-orange-600">
                Home
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900 font-medium">{country.name}</li>
          </ol>
        </nav>

        {/* Cities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {country.cities.map((city) => (
            <Link
              key={city.slug}
              href={cityUrl(country.slug, city.slug)}
              className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
            >
              {/* City Image Placeholder */}
              <div className="h-48 bg-gradient-to-br from-orange-400 to-orange-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  <div className="text-center">
                    <div className="text-6xl mb-2">🏙️</div>
                    <h3 className="text-2xl font-bold">{city.name}</h3>
                  </div>
                </div>
              </div>

              {/* City Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">
                      {city.name}
                    </h3>
                    {city.population && (
                      <p className="text-sm text-gray-500">
                        Pop: {(city.population / 1_000_000).toFixed(1)}M
                      </p>
                    )}
                  </div>
                  <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                    {city.placeCount} {city.placeCount === 1 ? 'place' : 'places'}
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  {city.description}
                </p>

                {/* Category Breakdown */}
                {city.placeCount > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(city.categories)
                      .filter(([_, count]) => count > 0)
                      .slice(0, 3)
                      .map(([category, count]) => (
                        <span
                          key={category}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                        >
                          {count} {category.replace('_', ' ')}
                        </span>
                      ))}
                  </div>
                )}

                {city.placeCount === 0 && (
                  <div className="text-sm text-gray-500 italic">
                    Coming soon! Help us add places.
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* No Cities Message */}
        {country.cities.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <div className="text-6xl mb-4">🏙️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No cities yet
            </h2>
            <p className="text-gray-600 mb-6">
              We're working on adding cities in {country.name}. Check back soon!
            </p>
            <Link
              href="/"
              className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
            >
              Explore Other Countries
            </Link>
          </div>
        )}

        {/* Back to Home */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
          >
            <span>←</span>
            <span>Back to all countries</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

// Generate metadata
export async function generateMetadata({ params }: PageProps) {
  const { country: countrySlug } = await params;
  const country = getCountry(countrySlug);

  if (!country) {
    return {
      title: 'Country Not Found',
    };
  }

  const totalPlaces = country.cities.reduce((sum, city) => sum + city.placeCount, 0);

  return {
    title: `${country.flag} ${country.name} - Dog-Friendly Places | DogAtlas`,
    description: `Discover ${totalPlaces}+ dog-friendly places across ${country.cities.length} cities in ${country.name}. Find parks, cafés, trails, and more for you and your pup.`,
    openGraph: {
      title: `Dog-Friendly ${country.name}`,
      description: `${country.cities.length} cities • ${totalPlaces} places`,
      images: [{
        url: `/api/og?title=${encodeURIComponent(country.name)}&type=country`,
        width: 1200,
        height: 630,
      }],
    },
  };
}
