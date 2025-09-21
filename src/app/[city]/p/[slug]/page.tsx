import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import PhotoStrip from "@/components/PhotoStrip";
import StarRating from "@/components/StarRating";
import ReviewsList from "@/components/ReviewsList";
import ReviewForm from "@/components/ReviewForm";
import PlaceHeader from "@/components/PlaceHeader";
import PlaceMap from "@/components/PlaceMap";

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

export default async function PlaceDetailPage({
  params,
}: {
  params: Promise<{ city: string; slug: string }>;
}) {
  const { city: citySlug, slug } = await params;
  const session = await getServerSession(authOptions);

  const place = await prisma.place.findFirst({
    where: {
      slug,
      city: {
        slug: citySlug,
        active: true,
      },
    },
    include: {
      city: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
  });

  if (!place) {
    notFound();
  }

  // Check if user has favorited this place
  let isFavorited = false;
  if (session && (session.user as any)?.id) {
    const favorite = await prisma.favorite.findFirst({
      where: {
        userId: (session.user as any).id,
        placeId: place.id,
      },
    });
    isFavorited = !!favorite;
  }

  const amenities = toStringArray(place.amenities);
  const tags = toStringArray(place.tags);
  const gallery = Array.isArray(place.gallery)
    ? place.gallery.filter((item): item is string => typeof item === "string")
    : [];

  const description = place.fullDescription || place.shortDescription;

  return (
    <div className="space-y-8">
      <Link
        href={`/${citySlug}`}
        className="inline-flex items-center gap-2 text-sm text-slate-600 transition-colors hover:text-blue-600"
      >
        <span aria-hidden="true">←</span>
        Back to {place.city.name}
      </Link>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="relative h-80 w-full bg-slate-100 sm:h-96">
          <img
            src={place.imageUrl || "https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=1600&q=80"}
            alt={place.name}
            className="h-full w-full object-cover"
          />
          <PlaceHeader
            place={{
              id: place.id,
              name: place.name,
              type: place.type,
              rating: place.rating,
              dogFriendlyLevel: place.dogFriendlyLevel,
            }}
            cityName={place.city.name}
            isFavorited={isFavorited}
            session={session}
          />
        </div>

        <div className="grid gap-8 p-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:p-10">
          <div className="space-y-8">
            {description && (
              <section className="space-y-3">
                <h2 className="heading-md">About this place</h2>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{description}</p>
              </section>
            )}

            {amenities.length > 0 && (
              <section className="space-y-3">
                <h2 className="heading-md">Amenities</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3 text-sm text-blue-800">
                      <span aria-hidden="true">✅</span>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {tags.length > 0 && (
              <section className="space-y-3">
                <h2 className="heading-md">Good to know</h2>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-slate-200 px-3 py-1 text-xs uppercase tracking-wide text-slate-600">
                      {tag}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {gallery.length > 0 && (
              <section className="space-y-3">
                <h2 className="heading-md">Gallery</h2>
                <PhotoStrip urls={gallery} />
              </section>
            )}
          </div>

          <aside className="space-y-6 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-slate-900">Quick facts</h2>
              <dl className="space-y-2 text-sm text-slate-600">
                <div className="flex justify-between">
                  <dt className="font-medium">Type</dt>
                  <dd>{friendlyType(place.type)}</dd>
                </div>
                {typeof place.rating === "number" && (
                  <div className="flex items-center justify-between">
                    <dt className="font-medium">Rating</dt>
                    <dd className="flex items-center gap-2">
                      <StarRating rating={place.rating} readonly size="sm" />
                      <span className="text-sm">{place.rating.toFixed(1)}</span>
                    </dd>
                  </div>
                )}
                {place.openingHours && (
                  <div className="flex justify-between">
                    <dt className="font-medium">Opening hours</dt>
                    <dd className="text-right">{place.openingHours}</dd>
                  </div>
                )}
                {place.priceRange && (
                  <div className="flex justify-between">
                    <dt className="font-medium">Price range</dt>
                    <dd>{place.priceRange}</dd>
                  </div>
                )}
                {place.websiteUrl && (
                  <div className="flex justify-between">
                    <dt className="font-medium">Website</dt>
                    <dd>
                      <a
                        href={place.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Visit site
                      </a>
                    </dd>
                  </div>
                )}
                {place.phone && (
                  <div className="flex justify-between">
                    <dt className="font-medium">Phone</dt>
                    <dd>
                      <a href={`tel:${place.phone}`} className="text-blue-600 hover:underline">
                        {place.phone}
                      </a>
                    </dd>
                  </div>
                )}
                {place.region && (
                  <div className="flex justify-between">
                    <dt className="font-medium">Region</dt>
                    <dd>{place.region}</dd>
                  </div>
                )}
                {place.lat != null && place.lng != null && (
                  <div className="space-y-3">
                    <dt className="font-medium">Location</dt>
                    <dd className="text-sm text-slate-600">
                      {place.lat.toFixed(4)}, {place.lng.toFixed(4)}
                    </dd>
                    <dd>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Open in Maps
                      </a>
                    </dd>
                    <dd className="pt-2">
                      <PlaceMap places={[{
                        id: place.id,
                        name: place.name,
                        type: place.type,
                        lat: place.lat,
                        lng: place.lng
                      }]} />
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="space-y-3 text-sm text-slate-600">
              <p>Share your experience to help other dog guardians.</p>
              <Link
                href="/submit"
                className="inline-flex items-center justify-center rounded-full border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 transition-colors hover:border-blue-300 hover:bg-blue-50"
              >
                Suggest an update
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-display font-bold text-slate-900">Reviews & Experiences</h2>
        </div>
        
        <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <ReviewsList placeId={place.id} />
          
          <aside className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Share Your Experience</h3>
              <ReviewForm placeId={place.id} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
