import { PrismaClient } from "@prisma/client";
import type { MetadataRoute } from "next";
import { getCountries } from "@/lib/data";

const prisma = new PrismaClient();

const categories = [
  "cafe_restaurant_bar","park_offleash_area","lake_swim","trail_hike",
  "pet_store_boutique","vet_clinic_hospital","dog_groomer",
  "dog_hotel_boarding","dog_walker_trainer",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://dog-atlas.com";

  // Core pages
  const core: MetadataRoute.Sitemap = [
    { 
      url: `${base}/`, 
      lastModified: new Date(), 
      changeFrequency: "daily", 
      priority: 1.0 
    },
    { 
      url: `${base}/about`, 
      lastModified: new Date(), 
      changeFrequency: "monthly", 
      priority: 0.5 
    },
    { 
      url: `${base}/contact`, 
      lastModified: new Date(), 
      changeFrequency: "monthly", 
      priority: 0.5 
    },
  ];

  // All countries and cities from seed data
  const countries = getCountries();
  const countryAndCityUrls: MetadataRoute.Sitemap = [];

  for (const country of countries) {
    // Add country page
    countryAndCityUrls.push({
      url: `${base}/countries/${country.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    });

    // Add all city pages for this country
    for (const city of country.cities) {
      countryAndCityUrls.push({
        url: `${base}/countries/${country.slug}/${city.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.9,
      });

      // Add category pages for popular cities
      if (city.placeCount && city.placeCount > 20) {
        const cityCategories = ['parks', 'cafes_restaurants', 'walks_trails', 'accommodation', 'shops_services'];
        for (const cat of cityCategories) {
          countryAndCityUrls.push({
            url: `${base}/countries/${country.slug}/${city.slug}?category=${cat}`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.7,
          });
        }
      }
    }
  }

  // Legacy Berlin category pages
  const cats = categories.map((c) => ({
    url: `${base}/berlin/c/${c}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // Include places from database
  try {
    const places = await prisma.place.findMany({
      select: { id: true, updatedAt: true, cityId: true },
      orderBy: { updatedAt: "desc" },
      take: 1000, // Increased from 500 to include more places
    });

    const placeUrls: MetadataRoute.Sitemap = places.map((p) => ({
      url: `${base}/places/${p.id}`,
      lastModified: p.updatedAt ?? new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    return [...core, ...countryAndCityUrls, ...cats, ...placeUrls];
  } catch (error) {
    console.error('Error fetching places for sitemap:', error);
    // Return without database places if there's an error
    return [...core, ...countryAndCityUrls, ...cats];
  }
}
