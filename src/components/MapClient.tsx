"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";
import "leaflet/dist/leaflet.css";

type PlaceMarker = {
  id: string;
  name: string;
  type: string;
  lat: number;
  lng: number;
  shortDescription?: string;
  rating?: number;
  imageUrl?: string;
};

// Custom marker icons based on place type
const createCustomIcon = (type: string) => {
  const getIcon = () => {
    switch (type) {
      case 'parks':
        return '🏞️';
      case 'cafes_restaurants':
        return '🍽️';
      case 'accommodation':
        return '�';
      case 'shops_services':
        return '�';
      case 'walks_trails':
        return '🥾';
      case 'tips_local_info':
        return '💡';
      default:
        return '📍';
    }
  };

  return L.divIcon({
    html: `<div style="
      background: white;
      border: 2px solid #3b82f6;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    ">${getIcon()}</div>`,
    className: 'custom-div-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

function FitBounds({ places }: { places: PlaceMarker[] }) {
  const map = useMap();

  useEffect(() => {
    if (!places?.length) return;
    
    const coordinates = places.map((place) => [place.lat, place.lng] as [number, number]);
    
    // Delay to ensure container is fully rendered before fitting bounds
    const fitMap = () => {
      try {
        // Force container size recalculation
        map.invalidateSize();
        
        if (coordinates.length === 1) {
          map.setView(coordinates[0], 13);
        } else {
          // Use LatLngBounds for more precise fitting
          const bounds = L.latLngBounds(coordinates);
          map.fitBounds(bounds, { 
            padding: [50, 50],
            maxZoom: 15,
            animate: false
          });
        }
      } catch (e) {
        // ignore
      }
    };
    
    // Run immediately and after a short delay for hydration
    fitMap();
    const timer = setTimeout(fitMap, 100);
    
    return () => clearTimeout(timer);
  }, [places, map]);

  return null;
}

interface MapClientProps {
  places: PlaceMarker[];
  loading?: boolean;
  error?: string | null;
  cityCenter?: [number, number];
}

export default function MapClient({ places, loading = false, error = null, cityCenter }: MapClientProps) {
  const markers = places ?? [];
  const center = useMemo<[number, number]>(() => {
    if (markers.length) {
      return [markers[0].lat, markers[0].lng];
    }
    // Use city center if provided, otherwise default to Paris
    return cityCenter || [48.8566, 2.3522];
  }, [markers, cityCenter]);

  const formatPlaceType = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <div className="h-[360px] w-full overflow-hidden rounded-2xl border flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[360px] w-full overflow-hidden rounded-2xl border flex items-center justify-center bg-gray-50">
        <div className="text-center text-red-600">
          <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm">Failed to load map</p>
          <p className="text-xs text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[360px] w-full overflow-hidden rounded-2xl border relative">
      <MapContainer
        center={center}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
        zoomControl={true}
      >
        <TileLayer
          url={process.env.NEXT_PUBLIC_MAP_TILES_URL || "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <FitBounds places={markers} />
        {markers.map((place) => (
          <Marker
            key={place.id}
            position={[place.lat, place.lng]}
            icon={createCustomIcon(place.type)}
          >
            <Popup maxWidth={300} minWidth={250}>
              <div className="space-y-2">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">{place.name}</h3>
                  <p className="text-sm text-blue-600 capitalize">{formatPlaceType(place.type)}</p>
                </div>

                {place.rating && (
                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-sm font-medium">{place.rating.toFixed(1)}</span>
                  </div>
                )}

                {place.shortDescription && (
                  <p className="text-sm text-gray-600 line-clamp-2">{place.shortDescription}</p>
                )}

                <div className="flex flex-col space-y-2 pt-2 border-t">
                  <Link
                    href={`/places/${place.id}`}
                    className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    View Details
                  </Link>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                  >
                    Get Directions
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map Info Panel */}
      {markers.length > 0 && (
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-md text-xs border">
          <div className="font-medium text-gray-800">{markers.length} place{markers.length !== 1 ? 's' : ''}</div>
        </div>
      )}
    </div>
  );
}
