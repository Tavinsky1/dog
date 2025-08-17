import type { Metadata } from "next";
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const prisma = new (require("@prisma/client").PrismaClient)();
  const place = await prisma.place.findUnique({
    where: { id: params.id },
    select: { name: true, description: true, category: true, district: true, city: true, rating: true },
  });
  if (!place) return { title: "Place not found • DogAtlas" };
  const title = `${place.name} • ${place.city ?? "Berlin"} | DogAtlas`;
  const desc =
    place.description ??
    `Dog-friendly ${String(place.category ?? "").replace(/_/g, " ")} in ${place.district ?? place.city ?? "Berlin"}.`;
  return {
    title,
    description: desc,
    openGraph: { title, description: desc },
    twitter: { title, description: desc, card: "summary_large_image" },
  };
}


import { PrismaClient, Prisma } from "@prisma/client";
import Link from "next/link";
import Lightbox from "@/components/Lightbox";
import PhotoStrip from "@/components/PhotoStrip";

const prisma = new PrismaClient();

const placeInclude = {
  features: true,
  hours: true,
  photos: true,
  reviews: true,
  activities: true,
} satisfies Prisma.PlaceInclude;

type PlaceWithRelations = Prisma.PlaceGetPayload<{ include: typeof placeInclude }>;

function prettyCategory(cat?: string | null) {
  return (cat ?? "").replace(/_/g, " ");
}

export default async function PlacePage({ params }: { params: { id: string } }) {
  const place = await prisma.place.findUnique({
    where: { id: params.id },
    include: placeInclude,
  });

  if (!place) return <div className="p-6">Not found</div>;

  const photos = (place.photos ?? []).map((p) => p.url).filter(Boolean);
  const reviews = place.reviews ?? [];
  const computedAvg =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + (r.rating ?? 0), 0) / reviews.length
      : null;

  const displayRating =
    typeof place.rating === "number"
      ? place.rating
      : computedAvg !== null
      ? Number(computedAvg.toFixed(1))
      : null;

  const features = new Map((place.features ?? []).map((f) => [f.key, f.value]));
  const dogsIndoors = features.get("dogs_allowed_indoors") === "true";
  const offLeash = features.get("off_leash_allowed");
  const waterBowls = features.get("water_bowls") === "true";

  // JSON-LD structured data for SEO, now with reviews
  const reviewJson = (reviews ?? []).slice(0, 20).map((r) => ({
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
      streetAddress: place.address ?? undefined,
      addressLocality: place.district ?? "Berlin",
      addressRegion: "BE",
      addressCountry: "DE",
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
  };

  return (
    <div className="space-y-8">
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
                {prettyCategory(place.category)}
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

          {place.address && (
            <div className="flex items-center text-gray-600 mb-2">
              <svg className="w-4 h-4 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {place.address}
            </div>
          )}
          
          {(place.district || place.neighborhood) && (
            <div className="flex items-center text-gray-600 mb-4">
              <svg className="w-4 h-4 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              {place.district}{place.neighborhood ? ` • ${place.neighborhood}` : ""}
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
        <div className="space-y-6">{/* Activities (array) */}}
        {place.activities?.length ? (
          <div className="mt-3 text-sm border rounded p-3 bg-blue-50">
            <div className="font-semibold mb-1">Activities</div>
            <ul className="space-y-1">
              {place.activities.map((a) => (
                <li key={a.id}>
                  <span className="font-medium">{a.type}</span>
                  {a.attrs && (
                    <span className="text-xs opacity-80">
                      {" "}
                      —{" "}
                      {Object.entries(a.attrs as Record<string, unknown>)
                        .map(([k, v]) => `${k}: ${String(v)}`)
                        .join(" • ")}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {/* Description */}
        {place.description && (
          <div className="prose max-w-none mt-4">
            <p>{place.description}</p>
          </div>
        )}

        {/* Reviews */}
        <h2 className="mt-6 font-semibold">Reviews</h2>
        <ul className="space-y-2 mt-2">
          {reviews.length ? (
            reviews.map((r) => (
              <li key={r.id} className="border rounded p-2">
                <div className="text-sm">⭐ {r.rating ?? "—"}</div>
                {r.body && <div className="text-sm mt-1">{r.body}</div>}
                {Array.isArray(r.tags) && r.tags.length ? (
                  <div className="text-xs mt-1 opacity-70">{(r.tags as string[]).join(", ")}</div>
                ) : null}
              </li>
            ))
          ) : (
            <li className="text-sm opacity-70">No reviews yet.</li>
          )}
        </ul>
      </div>

      {/* Sidebar */}
      <div className="md:col-span-1">
  {photos.length > 0 && <PhotoStrip urls={photos} />}

        {place.website && (
          <a href={place.website} target="_blank" className="block mt-3 text-brand-600 underline">
            Website
          </a>
        )}

        <Link href="/submit" className="block mt-3 underline">
          Suggest an edit
        </Link>
      </div>
    </div>
  );
}

// PhotoStrip is now a separate client component
