'use client';

import StarRating from "@/components/StarRating";
import FavoriteButton from "@/components/FavoriteButton";

interface PlaceHeaderProps {
  place: {
    id: string;
    name: string;
    type: string;
    rating?: number | null;
    dogFriendlyLevel?: number | null;
  };
  cityName: string;
  isFavorited: boolean;
  session: any;
}

function friendlyType(type: string) {
  return type
    .replace(/_/g, " ")
    .split(" ")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

export default function PlaceHeader({ place, cityName, isFavorited, session }: PlaceHeaderProps) {
  return (
    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent p-6 text-white">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-100">
            {friendlyType(place.type)} in {cityName}
          </p>
          <h1 className="mt-1 text-4xl font-display font-bold leading-tight">{place.name}</h1>
          {typeof place.rating === "number" && (
            <div className="mt-2 flex items-center gap-2">
              <StarRating rating={place.rating} readonly size="sm" />
              <span className="text-sm font-medium text-blue-100">
                {place.rating.toFixed(1)} stars
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-3">
          {typeof place.dogFriendlyLevel === "number" && (
            <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-semibold">
              Dog-friendly level {place.dogFriendlyLevel}/5
            </span>
          )}
          {session?.user && (
            <FavoriteButton
              placeId={place.id}
              initialIsFavorited={isFavorited}
            />
          )}
        </div>
      </div>
    </div>
  );
}