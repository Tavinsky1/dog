/**
 * Fetch coordinates for all places missing lat/lng using Google Places API
 */

import { PrismaClient } from '@prisma/client';
import pLimit from 'p-limit';

const prisma = new PrismaClient();
const GOOGLE_API_KEY = 'AIzaSyD6kBUSUmSYYrLksTkW-NR-rNmSq3i4hoE';

// Rate limiting: 1 request per 200ms (5 per second)
const limit = pLimit(5);

interface GooglePlacesResponse {
  places: Array<{
    displayName?: { text: string };
    location?: {
      latitude: number;
      longitude: number;
    };
  }>;
}

async function searchGooglePlace(name: string, city: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const query = `${name} ${city}`;
    
    const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_API_KEY,
        'X-Goog-FieldMask': 'places.displayName,places.location',
      },
      body: JSON.stringify({
        textQuery: query,
        maxResultCount: 1,
      }),
    });

    if (!response.ok) {
      console.log(`   ⚠️  API error: ${response.status} ${response.statusText}`);
      return null;
    }

    const data: GooglePlacesResponse = await response.json();

    if (data.places && data.places.length > 0 && data.places[0].location) {
      const location = data.places[0].location;
      return {
        lat: location.latitude,
        lng: location.longitude,
      };
    }

    return null;
  } catch (error) {
    console.error(`   ❌ Error searching for ${name}:`, error);
    return null;
  }
}

async function main() {
  console.log('🗺️  Fetching coordinates for places...\n');

  // Get all places missing coordinates
  const places = await prisma.place.findMany({
    where: {
      OR: [
        { lat: 0 },
        { lng: 0 },
      ],
    },
    include: {
      city: {
        select: {
          name: true,
        },
      },
    },
    orderBy: [
      { city: { name: 'asc' } },
      { type: 'asc' },
    ],
  });

  console.log(`Found ${places.length} places missing coordinates\n`);

  let successCount = 0;
  let failedCount = 0;
  const failed: Array<{ name: string; city: string }> = [];

  for (const place of places) {
    await limit(async () => {
      console.log(`📍 Searching: ${place.name} (${place.city.name})`);

      const coords = await searchGooglePlace(place.name, place.city.name);

      if (coords) {
        await prisma.place.update({
          where: { id: place.id },
          data: {
            lat: coords.lat,
            lng: coords.lng,
          },
        });

        console.log(`   ✅ Found: ${coords.lat}, ${coords.lng}\n`);
        successCount++;
      } else {
        console.log(`   ❌ Not found\n`);
        failedCount++;
        failed.push({ name: place.name, city: place.city.name });
      }

      // Rate limiting delay
      await new Promise((resolve) => setTimeout(resolve, 200));
    });
  }

  // Wait for all to complete
  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log('='.repeat(60));
  console.log(`✨ COMPLETE!`);
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Failed: ${failedCount}`);
  console.log('='.repeat(60));

  if (failed.length > 0) {
    console.log('\n⚠️  Places that need manual coordinates:\n');
    failed.forEach((p) => {
      console.log(`   • ${p.name} (${p.city})`);
    });
  }
}

main()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
