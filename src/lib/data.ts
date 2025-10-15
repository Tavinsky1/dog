/**
 * Data Access Layer
 * 
 * Provides unified access to:
 * - countries.json (authoritative source for countries/cities)
 * - places.seed.json (file-based place data)
 * - Prisma database (production place data)
 * 
 * Uses file-based seeds initially, migrates to DB later without changing API.
 */

import fs from 'fs';
import path from 'path';
import { prisma } from './prisma';

// Types matching our data structure
export interface Country {
  iso: string;
  name: string;
  slug: string;
  flag: string;
  continent: string;
  coordinates: [number, number];
  timezone: string;
  currency: string;
  language: string;
  cities: City[];
}

export interface City {
  id: string;
  name: string;
  slug: string;
  coordinates: [number, number];
  timezone: string;
  population?: number;
  description: string;
  placeCount: number;
  image?: string; // Emblematic city landmark image
  dogRules?: string; // Local dog regulations and rules
  categories: {
    cafes_restaurants: number;
    parks: number;
    trails: number;
    hotels: number;
    vets: number;
    shops: number;
    groomers: number;
    trainers: number;
    beaches: number;
  };
}

export interface Place {
  id: string;
  country: string;
  city: string;
  name: string;
  category: string;
  lat: number;
  lon: number;
  address?: string;
  website?: string;
  phone?: string;
  description?: string;
  photos: string[];
  verified: boolean;
  rating?: number;
  reviewCount?: number;
}

export interface CountriesData {
  countries: Country[];
  metadata: {
    version: string;
    totalCountries: number;
    totalCities: number;
    lastUpdated: string;
  };
}

// Cache for file reads
let countriesCache: CountriesData | null = null;
let placesCache: Place[] | null = null;

/**
 * Get all countries from countries.json
 */
export function getCountries(): Country[] {
  if (!countriesCache) {
    const countriesPath = path.join(process.cwd(), 'data', 'countries.json');
    countriesCache = JSON.parse(fs.readFileSync(countriesPath, 'utf-8'));
  }
  return countriesCache!.countries;
}

/**
 * Get a single country by slug
 */
export function getCountry(slug: string): Country | undefined {
  return getCountries().find(c => c.slug === slug);
}

/**
 * Get all cities for a country
 */
export function getCities(countrySlug: string): City[] {
  const country = getCountry(countrySlug);
  return country?.cities || [];
}

/**
 * Get a single city by country and city slug
 */
export function getCity(countrySlug: string, citySlug: string): City | undefined {
  const cities = getCities(countrySlug);
  return cities.find(c => c.slug === citySlug);
}

/**
 * Get all places from seed file
 */
function getPlacesSeed(): Place[] {
  if (!placesCache) {
    const placesPath = path.join(process.cwd(), 'data', 'places.seed.json');
    
    // Return empty array if seed file doesn't exist yet
    if (!fs.existsSync(placesPath)) {
      return [];
    }
    
    placesCache = JSON.parse(fs.readFileSync(placesPath, 'utf-8'));
  }
  return placesCache || [];
}

/**
 * Get places for a specific country/city/category
 * 
 * @param countrySlug - Country slug (e.g., 'united-states')
 * @param citySlug - City slug (e.g., 'new-york')
 * @param category - Optional category filter
 * @param useDatabase - If true, query Prisma instead of seed file
 */
export async function getPlaces(
  countrySlug: string,
  citySlug: string,
  category?: string,
  useDatabase: boolean = false
): Promise<Place[]> {
  if (useDatabase) {
    // Query Prisma database (for production)
    const places = await prisma.place.findMany({
      where: {
        city: {
          slug: citySlug,
          country: countrySlug,
        },
        ...(category && { type: category as any }),
      },
      select: {
        id: true,
        name: true,
        type: true,
        lat: true,
        lng: true,
        websiteUrl: true,
        phone: true,
        shortDescription: true,
        imageUrl: true,
        city: {
          select: {
            slug: true,
            country: true,
          },
        },
      },
    });

    return places.map(p => ({
      id: p.id,
      country: p.city.country,
      city: p.city.slug,
      name: p.name,
      category: p.type,
      lat: p.lat,
      lon: p.lng,
      website: p.websiteUrl || undefined,
      phone: p.phone || undefined,
      description: p.shortDescription || undefined,
      photos: p.imageUrl ? [p.imageUrl] : [],
      verified: true,
    }));
  }

  // Use seed file (for development / new cities)
  const allPlaces = getPlacesSeed();
  return allPlaces.filter(p => {
    const matchesCountry = p.country === countrySlug;
    const matchesCity = p.city === citySlug;
    const matchesCategory = !category || p.category === category;
    return matchesCountry && matchesCity && matchesCategory;
  });
}

/**
 * Get place by ID from either seed or database
 */
export async function getPlace(
  id: string,
  useDatabase: boolean = false
): Promise<Place | null> {
  if (useDatabase) {
    const place = await prisma.place.findUnique({
      where: { id },
      include: {
        city: {
          select: {
            slug: true,
            country: true,
          },
        },
      },
    });

    if (!place) return null;

    return {
      id: place.id,
      country: place.city.country,
      city: place.city.slug,
      name: place.name,
      category: place.type,
      lat: place.lat,
      lon: place.lng,
      website: place.websiteUrl || undefined,
      phone: place.phone || undefined,
      description: place.shortDescription || undefined,
      photos: place.imageUrl ? [place.imageUrl] : [],
      verified: true,
    };
  }

  const places = getPlacesSeed();
  return places.find(p => p.id === id) || null;
}

/**
 * Get stats for homepage
 */
export async function getStats(useDatabase: boolean = false) {
  const countries = getCountries();
  const totalCities = countries.reduce((sum, c) => sum + c.cities.length, 0);

  if (useDatabase) {
    const placesCount = await prisma.place.count();

    return {
      countries: countries.length,
      cities: totalCities,
      places: placesCount,
      verified: placesCount, // All DB places are verified
    };
  }

  // From seed file
  const places = getPlacesSeed();
  return {
    countries: countries.length,
    cities: totalCities,
    places: places.length,
    verified: places.filter(p => p.verified).length,
  };
}

/**
 * Search places across all locations
 */
export async function searchPlaces(
  query: string,
  useDatabase: boolean = false
): Promise<Place[]> {
  const lowerQuery = query.toLowerCase();

  if (useDatabase) {
    const places = await prisma.place.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { shortDescription: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        city: {
          select: {
            slug: true,
            country: true,
          },
        },
      },
      take: 50,
    });

    return places.map(p => ({
      id: p.id,
      country: p.city.country,
      city: p.city.slug,
      name: p.name,
      category: p.type,
      lat: p.lat,
      lon: p.lng,
      website: p.websiteUrl || undefined,
      phone: p.phone || undefined,
      description: p.shortDescription || undefined,
      photos: p.imageUrl ? [p.imageUrl] : [],
      verified: true,
    }));
  }

  // Search seed file
  const places = getPlacesSeed();
  return places.filter(p => {
    return (
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description?.toLowerCase().includes(lowerQuery) ||
      p.address?.toLowerCase().includes(lowerQuery)
    );
  }).slice(0, 50);
}

/**
 * Clear caches (useful for development)
 */
export function clearCaches() {
  countriesCache = null;
  placesCache = null;
}
