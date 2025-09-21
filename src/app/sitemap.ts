import { PrismaClient } from "@prisma/client";
import type { MetadataRoute } from "next";

const prisma = new PrismaClient();

const categories = [
  "cafe_restaurant_bar","park_offleash_area","lake_swim","trail_hike",
  "pet_store_boutique","vet_clinic_hospital","dog_groomer",
  "dog_hotel_boarding","dog_walker_trainer",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXTAUTH_URL || "http://localhost:3000";

  const cats = categories.map((c) => ({
    url: `${base}/berlin/c/${c}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Include only the most recent 500 places to keep the file lean
  const places = await prisma.place.findMany({
    select: { id: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
    take: 500,
  });

  const placeUrls = places.map((p) => ({
    url: `${base}/places/${p.id}`,
    lastModified: p.updatedAt ?? new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Add the core pages
  const core = [
    { url: `${base}/`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${base}/berlin`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.85 },
  ];

  return [...core, ...cats, ...placeUrls];
}
