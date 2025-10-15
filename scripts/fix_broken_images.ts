#!/usr/bin/env npx tsx

/**
 * Fix broken Unsplash source URLs by using Unsplash's proper API
 * or falling back to Picsum (Lorem Picsum) for placeholder images
 * Usage: npx tsx scripts/fix_broken_images.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Generate a stable placeholder image URL using Picsum Photos
 * This uses a seed based on the place ID to get consistent images
 */
function generatePlaceholderImage(placeId: string, placeName: string, placeType: string): string {
  // Create a numeric seed from the place ID
  const seed = placeId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Use Lorem Picsum with seed for consistent images
  // They provide free placeholder images that work reliably
  return `https://picsum.photos/seed/${seed}/800/600`;
}

/**
 * Alternative: Generate themed placeholder based on place type
 */
function generateThemedPlaceholder(placeType: string, index: number): string {
  // Use Lorem Picsum with different IDs for different types
  const typeSeeds: Record<string, number> = {
    parks: 1000,
    cafes_restaurants: 2000,
    walks_trails: 3000,
    accommodation: 4000,
    shops_services: 5000,
    tips_local_info: 6000,
  };
  
  const baseSeed = typeSeeds[placeType] || 7000;
  const imageId = baseSeed + (index % 100);
  
  return `https://picsum.photos/id/${imageId}/800/600`;
}

async function main() {
  console.log('🖼️  Fixing broken Unsplash image URLs...\n');
  
  // Get all places with broken source.unsplash.com URLs
  const places = await prisma.place.findMany({
    where: {
      imageUrl: {
        contains: 'source.unsplash.com'
      }
    },
    orderBy: {
      type: 'asc'
    }
  });
  
  console.log(`Found ${places.length} places with broken Unsplash URLs\n`);
  
  if (places.length === 0) {
    console.log('No places need fixing!');
    return;
  }
  
  let updated = 0;
  const typeCounters: Record<string, number> = {};
  
  for (const place of places) {
    try {
      // Track count per type for themed placeholders
      if (!typeCounters[place.type]) {
        typeCounters[place.type] = 0;
      }
      const typeIndex = typeCounters[place.type]++;
      
      // Generate new placeholder image
      // Option 1: Use seeded random images (consistent per place)
      const newImageUrl = generatePlaceholderImage(place.id, place.name, place.type);
      
      // Option 2: Use themed placeholders (uncomment to use)
      // const newImageUrl = generateThemedPlaceholder(place.type, typeIndex);
      
      // Update database
      await prisma.place.update({
        where: { id: place.id },
        data: {
          imageUrl: newImageUrl,
          updatedAt: new Date(),
        }
      });
      
      console.log(`✅ ${place.name} (${place.type})`);
      console.log(`   Old: ${place.imageUrl?.substring(0, 60)}...`);
      console.log(`   New: ${newImageUrl}`);
      
      updated++;
      
      // Progress update every 20 places
      if (updated % 20 === 0) {
        console.log(`\n   Progress: ${updated}/${places.length} updated\n`);
      }
      
      // Small delay
      await new Promise(resolve => setTimeout(resolve, 50));
      
    } catch (error: any) {
      console.error(`❌ Error updating ${place.name}:`, error?.message || error);
    }
  }
  
  console.log('\n============================================================');
  console.log('✨ Image fix complete!');
  console.log(`   Total places: ${places.length}`);
  console.log(`   Updated: ${updated}`);
  console.log('============================================================\n');
  
  console.log('ℹ️  NOTE: We\'re now using Lorem Picsum (picsum.photos) for placeholder images.');
  console.log('   These are free, reliable, and will work consistently.');
  console.log('   Each place gets a unique seeded image based on its ID.\n');
  console.log('   For production, consider:');
  console.log('   1. Using Google Places API for real place photos');
  console.log('   2. Manual curation of actual place images');
  console.log('   3. User-generated photos from reviews\n');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
