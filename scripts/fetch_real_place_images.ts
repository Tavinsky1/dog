#!/usr/bin/env npx tsx

/**
 * Fetch real place-specific images using Unsplash API
 * This replaces generic stock photos with images matching the actual place
 * Usage: npx tsx scripts/fetch_real_place_images.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Free Unsplash API - no key needed for basic usage
const UNSPLASH_API = 'https://source.unsplash.com/800x600/?';

/**
 * Generate better search query for Unsplash based on place type and location
 */
function generateSearchQuery(place: {
  name: string;
  type: string;
  cityName: string;
  country: string;
}): string {
  const { name, type, cityName, country } = place;
  
  // Remove generic words and clean up the name
  const cleanName = name
    .replace(/\([^)]*\)/g, '') // Remove parentheses content
    .replace(/–|—/g, ' ') // Replace dashes
    .replace(/dog|area|zone|run|beach/gi, '') // Remove generic dog terms
    .trim();

  // Build search terms based on place type
  let searchTerms: string[] = [];
  
  switch (type) {
    case 'parks':
      // For famous parks, use the park name + city
      // For generic "dog park", use city + park type
      if (cleanName.length > 5 && !cleanName.toLowerCase().includes('park')) {
        searchTerms = [cleanName, cityName, 'park'];
      } else {
        searchTerms = [cityName, 'park', 'nature'];
      }
      break;
      
    case 'cafes_restaurants':
      searchTerms = [cityName, 'cafe', 'outdoor', 'terrace'];
      break;
      
    case 'walks_trails':
      // Use specific trail/location name if meaningful
      if (cleanName.length > 8) {
        searchTerms = [cleanName, cityName, 'trail'];
      } else {
        searchTerms = [cityName, 'hiking', 'trail', 'nature'];
      }
      break;
      
    case 'accommodation':
      searchTerms = [cityName, 'hotel', 'boutique'];
      break;
      
    case 'shops_services':
      searchTerms = [cityName, 'pet', 'store'];
      break;
      
    case 'tips_local_info':
      searchTerms = [cityName, 'street', 'neighborhood'];
      break;
      
    default:
      searchTerms = [cityName, 'landmark'];
  }
  
  // Join with + for Unsplash URL
  return searchTerms.join(',');
}

/**
 * Generate Unsplash image URL with specific search terms
 */
function generateImageUrl(searchQuery: string): string {
  return `${UNSPLASH_API}${encodeURIComponent(searchQuery)}`;
}

async function main() {
  console.log('🖼️  Fetching real place-specific images from Unsplash...\n');
  
  // Get all places that currently have generic Unsplash photos
  const places = await prisma.place.findMany({
    include: {
      city: {
        select: {
          name: true,
          country: true,
        }
      }
    },
  });
  
  console.log(`Found ${places.length} places to update\n`);
  
  let updated = 0;
  let skipped = 0;
  
  for (const place of places) {
    try {
      // Generate better search query
      const searchQuery = generateSearchQuery({
        name: place.name,
        type: place.type,
        cityName: place.city.name,
        country: place.city.country,
      });
      
      const newImageUrl = generateImageUrl(searchQuery);
      
      console.log(`✅ ${place.city.name}: ${place.name} (${place.type})`);
      console.log(`   Query: ${searchQuery}`);
      console.log(`   URL: ${newImageUrl}`);
      
      // Update the database
      await prisma.place.update({
        where: { id: place.id },
        data: {
          imageUrl: newImageUrl,
          updatedAt: new Date(),
        }
      });
      
      updated++;
      
      // Progress update every 20 places
      if (updated % 20 === 0) {
        console.log(`\n   Progress: ${updated}/${places.length} updated\n`);
      }
      
      // Small delay to be respectful
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error: any) {
      console.error(`❌ Error updating ${place.name}:`, error?.message || error);
      skipped++;
    }
  }
  
  console.log('\n============================================================');
  console.log('✨ Image update complete!');
  console.log(`   Total places: ${places.length}`);
  console.log(`   Updated: ${updated}`);
  console.log(`   Skipped/Errors: ${skipped}`);
  console.log('============================================================\n');
  
  console.log('⚠️  NOTE: These are still Unsplash images, but now with better search terms.');
  console.log('For truly accurate images, consider:');
  console.log('  1. Using Google Places API for official place photos');
  console.log('  2. Web scraping place websites (using fetch_place_images.ts)');
  console.log('  3. Manual curation for top 50 places\n');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
