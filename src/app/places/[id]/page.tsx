import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const place = await prisma.place.findUnique({
    where: { id },
    select: { name: true, shortDescription: true, type: true, region: true, country: true, rating: true },
  });
  if (!place) return { title: "Place not found • DogAtlas" };
  const title = `${place.name} • ${place.country ?? "Berlin"} | DogAtlas`;
  const desc =
    place.shortDescription ??
    `Dog-friendly ${String(place.type ?? "").replace(/_/g, " ")} in ${place.region ?? place.country ?? "Berlin"}.`;
  return {
    title,
    description: desc,
    openGraph: { title, description: desc },
    twitter: { title, description: desc, card: "summary_large_image" },
  };
}

import Link from "next/link";
import PhotoStrip from "@/components/PhotoStrip";
import PlaceAnalytics from "@/components/PlaceAnalytics";
import StarRating from "@/components/StarRating";
import ReviewForm from "@/components/ReviewForm";
import ReviewsList from "@/components/ReviewsList";

const placeInclude = {
  favorites: true,
};

// Get the place data with relations
async function getPlaceWithRelations(id: string) {
  return await prisma.place.findUnique({
    where: { id },
    include: placeInclude,
  });
}

function prettyCategory(cat?: string | null) {
  return (cat ?? "").replace(/_/g, " ");
}

export default async function PlacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const place = await getPlaceWithRelations(id);

  if (!place) return <div className="p-6">Not found</div>;

  const photos = Array.isArray(place.gallery) ? place.gallery.filter((url: any): url is string => typeof url === 'string') : [];
  
  // Get reviews separately since they're not included in the place query
  const reviews = await prisma.review.findMany({
    where: { placeId: id, status: "published" },
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: "desc" }
  });
  
  const computedAvg =
    reviews.length > 0
      ? reviews.reduce((sum: number, r: any) => sum + (r.rating ?? 0), 0) / reviews.length
      : null;

  const displayRating =
    typeof place.rating === "number"
      ? place.rating
      : computedAvg !== null
      ? Number(computedAvg.toFixed(1))
      : null;

  const amenities = Array.isArray(place.amenities) ? place.amenities.filter((a: any): a is string => typeof a === 'string') : [];
  const dogsIndoors = amenities.includes("dogs_allowed_indoors");
  const waterBowls = amenities.includes("water_bowls");
  const offLeash = amenities.find((a: string) => a.startsWith("off_leash_allowed:"))?.replace("off_leash_allowed:", "");

  // JSON-LD structured data for SEO, now with reviews
  const reviewJson = (reviews ?? []).slice(0, 20).map((r: any) => ({
    "@type": "Review",
    reviewRating: r.rating != null ? {
      "@type": "Rating",
      ratingValue: r.rating,
      bestRating: 5,
      worstRating: 1,
    } : undefined,
    reviewBody: r.body || undefined,
    author: r.userId ? { "@type": "Person", name: "Verified user" } : { "@type": "Person", name: "Community member" },
    datePublished: r.createdAt?.toISOString?.() ?? undefined,
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Place",
    name: place.name,
    address: {
      "@type": "PostalAddress",
      addressLocality: place.region || place.country,
      addressRegion: place.region,
      addressCountry: place.country,
    },
    geo:
      place.lat != null && place.lng != null
        ? { "@type": "GeoCoordinates", latitude: place.lat, longitude: place.lng }
        : undefined,
    aggregateRating:
      typeof displayRating === "number"
        ? { "@type": "AggregateRating", ratingValue: displayRating, reviewCount: reviews.length }
        : undefined,
    review: reviewJson.length ? reviewJson : undefined,
  };  return (
    <div className="space-y-8">
      {/* Analytics Tracking */}
      <PlaceAnalytics 
        placeId={place.id} 
        placeName={place.name} 
        category={place.type} 
      />
      
      {/* SEO: JSON-LD structured data */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Hero section */}
      <div className="card-hover overflow-hidden">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="text-sm text-orange-600 font-bold mb-1 uppercase tracking-wider">
                {prettyCategory(place.type)}
              </div>
              <h1 className="text-3xl font-display font-extrabold text-gray-800 leading-tight">
                {place.name}
              </h1>
            </div>
            {displayRating != null && (
              <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-xl border border-amber-200">
                <span className="text-2xl">⭐</span>
                <div>
                  <div className="font-bold text-amber-800">{displayRating.toFixed(1)}</div>
                  {reviews.length > 0 && (
                    <div className="text-xs text-amber-600">({reviews.length} reviews)</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {place.region && (
            <div className="flex items-center text-gray-600 mb-4">
              <svg className="w-4 h-4 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              {place.region}, {place.country}
            </div>
          )}

          {/* Quick badges based on features */}
          <div className="flex flex-wrap gap-2">
            {dogsIndoors && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-orange-100 text-orange-800 border border-orange-200">
                🏠 Dogs indoors
              </span>
            )}
            {typeof offLeash === "string" && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800 border border-green-200">
                🐕‍🦺 Off-leash: {offLeash}
              </span>
            )}
            {waterBowls && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                💧 Water bowls
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Photos */}
      {photos.length > 0 && (
        <div className="card-hover p-6">
          <h2 className="heading-md mb-4">📸 Photos</h2>
          <PhotoStrip urls={photos} />
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Main content */}
        <div className="space-y-6">
          {/* Description */}
          {place.fullDescription && (
            <div className="card p-6">
              <h3 className="heading-md mb-4">📝 About This Place</h3>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed">{place.fullDescription}</p>
              </div>
            </div>
          )}

          {/* Reviews */}
          <div className="card p-6">
            <h3 className="heading-md mb-4">⭐ Reviews ({reviews.length})</h3>
            {reviews.length ? (
              <div className="space-y-4">
                {reviews.slice(0, 5).map((r: any) => (
                  <div key={r.id} className="border-l-4 border-orange-200 pl-4 py-2">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`text-sm ${i < (r.rating ?? 0) ? 'text-amber-400' : 'text-gray-300'}`}>
                            ⭐
                          </span>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {r.rating ?? "—"}/5
                      </span>
                    </div>
                    {r.body && (
                      <p className="text-gray-700 mb-2">{r.body}</p>
                    )}
                    {Array.isArray(r.tags) && r.tags.length ? (
                      <div className="flex flex-wrap gap-1">
                        {r.tags.filter((tag: any): tag is string => typeof tag === 'string').map((tag: string, i: number) => (
                          <span key={i} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))}
                {reviews.length > 5 && (
                  <div className="text-center pt-4">
                    <span className="text-sm text-gray-600">
                      Showing 5 of {reviews.length} reviews
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <span className="text-4xl mb-4 block">🐕</span>
                <p>No reviews yet. Be the first to share your experience!</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="card p-6">
            <h3 className="heading-md mb-4">🚀 Quick Actions</h3>
            <div className="space-y-3">
              {place.websiteUrl && (
                <a 
                  href={place.websiteUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-primary w-full text-center"
                >
                  🌐 Visit Website
                </a>
              )}
              <Link href="/submit" className="btn-secondary w-full text-center">
                ✏️ Suggest Edit
              </Link>
            </div>
          </div>

          {/* Map or additional info could go here */}
          {(place.lat && place.lng) && (
            <div className="card p-6">
              <h3 className="heading-md mb-4">📍 Location</h3>
              <div className="bg-gray-100 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-600 mb-2">Interactive map coming soon!</p>
                <p className="text-xs text-gray-500">
                  Coordinates: {place.lat.toFixed(4)}, {place.lng.toFixed(4)}
                </p>
              </div>
            </div>
          )}

          {/* User Reviews Section */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="heading-md">🐕 Community Reviews</h3>
              <div className="flex items-center gap-2">
                {displayRating && (
                  <>
                    <StarRating rating={displayRating} size="sm" readonly />
                    <span className="text-sm text-gray-600">
                      {displayRating} • {reviews.length} reviews
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Review Form */}
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-4">Share your experience!</h4>
              <ReviewForm placeId={place.id} />
            </div>

            {/* Reviews List */}
            <ReviewsList placeId={place.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
