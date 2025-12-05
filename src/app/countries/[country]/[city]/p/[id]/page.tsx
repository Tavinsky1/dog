import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCountry, getCity, getPlaces } from '@/lib/data';
import { cityUrl, getCategoryLabel, getCategoryIcon } from '@/lib/routing';
import { featureFlags } from '@/lib/featureFlags';
import Map from "@/components/Map";
import ReviewForm from "@/components/ReviewForm";
import ReviewsList from "@/components/ReviewsList";

// ISR: Revalidate every hour
export const revalidate = 3600;

interface PageProps {
  params: Promise<{ country: string; city: string; id: string }>;
}

export default async function PlaceDetailPage({ params }: PageProps) {
  const { country: countrySlug, city: citySlug, id: placeId } = await params;

  const country = getCountry(countrySlug);
  const city = getCity(countrySlug, citySlug);

  if (!country || !city) {
    notFound();
  }

  // Get all places for this city (always use database)
  const allPlaces = await getPlaces(countrySlug, citySlug, undefined, true);
  
  // Find the specific place by ID
  const place = allPlaces.find((p) => p.id === placeId);

  if (!place) {
    notFound();
  }

  // Prepare map data for this single place
  const mapPlaces = [{
    id: place.id,
    name: place.name,
    type: place.category,
    lat: typeof place.lat === 'number' ? place.lat : parseFloat(place.lat),
    lng: typeof place.lon === 'number' ? place.lon : parseFloat(place.lon),
  }];

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Breadcrumb Navigation */}
        <nav className="mb-8 text-sm">
          <ol className="flex items-center gap-2 text-gray-600">
            <li>
              <Link href="/" className="hover:text-orange-600">Home</Link>
            </li>
            <li>/</li>
            <li>
              <Link href={`/countries/${countrySlug}`} className="hover:text-orange-600">
                {country.flag} {country.name}
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href={cityUrl(countrySlug, citySlug)} className="hover:text-orange-600">
                {city.name}
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900 font-medium">{place.name}</li>
          </ol>
        </nav>

        {/* Place Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">{getCategoryIcon(place.category)}</span>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-bold text-gray-900">{place.name}</h1>
              </div>
              <p className="text-lg text-gray-600 mt-2">
                {getCategoryLabel(place.category)} in {city.name}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left Column - Images */}
          <div className="lg:col-span-2">
            {/* Hero Image */}
            <div className="rounded-2xl overflow-hidden border border-gray-200 bg-gradient-to-br from-orange-400 to-orange-600 mb-6">
              {place.photos.length > 0 ? (
                <img
                  src={place.photos[0]}
                  alt={place.name}
                  className="w-full h-[400px] object-cover"
                />
              ) : (
                <div className="w-full h-[400px] flex items-center justify-center text-white text-8xl">
                  {getCategoryIcon(place.category)}
                </div>
              )}
            </div>

            {/* Additional Images */}
            {place.photos.length > 1 && (
              <div className="grid grid-cols-3 gap-4 mb-8">
                {place.photos.slice(1, 4).map((photo, index) => (
                  <div key={index} className="rounded-xl overflow-hidden border border-gray-200">
                    <img
                      src={photo}
                      alt={`${place.name} - Image ${index + 2}`}
                      className="w-full h-32 object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Description */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About this place</h2>
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                {place.fullDescription || place.description || 'No description available for this place yet.'}
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Location</h2>
              </div>
              <div className="h-[400px]">
                <Map places={mapPlaces} cityCenter={city.coordinates as [number, number]} />
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 mt-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews & Ratings</h2>
              
              {/* Reviews List */}
              <div className="mb-8">
                <ReviewsList placeId={place.id} />
              </div>

              {/* Review Form */}
              <div className="border-t border-gray-200 pt-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Share Your Experience</h3>
                <ReviewForm placeId={place.id} />
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-1">
            {/* Info Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Details</h3>

              {/* Address */}
              {place.address && (
                <div className="mb-6">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">📍</span>
                    <div>
                      <div className="text-sm font-semibold text-gray-900 mb-1">Address</div>
                      <div className="text-sm text-gray-600">{place.address}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Phone */}
              {place.phone && (
                <div className="mb-6">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">📞</span>
                    <div>
                      <div className="text-sm font-semibold text-gray-900 mb-1">Phone</div>
                      <a href={`tel:${place.phone}`} className="text-sm text-orange-600 hover:text-orange-700">
                        {place.phone}
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Website */}
              {place.website && (
                <div className="mb-6">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🔗</span>
                    <div>
                      <div className="text-sm font-semibold text-gray-900 mb-1">Website</div>
                      <a 
                        href={place.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-orange-600 hover:text-orange-700 break-all"
                      >
                        Visit website →
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Category */}
              <div className="mb-6">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{getCategoryIcon(place.category)}</span>
                  <div>
                    <div className="text-sm font-semibold text-gray-900 mb-1">Category</div>
                    <div className="text-sm text-gray-600">{getCategoryLabel(place.category)}</div>
                  </div>
                </div>
              </div>

              {/* Coordinates */}
              <div className="pt-6 border-t border-gray-200">
                <div className="text-xs text-gray-500">
                  Coordinates: {place.lat.toFixed(6)}, {place.lon.toFixed(6)}
                </div>
              </div>

              {/* Back Button */}
              <div className="mt-8">
                <Link
                  href={cityUrl(countrySlug, citySlug)}
                  className="block w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-xl text-center transition-colors"
                >
                  ← Back to {city.name}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const { country: countrySlug, city: citySlug, id: placeId } = await params;
  
  const country = getCountry(countrySlug);
  const city = getCity(countrySlug, citySlug);
  
  if (!country || !city) {
    return {
      title: 'Place Not Found',
    };
  }

  const allPlaces = await getPlaces(countrySlug, citySlug, undefined, true);
  const place = allPlaces.find((p) => p.id === placeId);

  if (!place) {
    return {
      title: 'Place Not Found',
    };
  }

  return {
    title: `${place.name} - ${city.name} | Dog Atlas`,
    description: place.description || `Dog-friendly ${getCategoryLabel(place.category).toLowerCase()} in ${city.name}, ${country.name}`,
  };
}
