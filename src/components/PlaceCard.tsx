'use client';

import Link from "next/link";
import FavoriteButton from "./FavoriteButton";
import PlaceBadges from "./PlaceBadges";

type DogSizeAllowed = "all" | "small_only" | "small_medium" | "large_ok";

type Place = {
  id: string;
  slug: string;
  name: string;
  type: string;
  shortDescription: string | null;
  dogFriendlyLevel?: number | null;
  imageUrl?: string | null;
  rating?: number | null;
  city: {
    slug: string;
  };
  // New dog-specific attributes
  dogSizeAllowed?: DogSizeAllowed | null;
  hasWaterBowl?: boolean | null;
  offLeashAllowed?: boolean | null;
  hasOutdoorSeating?: boolean | null;
  petFee?: string | null;
  maxDogsAllowed?: number | null;
};

interface PlaceCardProps {
  place: Place;
  showFavoriteButton?: boolean;
  isFavorited?: boolean;
}

export default function PlaceCard({ place, showFavoriteButton = false, isFavorited = false }: PlaceCardProps) {
  return (
    <div className="block rounded-xl border border-slate-200 bg-white p-4 hover:shadow-md transition-shadow">
      {place.imageUrl && (
        <div className="aspect-video w-full mb-3 rounded-lg overflow-hidden bg-slate-100">
          <img
            src={place.imageUrl}
            alt={place.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <Link
            href={`/${place.city.slug}/p/${place.slug}`}
            className="flex-1 hover:text-blue-600 transition-colors"
          >
            <h3 className="text-lg font-semibold line-clamp-2">{place.name}</h3>
          </Link>
          {place.rating && (
            <div className="flex items-center text-sm text-yellow-600 ml-2">
              <span>★ {place.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs uppercase text-slate-500 bg-slate-100 px-2 py-1 rounded">
            {place.type.replace(/_/g, ' ')}
          </span>
          {place.dogFriendlyLevel && (
            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
              Dog Level {place.dogFriendlyLevel}/5
            </span>
          )}
        </div>

        {/* Dog-specific attribute badges */}
        <PlaceBadges
          dogSizeAllowed={place.dogSizeAllowed}
          hasWaterBowl={place.hasWaterBowl}
          offLeashAllowed={place.offLeashAllowed}
          hasOutdoorSeating={place.hasOutdoorSeating}
          petFee={place.petFee}
          variant="compact"
        />

        {place.shortDescription && (
          <p className="text-sm text-slate-600 line-clamp-2">{place.shortDescription}</p>
        )}

        {showFavoriteButton && (
          <div className="flex justify-end pt-2">
            <FavoriteButton
              placeId={place.id}
              initialIsFavorited={isFavorited}
            />
          </div>
        )}
      </div>
    </div>
  );
}
