#!/usr/bin/env ts-node
/**
 * OSM Matching Script
 * 
 * Matches DogAtlas places with OpenStreetMap POIs from PBF extracts.
 * Uses osmium-tool CLI to filter relevant POIs and fuzzy match by name and proximity.
 * 
 * Usage:
 *   npm run osm-match -- --pbf path/to/city.osm.pbf --places places.csv --output osm_matches.csv
 * 
 * Input CSV format (places.csv):
 *   slug,name,lat,lon,city,country
 * 
 * Output CSV format (osm_matches.csv):
 *   slug,osm_id,osm_type,name,image_url,wikidata
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';
import { fuzzyMatchName, calculateDistance } from '../lib/photo-enrichment/image-utils';

const execAsync = promisify(exec);

interface Place {
  slug: string;
  name: string;
  lat: number;
  lon: number;
  city: string;
  country: string;
}

interface OSMFeature {
  id: string;
  type: 'node' | 'way' | 'relation';
  lat: number;
  lon: number;
  tags: Record<string, string>;
}

interface OSMMatch {
  slug: string;
  osm_id: string;
  osm_type: string;
  name: string;
  image_url?: string;
  wikidata?: string;
}

/**
 * Extract POIs from OSM PBF file using osmium
 */
async function extractPOIsFromPBF(
  pbfPath: string,
  bbox: [number, number, number, number]
): Promise<OSMFeature[]> {
  const [minLon, minLat, maxLon, maxLat] = bbox;
  const tempJsonPath = join(process.cwd(), 'temp', 'osm_extract.json');
  
  // Ensure temp directory exists
  const tempDir = join(process.cwd(), 'temp');
  if (!existsSync(tempDir)) {
    mkdirSync(tempDir, { recursive: true });
  }

  console.log(`Extracting POIs from ${pbfPath} in bbox [${bbox.join(', ')}]...`);

  // Use osmium to extract and convert to JSON
  const cmd = `osmium tags-filter "${pbfPath}" \
    amenity=restaurant,cafe,bar,pub,veterinary,dog_park \
    tourism=attraction,hotel \
    leisure=park,dog_park \
    shop=pet \
    --overwrite -o "${tempJsonPath}" -f geojson -r`;

  try {
    await execAsync(cmd);
  } catch (error) {
    console.error(`osmium command failed: ${error}`);
    throw error;
  }

  if (!existsSync(tempJsonPath)) {
    console.warn('No POIs extracted');
    return [];
  }

  const geojson = JSON.parse(readFileSync(tempJsonPath, 'utf-8'));
  const features: OSMFeature[] = [];

  for (const feature of geojson.features) {
    const { geometry, properties } = feature;
    
    if (!properties || !geometry) continue;

    let lat: number, lon: number;

    if (geometry.type === 'Point') {
      [lon, lat] = geometry.coordinates;
    } else if (geometry.type === 'Polygon' || geometry.type === 'MultiPolygon') {
      // Calculate centroid (simplified)
      const coords = geometry.type === 'Polygon' 
        ? geometry.coordinates[0] 
        : geometry.coordinates[0][0];
      const sum = coords.reduce((acc: [number, number], coord: [number, number]) => {
        return [acc[0] + coord[0], acc[1] + coord[1]];
      }, [0, 0]);
      lon = sum[0] / coords.length;
      lat = sum[1] / coords.length;
    } else {
      continue;
    }

    // Filter by bbox
    if (lat < minLat || lat > maxLat || lon < minLon || lon > maxLon) {
      continue;
    }

    const id = properties['@id'] || properties.id || '';
    const type = id.startsWith('node') ? 'node' : id.startsWith('way') ? 'way' : 'relation';

    features.push({
      id: id.replace(/^(node|way|relation)\//, ''),
      type,
      lat,
      lon,
      tags: properties
    });
  }

  console.log(`Extracted ${features.length} POIs`);
  return features;
}

/**
 * Match a place to OSM features
 */
function matchPlaceToOSM(
  place: Place,
  osmFeatures: OSMFeature[],
  maxDistance = 200 // meters
): OSMMatch | null {
  let bestMatch: { feature: OSMFeature; score: number } | null = null;

  for (const feature of osmFeatures) {
    const distance = calculateDistance(place.lat, place.lon, feature.lat, feature.lon);
    
    if (distance > maxDistance) continue;

    const osmName = feature.tags.name || feature.tags['name:en'] || '';
    if (!osmName) continue;

    // Fuzzy match name
    if (!fuzzyMatchName(place.name, osmName, 0.6)) continue;

    // Score based on distance and name similarity
    const nameMatch = fuzzyMatchName(place.name, osmName, 0) ? 1.0 : 0.7;
    const distanceScore = Math.max(0, 1 - distance / maxDistance);
    const score = nameMatch * 0.7 + distanceScore * 0.3;

    if (!bestMatch || score > bestMatch.score) {
      bestMatch = { feature, score };
    }
  }

  if (!bestMatch) return null;

  const { feature } = bestMatch;
  
  return {
    slug: place.slug,
    osm_id: feature.id,
    osm_type: feature.type,
    name: feature.tags.name || '',
    image_url: feature.tags.image || feature.tags['image:url'] || undefined,
    wikidata: feature.tags.wikidata || undefined
  };
}

/**
 * Calculate bounding box around places
 */
function calculateBBox(places: Place[], padding = 0.05): [number, number, number, number] {
  let minLat = Infinity, maxLat = -Infinity;
  let minLon = Infinity, maxLon = -Infinity;

  for (const place of places) {
    minLat = Math.min(minLat, place.lat);
    maxLat = Math.max(maxLat, place.lat);
    minLon = Math.min(minLon, place.lon);
    maxLon = Math.max(maxLon, place.lon);
  }

  return [
    minLon - padding,
    minLat - padding,
    maxLon + padding,
    maxLat + padding
  ];
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  const pbfPath = args[args.indexOf('--pbf') + 1];
  const placesPath = args[args.indexOf('--places') + 1];
  const outputPath = args[args.indexOf('--output') + 1] || 'osm_matches.csv';

  if (!pbfPath || !placesPath) {
    console.error('Usage: npm run osm-match -- --pbf <pbf-file> --places <places-csv> [--output <output-csv>]');
    process.exit(1);
  }

  if (!existsSync(pbfPath)) {
    console.error(`PBF file not found: ${pbfPath}`);
    process.exit(1);
  }

  if (!existsSync(placesPath)) {
    console.error(`Places file not found: ${placesPath}`);
    process.exit(1);
  }

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

  // Calculate bounding box
  const bbox = calculateBBox(places);
  console.log(`Bounding box: [${bbox.join(', ')}]`);

  // Extract POIs from PBF
  const osmFeatures = await extractPOIsFromPBF(pbfPath, bbox);

  // Match places to OSM
  console.log('Matching places to OSM features...');
  const matches: OSMMatch[] = [];
  let matchCount = 0;

  for (const place of places) {
    const match = matchPlaceToOSM(place, osmFeatures);
    if (match) {
      matches.push(match);
      matchCount++;
      console.log(`✓ Matched: ${place.name} → OSM ${match.osm_type}/${match.osm_id}`);
    } else {
      console.log(`✗ No match: ${place.name}`);
    }
  }

  console.log(`\nMatched ${matchCount}/${places.length} places`);

  // Write output
  const outputCSV = stringify(matches, {
    header: true,
    columns: ['slug', 'osm_id', 'osm_type', 'name', 'image_url', 'wikidata']
  });

  writeFileSync(outputPath, outputCSV);
  console.log(`\nWrote matches to: ${outputPath}`);
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
