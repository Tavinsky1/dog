#!/usr/bin/env ts-node
/**
 * Openverse Candidates Script
 * 
 * Finds CC-licensed images from Openverse bulk dataset as fallback for places
 * without OSM/Wikidata images.
 * 
 * Usage:
 *   npm run openverse-candidates -- --places places.csv --openverse openverse.csv --matches osm_matches.csv --output openverse_candidates.csv
 * 
 * Input formats:
 *   places.csv: slug,name,lat,lon,city,country
 *   openverse.csv: Openverse bulk export with columns: identifier, title, creator, url, thumbnail_url, license, license_version
 *   osm_matches.csv: slug,osm_id,osm_type,name,image_url,wikidata
 * 
 * Output format (openverse_candidates.csv):
 *   slug,openverse_id,title,url,thumbnail_url,author,license,source_url,score
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';
import { fuzzyMatchName, isLicenseAllowed, normalizeLicense } from '../lib/photo-enrichment/image-utils';

interface Place {
  slug: string;
  name: string;
  lat: number;
  lon: number;
  city: string;
  country: string;
}

interface OSMMatch {
  slug: string;
  [key: string]: any;
}

interface OpenverseImage {
  identifier: string;
  title: string;
  creator: string;
  url: string;
  thumbnail_url: string;
  license: string;
  license_version: string;
  foreign_landing_url?: string;
  [key: string]: any;
}

interface OpenverseCandidate {
  slug: string;
  openverse_id: string;
  title: string;
  url: string;
  thumbnail_url: string;
  author: string;
  license: string;
  source_url: string;
  score: number;
}

/**
 * Score candidate image relevance
 */
function scoreCandidate(place: Place, image: OpenverseImage): number {
  let score = 0;
  
  const title = (image.title || '').toLowerCase();
  const placeName = place.name.toLowerCase();
  const city = place.city.toLowerCase();
  const country = place.country.toLowerCase();
  
  // Exact name match
  if (title.includes(placeName)) {
    score += 50;
  }
  
  // Fuzzy name match
  if (fuzzyMatchName(place.name, image.title || '', 0.7)) {
    score += 30;
  }
  
  // City mentioned
  if (title.includes(city)) {
    score += 20;
  }
  
  // Country mentioned
  if (title.includes(country)) {
    score += 10;
  }
  
  // Keywords for place types
  const keywords = ['restaurant', 'cafe', 'bar', 'park', 'hotel', 'shop'];
  for (const keyword of keywords) {
    if (title.includes(keyword)) {
      score += 5;
    }
  }
  
  return score;
}

/**
 * Find candidates for a place
 */
function findCandidates(
  place: Place,
  openverseImages: OpenverseImage[],
  topN = 3
): OpenverseCandidate[] {
  const candidates: Array<OpenverseCandidate & { score: number }> = [];
  
  for (const image of openverseImages) {
    // Validate license
    const fullLicense = image.license_version 
      ? `${image.license}-${image.license_version}`
      : image.license;
    
    if (!isLicenseAllowed(fullLicense)) {
      continue;
    }
    
    const score = scoreCandidate(place, image);
    
    if (score === 0) continue;
    
    candidates.push({
      slug: place.slug,
      openverse_id: image.identifier,
      title: image.title || 'Untitled',
      url: image.url,
      thumbnail_url: image.thumbnail_url || image.url,
      author: image.creator || 'Unknown',
      license: normalizeLicense(fullLicense),
      source_url: image.foreign_landing_url || image.url,
      score
    });
  }
  
  // Sort by score descending and take top N
  candidates.sort((a, b) => b.score - a.score);
  return candidates.slice(0, topN);
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  const placesPath = args[args.indexOf('--places') + 1];
  const openversePath = args[args.indexOf('--openverse') + 1];
  const matchesPath = args[args.indexOf('--matches') + 1];
  const outputPath = args[args.indexOf('--output') + 1] || 'openverse_candidates.csv';
  const topN = parseInt(args[args.indexOf('--top') + 1] || '3', 10);

  if (!placesPath || !openversePath) {
    console.error('Usage: npm run openverse-candidates -- --places <places-csv> --openverse <openverse-csv> [--matches <matches-csv>] [--top 3] [--output <output-csv>]');
    process.exit(1);
  }

  if (!existsSync(placesPath)) {
    console.error(`Places file not found: ${placesPath}`);
    process.exit(1);
  }

  if (!existsSync(openversePath)) {
    console.error(`Openverse file not found: ${openversePath}`);
    console.error('Download from: https://openverse.org/data-sources');
    process.exit(1);
  }

  // Load places
  console.log('Reading places...');
  const placesCSV = readFileSync(placesPath, 'utf-8');
  const places: Place[] = parse(placesCSV, {
    columns: true,
    skip_empty_lines: true,
    cast: (value, context) => {
      if (context.column === 'lat' || context.column === 'lon') {
        return parseFloat(value);
      }
      return value;
    }
  });
  console.log(`Loaded ${places.length} places`);

  // Load existing matches to skip already matched places
  let matchedSlugs = new Set<string>();
  if (matchesPath && existsSync(matchesPath)) {
    console.log('Reading existing OSM matches...');
    const matchesCSV = readFileSync(matchesPath, 'utf-8');
    const matches: OSMMatch[] = parse(matchesCSV, {
      columns: true,
      skip_empty_lines: true
    });
    matchedSlugs = new Set(matches.map(m => m.slug));
    console.log(`${matchedSlugs.size} places already matched`);
  }

  // Filter places that need Openverse candidates
  const placesNeedingImages = places.filter(p => !matchedSlugs.has(p.slug));
  console.log(`${placesNeedingImages.length} places need Openverse candidates`);

  // Load Openverse dataset
  console.log('Loading Openverse dataset...');
  console.log('(This may take a while for large datasets)');
  const openverseCSV = readFileSync(openversePath, 'utf-8');
  const openverseImages: OpenverseImage[] = parse(openverseCSV, {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true
  });
  console.log(`Loaded ${openverseImages.length} Openverse images`);

  // Find candidates for each place
  console.log('\nFinding candidates...');
  const allCandidates: OpenverseCandidate[] = [];

  for (const place of placesNeedingImages) {
    const candidates = findCandidates(place, openverseImages, topN);
    
    if (candidates.length > 0) {
      allCandidates.push(...candidates);
      console.log(`✓ Found ${candidates.length} candidates for ${place.name} (best score: ${candidates[0].score})`);
    } else {
      console.log(`✗ No candidates for ${place.name}`);
    }
  }

  console.log(`\nFound ${allCandidates.length} total candidates for ${placesNeedingImages.length} places`);

  // Write output
  const outputCSV = stringify(allCandidates, {
    header: true,
    columns: ['slug', 'openverse_id', 'title', 'url', 'thumbnail_url', 'author', 'license', 'source_url', 'score']
  });

  writeFileSync(outputPath, outputCSV);
  console.log(`Wrote candidates to: ${outputPath}`);
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
