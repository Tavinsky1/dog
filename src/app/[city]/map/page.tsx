"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Map, { Marker, NavigationControl, Popup } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import Link from "next/link";
import { useParams } from "next/navigation";

type Place = {
  id: string;
  name: string;
  type: string;
  lat?: number | null;
  lng?: number | null;
  district?: string | null;
  neighborhood?: string | null;
  rating?: number | null;
};

type ApiList = { total: number; page: number; limit: number; items: Place[] };

function useQueryParam(name: string) {
  const [value, set] = useState<string | null>(null);
  useEffect(() => {
    const url = new URL(window.location.href);
    set(url.searchParams.get(name));
  }, []);
  return value;
}

export default function CityMapPage() {
  const params = useParams();
  const citySlug = params.city as string;
  const category = useQueryParam("category"); // optional
  const q = useQueryParam("q");               // optional
  const radiusKmParam = useQueryParam("radiusKm"); // optional
  const [data, setData] = useState<ApiList>({ total: 0, page: 1, limit: 500, items: [] });
  const [popup, setPopup] = useState<Place | null>(null);

  // geolocate (optional)
  const [geo, setGeo] = useState<{lat:number;lng:number}|null>(null);
  useEffect(() => {
    if (!radiusKmParam) return;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setGeo({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setGeo(null),
        { enableHighAccuracy: true, maximumAge: 30_000, timeout: 10_000 }
      );
    }
  }, [radiusKmParam]);

  function load() {
    const url = new URL("/api/places", window.location.origin);
    url.searchParams.set("city", citySlug);
    url.searchParams.set("limit", "500");
    if (category) url.searchParams.set("category", category);
    if (q) url.searchParams.set("q", q);
    url.searchParams.set("sort", "rating");
    if (geo && radiusKmParam) {
      url.searchParams.set("lat", String(geo.lat));
      url.searchParams.set("lng", String(geo.lng));
      url.searchParams.set("radiusKm", radiusKmParam || "5");
    }
    fetch(url.toString()).then(r => r.json()).then(setData);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, q, JSON.stringify(geo), radiusKmParam, citySlug]);

  const firstWithCoords = useMemo(
    () => data.items.find(p => p.lat && p.lng),
    [data.items]
  );

  // mapRef is used to call resize() when layout or data changes to ensure tiles fill the container
  const mapRef = useRef<any | null>(null);

  useEffect(() => {
    // When data loads, map size might need to be recalculated — give the map a moment then resize
    if (!mapRef.current) return;
    try {
      // A tiny delay helps when the map's container was just added to the DOM
      setTimeout(() => mapRef.current.resize?.(), 100);
    } catch (err) {
      // ignore
    }
  }, [data.items.length]);

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 h-[70vh] lg:h-[calc(100vh-10rem)] rounded-2xl border overflow-hidden bg-white">
        <Map
          key={firstWithCoords ? `${firstWithCoords.lat}:${firstWithCoords.lng}` : 'no-center'}
          initialViewState={{
            longitude: firstWithCoords?.lng ?? 13.405,
            latitude: firstWithCoords?.lat ?? 52.52,
            zoom: 11
          }}
          style={{ width: "100%", height: "100%" }}
          mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
          onLoad={(evt:any) => {
            // Save map instance & force initial resize
            mapRef.current = evt.target;
            try { evt.target.resize?.(); } catch (e) {}
          }}
        >
          <NavigationControl position="top-right" />
          {data.items.filter(p => p.lat && p.lng).map(p => (
            <Marker key={p.id} longitude={p.lng!} latitude={p.lat!}>
              <button
                className="w-6 h-6 rounded-full border-2 border-white bg-blue-500 hover:bg-blue-600 shadow-lg transition-colors flex items-center justify-center text-white text-xs font-bold"
                title={p.name}
                onClick={() => setPopup(p)}
                aria-label={`View details for ${p.name}`}
              >
                🐕
              </button>
            </Marker>
          ))}
          {popup && popup.lat && popup.lng && (
            <Popup longitude={popup.lng!} latitude={popup.lat!} onClose={() => setPopup(null)} closeOnClick={false}>
              <div className="p-2 min-w-[200px]">
                <div className="space-y-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{popup.name}</h3>
                    <p className="text-xs text-blue-600 capitalize">
                      {popup.type.replace(/_/g, ' ')}
                    </p>
                  </div>

                  {popup.rating != null && (
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-500 text-sm">⭐</span>
                      <span className="text-sm font-medium">{popup.rating.toFixed(1)}</span>
                    </div>
                  )}

                  {(popup.district || popup.neighborhood) && (
                    <p className="text-xs text-gray-600">
                      {[popup.neighborhood, popup.district].filter(Boolean).join(', ')}
                    </p>
                  )}

                  <div className="flex flex-col space-y-1.5 pt-2 border-t">
                    <Link
                      className="inline-flex items-center justify-center px-2 py-1.5 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
                      href={`/places/${popup.id}`}
                    >
                      View Details
                    </Link>
                    <a
                      className="inline-flex items-center justify-center px-2 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`https://www.google.com/maps/dir/?api=1&destination=${popup.lat},${popup.lng}`}
                    >
                      Get Directions
                    </a>
                  </div>
                </div>
              </div>
            </Popup>
          )}
        </Map>
      </div>

      <div className="space-y-2">
        <div className="rounded-xl p-3 border bg-white">
          <div className="font-semibold">Results on map</div>
          <div className="text-xs opacity-70">{data.total} places</div>
          <div className="mt-2 text-xs">
            {category ? <span className="px-2 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-100">{category.replace(/_/g," ")}</span> : "All categories"}
          </div>
          <div className="mt-2 text-xs">
            {radiusKmParam && geo ? <>Near me: {radiusKmParam} km</> : null}
          </div>
        </div>

        <ul className="space-y-2">
          {data.items.slice(0, 100).map(p => (
            <li key={p.id} className="border rounded-xl p-3 bg-white">
              <div className="text-xs uppercase opacity-60">{p.type.replace(/_/g," ")}</div>
              <Link className="font-semibold hover:text-brand-600" href={`/places/${p.id}`}>{p.name}</Link>
              <div className="text-xs opacity-70">
                {p.rating != null ? <>★ {p.rating.toFixed(1)}</> : "No rating"}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
