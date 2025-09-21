'use client';

import dynamic from "next/dynamic";

const MapClient = dynamic(() => import("@/components/MapClient"), { ssr: false });

interface PlaceMapProps {
  places: Array<{
    id: string;
    name: string;
    type: string;
    lat: number;
    lng: number;
    shortDescription?: string;
    rating?: number;
    imageUrl?: string;
  }>;
  height?: number;
  loading?: boolean;
  error?: string | null;
}

export default function PlaceMap({ places, height = 128, loading = false, error = null }: PlaceMapProps) {
  return (
    <div
      className="w-full overflow-hidden rounded-lg border border-slate-200"
      style={{ height: `${height}px` }}
    >
      <MapClient places={places} loading={loading} error={error} />
    </div>
  );
}