/**
 * Fetch REAL images for places using Google Places API ONLY
 * No generic stock photos - only actual photos of the real places
 */

import { PrismaClient, PlaceType } from '@prisma/client';
import axios from 'axios';
import pLimit from 'p-limit';

const prisma = new PrismaClient();

// Rate limiting
const limit = pLimit(3);
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Google Places API configuration
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY || 'AIzaSyD6kBUSUmSYYrLksTkW-NR-rNmSq3i4hoE';

interface GooglePlaceResult {
  place_id: string;
  name?: string;
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
}

/**
 * Search for a place using NEW Google Places API and get REAL photo
 */
async function searchGooglePlace(placeName: string, cityName: string, countryName: string): Promise<string | null> {
  if (!GOOGLE_PLACES_API_KEY) {
    console.log('    ❌ No API key configured');
    return null;
  }

  try {
    // Use NEW Places API (Text Search)
    const query = `${placeName}, ${cityName}, ${countryName}`;
    const searchUrl = `https://places.googleapis.com/v1/places:searchText`;
    
    const response = await axios.post(
      searchUrl,
      {
        textQuery: query,
        maxResultCount: 1
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
          'X-Goog-FieldMask': 'places.displayName,places.photos'
        }
      }
    );

    const places = response.data.places || [];
    
    if (places.length === 0) {
      // Try with simpler query
      const simpleQuery = `${placeName} ${cityName}`;
      const retryResponse = await axios.post(
        searchUrl,
        {
          textQuery: simpleQuery,
          maxResultCount: 1
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
            'X-Goog-FieldMask': 'places.displayName,places.photos'
          }
        }
      );

      const retryPlaces = retryResponse.data.places || [];
      if (retryPlaces.length > 0 && retryPlaces[0].photos && retryPlaces[0].photos.length > 0) {
        const photoName = retryPlaces[0].photos[0].name;
        // Get photo URL using photo name
        const photoUrl = `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=1200&key=${GOOGLE_PLACES_API_KEY}`;
        console.log(`    ✅ Found: ${retryPlaces[0].displayName?.text || placeName}`);
        return photoUrl;
      }
      return null;
    }

    if (places[0].photos && places[0].photos.length > 0) {
      const photoName = places[0].photos[0].name;
      // Get photo URL using NEW API format
      const photoUrl = `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=1200&key=${GOOGLE_PLACES_API_KEY}`;
      console.log(`    ✅ Found: ${places[0].displayName?.text || placeName}`);
      return photoUrl;
    }

    return null;
  } catch (error: any) {
    if (error.response?.data) {
      console.error(`    ❌ API error: ${JSON.stringify(error.response.data).substring(0, 200)}`);
    } else {
      console.error(`    ❌ Error: ${error.message}`);
    }
    return null;
  }
}

/**
 * Fetch REAL image for a single place from Google Places API ONLY
 */
async function fetchImageForPlace(place: any): Promise<boolean> {
  console.log(`\n  🔍 Processing ${place.name} (${place.city.name}, ${place.country})...`);

  let imageUrl: string | null = null;

  // ONLY Google Places API - we want REAL photos only
  console.log(`    → Searching Google Places API...`);
  imageUrl = await searchGooglePlace(place.name, place.city.name, place.country);

  // Update database ONLY if we found a real image
  if (imageUrl) {
    await prisma.place.update({
      where: { id: place.id },
      data: { imageUrl }
    });
    console.log(`    💾 Saved to database`);
    await delay(500); // Rate limiting
    return true;
  } else {
    console.log(`    ⚠️  No photo found - will remain without image`);
    await delay(500); // Rate limiting
    return false;
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🐕 Fetching REAL images from Google Places API...\n');
  console.log('📍 Using Google Places API to find actual photos of each place');
  console.log('⚠️  Note: Only places with photos on Google Maps will get images\n');

  if (!GOOGLE_PLACES_API_KEY) {
    console.log('❌ ERROR: No Google Places API key configured!');
    console.log('   Please set GOOGLE_PLACES_API_KEY in .env file');
    return;
  }

  console.log('✅ Google Places API: Ready\n');

  // Get places without images
  const placesWithoutImages = await prisma.place.findMany({
    where: {
      OR: [
        { imageUrl: null },
        { imageUrl: '' }
      ]
    },
    include: {
      city: {
        select: {
          name: true
        }
      }
    },
    orderBy: [
      { city: { name: 'asc' } },
      { type: 'asc' }
    ]
  });

  console.log(`Found ${placesWithoutImages.length} places without images\n`);

  if (placesWithoutImages.length === 0) {
    console.log('✨ All places already have images!');
    return;
  }

  // Process in batches with rate limiting
  let successCount = 0;
  let failCount = 0;

  const tasks = placesWithoutImages.map((place, index) => 
    limit(async () => {
      const success = await fetchImageForPlace(place);
      if (success) successCount++;
      else failCount++;
      console.log(`\n[${index + 1}/${placesWithoutImages.length}] Processed (✅ ${successCount} found | ⚠️  ${failCount} not found)`);
    })
  );

  await Promise.all(tasks);

  console.log('\n' + '='.repeat(60));
  console.log('✨ COMPLETE!');
  console.log(`   ✅ Successfully found images: ${successCount}`);
  console.log(`   ⚠️  Could not find images: ${failCount}`);
  console.log('='.repeat(60));
}

main()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
