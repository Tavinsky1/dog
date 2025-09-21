"use client";

import { useState } from "react";

type PlaceSummary = {
  id: string;
  name: string;
  type: string;
  shortDescription?: string | null;
};

type Segment = {
  title: string;
  description: string;
};

export default function ItineraryGenerator({
  city,
  places,
}: {
  city: { name: string; slug: string };
  places: PlaceSummary[];
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [segments, setSegments] = useState<Segment[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleGenerate() {
    if (!places.length) return;

    setStatus("loading");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city,
          places: places.map((place) => ({
            id: place.id,
            name: place.name,
            type: place.type,
            shortDescription: place.shortDescription,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("We could not generate an itinerary right now.");
      }

      const payload = (await response.json()) as { segments?: Segment[] };
      if (!payload.segments?.length) {
        throw new Error("We did not receive any ideas this time.");
      }

      setSegments(payload.segments);
      setStatus("ready");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong.");
      setStatus("error");
    }
  }

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="heading-md">Need a plan?</h2>
          <p className="text-sm text-slate-600">
            Generate a playful one-day itinerary for exploring {city.name} with your dog.
          </p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={status === "loading" || !places.length}
          className="btn-primary disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {status === "loading" ? "Generating…" : "Generate itinerary"}
        </button>
      </div>

      {status === "error" && errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {errorMessage}
        </div>
      )}

      {status === "loading" && (
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <span className="loading-spinner" aria-hidden="true" />
          Crafting ideas…
        </div>
      )}

      {status === "ready" && (
        <div className="space-y-4">
          {segments.map((segment) => (
            <div key={segment.title} className="rounded-xl border border-blue-100 bg-blue-50/60 p-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-blue-700">
                {segment.title}
              </h3>
              <p className="mt-2 text-sm text-slate-700">{segment.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
