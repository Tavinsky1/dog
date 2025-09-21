import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';

export async function generateMetadata({
  params,
}: {
  params: { slug: string; city: string };
}): Promise<Metadata> {
  const place = await prisma.place.findUnique({ 
    where: { slug: params.slug }, 
    include: { city: true } 
  });
  
  if (!place) {
    return { title: 'Place Not Found' };
  }

  const title = `${place.name} in ${place.city.name} - DOGGYWORLD`;
  const description = place.shortDescription;
  const imageUrl = place.imageUrl || '';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: place.name,
    description: place.fullDescription || place.shortDescription,
    address: {
      '@type': 'PostalAddress',
      addressLocality: place.city.name,
      addressRegion: place.region || '',
      addressCountry: place.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: place.lat,
      longitude: place.lng,
    },
  };

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: imageUrl ? [{ url: imageUrl }] : [],
    },
    other: {
      'application/ld+json': JSON.stringify(jsonLd),
    },
  };
}

export default async function PlacePage({
  params,
}: {
  params: { slug: string; city: string };
}) {
  const place = await prisma.place.findFirst({
    where: { slug: params.slug },
    include: { city: true },
  });

  if (!place) {
    return notFound();
  }

  const gallery = typeof place.gallery === 'string' 
    ? JSON.parse(place.gallery || '[]') 
    : place.gallery || [];
  
  const amenities = typeof place.amenities === 'string'
    ? JSON.parse(place.amenities || '[]')
    : place.amenities || [];
    
  const tags = typeof place.tags === 'string'
    ? JSON.parse(place.tags || '[]')
    : place.tags || [];

  return (
    <main className="container mx-auto p-6 max-w-4xl">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <Link href="/" className="text-blue-600 hover:underline">Home</Link>
        <span className="mx-2">›</span>
        <Link href={`/${params.city}`} className="text-blue-600 hover:underline">
          {place.city.name}
        </Link>
        <span className="mx-2">›</span>
        <span className="text-gray-500">{place.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{place.name}</h1>
            <div className="flex items-center gap-4 text-gray-600">
              <span className="flex items-center gap-1">
                📍 {place.city.name}, {place.country}
              </span>
              <span className="px-2 py-1 bg-gray-100 text-xs uppercase rounded">
                {place.type}
              </span>
              {place.dogFriendlyLevel && (
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                  Dog Level {place.dogFriendlyLevel}/5
                </span>
              )}
            </div>
          </div>
          
          {place.rating && (
            <div className="flex items-center gap-1 bg-yellow-50 px-3 py-2 rounded-lg">
              ⭐ <span className="font-semibold">{place.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Image */}
      {place.imageUrl && (
        <div className="mb-6 aspect-video w-full rounded-xl overflow-hidden">
          <Image
            src={place.imageUrl}
            alt={place.name}
            width={800}
            height={450}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Description */}
          <section>
            <h2 className="text-xl font-semibold mb-3">About</h2>
            <p className="text-gray-700 leading-relaxed">
              {place.fullDescription || place.shortDescription}
            </p>
          </section>

          {/* Amenities */}
          {amenities.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-3">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {amenities.map((amenity: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Rules */}
          {place.rules && (
            <section>
              <h2 className="text-xl font-semibold mb-3">Rules & Guidelines</h2>
              <p className="text-gray-700">{place.rules}</p>
            </section>
          )}

          {/* Gallery */}
          {gallery.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-3">Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {gallery.map((imageUrl: string, index: number) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt={`${place.name} gallery ${index + 1}`}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-3">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Contact & Info</h3>
            <div className="space-y-3">
              {place.websiteUrl && (
                <a
                  href={place.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:underline"
                >
                  🌐 Visit Website
                </a>
              )}
              
              {place.phone && (
                <a
                  href={`tel:${place.phone}`}
                  className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
                >
                  📞 {place.phone}
                </a>
              )}
              
              {place.email && (
                <a
                  href={`mailto:${place.email}`}
                  className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
                >
                  📧 {place.email}
                </a>
              )}
              
              {place.priceRange && (
                <div className="text-gray-700">
                  <strong>Price Range:</strong> {place.priceRange}
                </div>
              )}
              
              {place.openingHours && (
                <div className="text-gray-700">
                  <strong>Hours:</strong> {place.openingHours}
                </div>
              )}
            </div>
          </div>

          {/* Map */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Location</h3>
            <div className="aspect-square w-full bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Map placeholder</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {place.lat.toFixed(6)}, {place.lng.toFixed(6)}
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
              ❤️ Add to Favorites
            </button>
            
            <Link
              href={`/${params.city}`}
              className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              ← Back to {place.city.name}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}