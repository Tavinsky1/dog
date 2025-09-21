import Link from "next/link";
import { notFound } from "next/navigation";
import Map from "@/components/Map";
import ItineraryGenerator from "@/components/ItineraryGenerator";
import { prisma } from "@/lib/prisma";

const FALLBACK_IMAGES: Record<string, string> = {
  // Recreation & Exercise
  park_offleash_area: "https://images.unsplash.com/photo-1544717684-7ad52a7bf8e1?auto=format&fit=crop&w=800&q=80",
  park_onleash_area: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=800&q=80",
  trail_hiking: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=80",
  trail_walking: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80",
  beach_dog_friendly: "https://images.unsplash.com/photo-1517638851339-4aa32003c11a?auto=format&fit=crop&w=800&q=80",
  lake_dog_friendly: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=800&q=80",
  
  // Food & Drink
  cafe_dog_friendly: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80",
  restaurant_dog_friendly: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
  brewery_dog_friendly: "https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=800&q=80",
  
  // Services
  vet_clinic: "https://images.unsplash.com/photo-1629901925121-8a141c2a42f4?auto=format&fit=crop&w=800&q=80",
  vet_emergency: "https://images.unsplash.com/photo-1581888227599-779811939961?auto=format&fit=crop&w=800&q=80",
  grooming_salon: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80",
  grooming_mobile: "https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?auto=format&fit=crop&w=800&q=80",
  pet_store: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80",
  doggy_daycare: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80",
  dog_training: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80",
  
  // Accommodation
  hotel_pet_friendly: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
  hostel_pet_friendly: "https://images.unsplash.com/photo-1586611292717-f828b167408c?auto=format&fit=crop&w=800&q=80",
  apartment_pet_friendly: "https://images.unsplash.com/photo-1502920514313-52581002a659?auto=format&fit=crop&w=800&q=80",
  
  // Activities & Events
  dog_park_event: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80",
  dog_training_class: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80",
  dog_meetup: "https://images.unsplash.com/photo-1544717684-7ad52a7bf8e1?auto=format&fit=crop&w=800&q=80",
  pet_expo: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80",
  
  // Specialty
  dog_spa: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80",
  pet_photography: "https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?auto=format&fit=crop&w=800&q=80",
  dog_taxi: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80",
  pet_cemetery: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=800&q=80",
  
  // Legacy fallbacks
  park: "https://images.unsplash.com/photo-1544717684-7ad52a7bf8e1?auto=format&fit=crop&w=800&q=80",
  trail: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=80",
  cafe: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80",
  beach: "https://images.unsplash.com/photo-1517638851339-4aa32003c11a?auto=format&fit=crop&w=800&q=80",
  activity: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80",
  hotel: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
  store: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80",
  vet: "https://images.unsplash.com/photo-1629901925121-8a141c2a42f4?auto=format&fit=crop&w=800&q=80",
  grooming: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80",
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
    // Recreation & Exercise
    park_offleash_area: "Recreation & Exercise",
    park_onleash_area: "Recreation & Exercise",
    trail_hiking: "Recreation & Exercise",
    trail_walking: "Recreation & Exercise",
    beach_dog_friendly: "Recreation & Exercise",
    lake_dog_friendly: "Recreation & Exercise",
    
    // Food & Drink
    cafe_dog_friendly: "Food & Drink",
    restaurant_dog_friendly: "Food & Drink",
    brewery_dog_friendly: "Food & Drink",
    
    // Services
    vet_clinic: "Services",
    vet_emergency: "Services",
    grooming_salon: "Services",
    grooming_mobile: "Services",
    pet_store: "Services",
    doggy_daycare: "Services",
    dog_training: "Services",
    
    // Accommodation
    hotel_pet_friendly: "Accommodation",
    hostel_pet_friendly: "Accommodation",
    apartment_pet_friendly: "Accommodation",
    
    // Activities & Events
    dog_park_event: "Activities & Events",
    dog_training_class: "Activities & Events",
    dog_meetup: "Activities & Events",
    pet_expo: "Activities & Events",
    
    // Specialty
    dog_spa: "Specialty",
    pet_photography: "Specialty",
    dog_taxi: "Specialty",
    pet_cemetery: "Specialty",
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

export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city: citySlug } = await params;

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

  const groupedPlaces = groupPlacesByCategory(places);

  const typeSummary = Object.entries(
    places.reduce<Record<string, number>>((acc, place) => {
      acc[place.type] = (acc[place.type] ?? 0) + 1;
      return acc;
    }, {})
  )
    .sort(([, aCount], [, bCount]) => bCount - aCount)
    .slice(0, 4);

  const mapPlaces = places
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
          {places.length > 0 ? (
            <ItineraryGenerator
              city={{ name: city.name, slug: citySlug }}
              places={places.map((place) => ({
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
          {places.length === 0 && (
            <div className="card p-6 text-sm text-slate-500">
              We are still collecting dog-friendly spots in {city.name}. Know a great one? <Link href="/submit" className="text-blue-600 hover:underline">Share it with the community</Link>.
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
