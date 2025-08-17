"use client";

import { useEffect, useMemo, useState } from "react";
import Map, { Marker, NavigationControl, Popup } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import Link from "next/link";

type Place = {
  id: string;
  name: string;
  category: string;
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

export default function BerlinMapPage() {
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
    url.searchParams.set("city", "Berlin");
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
  }, [category, q, JSON.stringify(geo), radiusKmParam]);

  const firstWithCoords = useMemo(
    () => data.items.find(p => p.lat && p.lng),
    [data.items]
  );

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 h-[70vh] lg:h-[calc(100vh-10rem)] rounded-2xl border overflow-hidden bg-white">
        <Map
          initialViewState={{
            longitude: firstWithCoords?.lng ?? 13.405,
            latitude: firstWithCoords?.lat ?? 52.52,
            zoom: 11
          }}
          style={{ width: "100%", height: "100%" }}
          mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        >
          <NavigationControl position="top-right" />
          {data.items.filter(p => p.lat && p.lng).map(p => (
            <Marker key={p.id} longitude={p.lng!} latitude={p.lat!}>
              <button
                className="w-3 h-3 rounded-full border border-white bg-brand-500"
                title={p.name}
                onClick={() => setPopup(p)}
              />
            </Marker>
          ))}
          {popup && popup.lat && popup.lng && (
            <Popup longitude={popup.lng!} latitude={popup.lat!} onClose={() => setPopup(null)} closeOnClick={false}>
              <div className="text-sm">
                <div className="font-semibold">{popup.name}</div>
                {popup.rating != null && <div className="text-xs opacity-70">★ {popup.rating.toFixed(1)}</div>}
                <div className="mt-1">
                  <Link className="text-brand-600 underline" href={`/places/${popup.id}`}>Open details</Link>
                </div>
                <div className="mt-1">
                  <a
                    className="text-xs underline"
                    target="_blank"
                    href={`https://www.google.com/maps/dir/?api=1&destination=${popup.lat},${popup.lng}`}
                  >
                    Route
                  </a>
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
              <div className="text-xs uppercase opacity-60">{p.category.replace(/_/g," ")}</div>
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
