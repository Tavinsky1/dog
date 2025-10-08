/**
 * Fix Barcelona placeholder images - fetch real photos
 */

import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();
const GOOGLE_PLACES_API_KEY = 'AIzaSyD6kBUSUmSYYrLksTkW-NR-rNmSq3i4hoE';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function searchGooglePlace(placeName: string, cityName: string): Promise<string | null> {
  try {
    const query = `${placeName}, ${cityName}, Spain`;
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
      // Try simpler query
      const simpleQuery = `${placeName} Barcelona`;
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
        const photoUrl = `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=1200&key=${GOOGLE_PLACES_API_KEY}`;
        console.log(`    ✅ Found: ${retryPlaces[0].displayName?.text || placeName}`);
        return photoUrl;
      }
      return null;
    }

    if (places[0].photos && places[0].photos.length > 0) {
      const photoName = places[0].photos[0].name;
      const photoUrl = `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=1200&key=${GOOGLE_PLACES_API_KEY}`;
      console.log(`    ✅ Found: ${places[0].displayName?.text || placeName}`);
      return photoUrl;
    }

    return null;
  } catch (error: any) {
    console.error(`    ❌ Error: ${error.message}`);
    return null;
  }
}

async function main() {
  console.log('🔍 Finding Barcelona places with placeholder images...\n');

  // Get Barcelona places with placeholder images
  const barcelonaCity = await prisma.city.findFirst({
    where: { name: 'Barcelona' }
  });

  if (!barcelonaCity) {
    console.log('❌ Barcelona city not found');
    return;
  }

  const placesWithPlaceholders = await prisma.place.findMany({
    where: {
      cityId: barcelonaCity.id,
      OR: [
        { imageUrl: { contains: 'ajuntament.barcelona.cat' } },
        { imageUrl: { contains: 'barcelona.cat/infobarcelona' } }
      ]
    }
  });

  console.log(`Found ${placesWithPlaceholders.length} places with placeholder images\n`);

  let successCount = 0;
  let failCount = 0;

  for (const place of placesWithPlaceholders) {
    console.log(`\n🔍 Processing: ${place.name}`);
    console.log(`   Current: ${place.imageUrl?.substring(0, 60)}...`);
    
    const imageUrl = await searchGooglePlace(place.name, 'Barcelona');
    
    if (imageUrl) {
      await prisma.place.update({
        where: { id: place.id },
        data: { imageUrl }
      });
      console.log(`   💾 Updated with real photo`);
      successCount++;
    } else {
      console.log(`   ⚠️  No photo found - keeping existing`);
      failCount++;
    }
    
    await delay(500); // Rate limiting
  }

  console.log('\n' + '='.repeat(60));
  console.log('✨ COMPLETE!');
  console.log(`   ✅ Updated with real photos: ${successCount}`);
  console.log(`   ⚠️  Could not find photos: ${failCount}`);
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
