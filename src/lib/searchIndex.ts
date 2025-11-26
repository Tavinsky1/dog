/**
 * Search Index Builder for DogAtlas
 * 
 * Generates a searchable index from countries, cities, and places.
 * Supports fuzzy matching, category filtering, and relevance scoring.
 * 
 * Usage:
 * - Server-side: await buildSearchIndex()
 * - Client-side: Use search API endpoint
 */

import { getCountries, getCities, getPlaces } from './data';

// Cache the index to avoid rebuilding on every search
let indexCache: SearchIndex | null = null;
let lastBuildTime: number = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export interface SearchablePlace {
  id: string;
  name: string;
  description: string;
  category: string;
  country: string;
  countryName: string;
  city: string;
  cityName: string;
  lat: number;
  lon: number;
  verified: boolean;
  photos: string[];
  // Computed fields for search
  searchText: string; // Combined text for fuzzy matching
  keywords: string[]; // Extracted keywords
}

export interface SearchIndex {
  places: SearchablePlace[];
  countries: Array<{ slug: string; name: string; cities: number; flag: string }>;
  cities: Array<{ slug: string; name: string; country: string; places: number }>;
  categories: Array<{ slug: string; name: string; count: number }>;
  version: string;
  updatedAt: string;
}

/**
 * Extract keywords from text for better search matching
 */
function extractKeywords(text: string): string[] {
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'with', 'by']);
  
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ') // Remove punctuation
    .split(/\s+/) // Split on whitespace
    .filter(word => word.length > 2 && !stopWords.has(word)) // Remove short words and stop words
    .filter((word, index, arr) => arr.indexOf(word) === index); // Remove duplicates
}

/**
 * Calculate fuzzy match score (0-1, higher is better)
 * Uses Levenshtein-like approach
 */
function fuzzyMatchScore(query: string, text: string): number {
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  
  // Exact match
  if (t === q) return 1.0;
  
  // Starts with query
  if (t.startsWith(q)) return 0.9;
  
  // Contains query
  if (t.includes(q)) return 0.7;
  
  // Word starts with query
  const words = t.split(/\s+/);
  if (words.some(w => w.startsWith(q))) return 0.6;
  
  // Character overlap (simple fuzzy)
  const overlap = Array.from(q).filter(c => t.includes(c)).length;
  const ratio = overlap / q.length;
  return ratio > 0.5 ? ratio * 0.5 : 0;
}

/**
 * Build the complete search index (with caching)
 */
export async function buildSearchIndex(): Promise<SearchIndex> {
  // Return cached index if valid
  const now = Date.now();
  if (indexCache && (now - lastBuildTime) < CACHE_TTL) {
    return indexCache;
  }
  
  console.log('🔍 Building search index...');
  
  const countries = await getCountries();
  const allPlaces: SearchablePlace[] = [];
  const cityIndex: SearchIndex['cities'] = [];
  const categoryCount: Map<string, number> = new Map();
  
  // Process each country and its cities
  for (const country of countries) {
    const cities = await getCities(country.slug);
    
    for (const city of cities) {
      const places = await getPlaces(country.slug, city.slug);
      
      cityIndex.push({
        slug: city.slug,
        name: city.name,
        country: country.slug,
        places: places.length,
      });
      
      // Process each place
      for (const place of places) {
        // Count categories
        const currentCount = categoryCount.get(place.category) || 0;
        categoryCount.set(place.category, currentCount + 1);
        
        // Build searchable text
        const searchText = [
          place.name,
          place.description || '',
          place.category,
          city.name,
          country.name,
        ].join(' ').toLowerCase();
        
        // Extract keywords
        const keywords = extractKeywords(searchText);
        
        allPlaces.push({
          id: place.id,
          name: place.name,
          description: place.description || '',
          category: place.category,
          country: country.slug,
          countryName: country.name,
          city: city.slug,
          cityName: city.name,
          lat: place.lat,
          lon: place.lon,
          verified: place.verified || false,
          photos: place.photos || [],
          searchText,
          keywords,
        });
      }
    }
  }
  
  // Build category index
  const categories = Array.from(categoryCount.entries()).map(([slug, count]) => ({
    slug,
    name: slug.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    count,
  })).sort((a, b) => b.count - a.count);
  
  const index: SearchIndex = {
    places: allPlaces,
    countries: countries.map(c => ({
      slug: c.slug,
      name: c.name,
      cities: c.cities?.length || 0,
      flag: c.flag || '',
    })),
    cities: cityIndex,
    categories,
    version: '1.0.0',
    updatedAt: new Date().toISOString(),
  };
  
  // Cache the index
  indexCache = index;
  lastBuildTime = Date.now();
  
  console.log(`✅ Search index built: ${index.places.length} places, ${index.cities.length} cities, ${index.countries.length} countries`);
  
  return index;
}

/**
 * Search places with fuzzy matching and relevance scoring
 */
export interface SearchOptions {
  query: string;
  category?: string;
  country?: string;
  city?: string;
  verified?: boolean;
  limit?: number;
  minScore?: number;
}

export interface SearchResult extends SearchablePlace {
  score: number; // Relevance score (0-1)
  matchedFields: string[]; // Which fields matched
}

export async function searchPlaces(options: SearchOptions): Promise<SearchResult[]> {
  const {
    query,
    category,
    country,
    city,
    verified,
    limit = 20,
    minScore = 0.3,
  } = options;
  
  const index = await buildSearchIndex();
  const results: SearchResult[] = [];
  
  // Filter by category/country/city/verified
  let candidates = index.places;
  
  if (category) {
    candidates = candidates.filter(p => p.category === category);
  }
  
  if (country) {
    candidates = candidates.filter(p => p.country === country);
  }
  
  if (city) {
    candidates = candidates.filter(p => p.city === city);
  }
  
  if (verified !== undefined) {
    candidates = candidates.filter(p => p.verified === verified);
  }
  
  // Score each candidate
  for (const place of candidates) {
    const matchedFields: string[] = [];
    let score = 0;
    
    // Name match (highest weight)
    const nameScore = fuzzyMatchScore(query, place.name);
    if (nameScore > 0) {
      score += nameScore * 3;
      matchedFields.push('name');
    }
    
    // Description match
    const descScore = fuzzyMatchScore(query, place.description);
    if (descScore > 0) {
      score += descScore * 1.5;
      matchedFields.push('description');
    }
    
    // City match
    const cityScore = fuzzyMatchScore(query, place.cityName);
    if (cityScore > 0) {
      score += cityScore * 2;
      matchedFields.push('city');
    }
    
    // Country match
    const countryScore = fuzzyMatchScore(query, place.countryName);
    if (countryScore > 0) {
      score += countryScore * 1;
      matchedFields.push('country');
    }
    
    // Keyword match
    const queryKeywords = extractKeywords(query);
    const keywordMatches = queryKeywords.filter(kw => 
      place.keywords.some(pk => pk.includes(kw) || kw.includes(pk))
    );
    if (keywordMatches.length > 0) {
      score += (keywordMatches.length / queryKeywords.length) * 1;
      matchedFields.push('keywords');
    }
    
    // Normalize score (max possible is ~8.5)
    const normalizedScore = Math.min(score / 8.5, 1);
    
    // Boost verified places slightly
    const finalScore = place.verified ? normalizedScore * 1.1 : normalizedScore;
    
    if (finalScore >= minScore) {
      results.push({
        ...place,
        score: finalScore,
        matchedFields,
      });
    }
  }
  
  // Sort by score (descending) and limit
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Get search suggestions (for autocomplete)
 */
export async function getSearchSuggestions(query: string, limit: number = 5): Promise<string[]> {
  if (query.length < 2) return [];
  
  const index = await buildSearchIndex();
  const suggestions = new Set<string>();
  
  const q = query.toLowerCase();
  
  // Add place names
  for (const place of index.places) {
    if (place.name.toLowerCase().includes(q)) {
      suggestions.add(place.name);
    }
  }
  
  // Add city names
  for (const city of index.cities) {
    if (city.name.toLowerCase().includes(q)) {
      suggestions.add(city.name);
    }
  }
  
  // Add country names
  for (const country of index.countries) {
    if (country.name.toLowerCase().includes(q)) {
      suggestions.add(country.name);
    }
  }
  
  return Array.from(suggestions).slice(0, limit);
}
