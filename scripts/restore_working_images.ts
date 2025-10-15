#!/usr/bin/env npx tsx

/**
 * FINAL FIX: Use Lorem Picsum which is PROVEN to work
 * Even though it's not ideal, it's better than broken 404 images
 * 
 * Usage: npx tsx scripts/restore_working_images.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function generateImageUrl(placeId: string, placeName: string): string {
  // Use Lorem Picsum with seeded images for consistency
  const seed = hashString(placeId + placeName);
  return `https://picsum.photos/seed/${seed}/800/600`;
}

async function restoreImages() {
  console.log('🔧 Restoring WORKING images (Lorem Picsum)...\n');
  
  try {
    const places = await prisma.place.findMany({
      select: {
        id: true,
        name: true,
        type: true,
      },
      orderBy: { name: 'asc' }
    });
    
    console.log(`📍 Found ${places.length} places\n`);
    
    let updated = 0;
    
    for (const place of places) {
      const imageUrl = generateImageUrl(place.id, place.name);
      
      await prisma.place.update({
        where: { id: place.id },
        data: { imageUrl }
      });
      
      console.log(`✅ ${place.name}: ${imageUrl}`);
      updated++;
    }
    
    console.log('\n' + '='.repeat(60));
    console.log(`✅ Updated ${updated} places with WORKING images`);
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

restoreImages();
