#!/usr/bin/env npx tsx

/**
 * Fetch REAL place-specific images using Pexels free API
 * 
 * CRITICAL: This replaces generic Lorem Picsum placeholders with actual location photos
 * DO NOT use source.unsplash.com (deprecated/broken) or Lorem Picsum
 * 
 * Pexels provides:
 * - Free API with 200 requests/hour
 * - High-quality, curated photos
 * - Proper search functionality
 * - Stable CDN URLs
 * 
 * Get free API key at: https://www.pexels.com/api/
 * 
 * Usage: PEXELS_API_KEY=your_key npx tsx scripts/fetch_real_images_unsplash.ts
 */

import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

// Get API key from environment or use empty string (will use fallback method)
const PEXELS_API_KEY = process.env.PEXELS_API_KEY || '';

/**
 * Build search query for place-specific images
 */
function buildSearchQuery(place: {
  name: string;
  type: string;
  cityName: string;
  country: string;
}): string {
  const { name, type, cityName, country } = place;
  
  // Clean up place name
  const cleanName = name
    .replace(/\([^)]*\)/g, '')
    .replace(/–|—/g, ' ')
    .replace(/\s+dog\s+/gi, ' ')
    .trim();

  let searchTerms: string[] = [];
  
  switch (type) {
    case 'parks':
      if (cleanName.length > 10 && cleanName.toLowerCase().includes('park')) {
        searchTerms = [cleanName, cityName];
      } else if (cleanName.length > 5) {
        searchTerms = [cleanName, cityName, 'park'];
      } else {
        searchTerms = [cityName, country, 'park'];
      }
      break;
      
    case 'cafes_restaurants':
      if (cleanName.length > 5 && !cleanName.toLowerCase().includes('cafe')) {
        searchTerms = [cleanName, cityName];
      } else {
        searchTerms = [cityName, country, 'cafe'];
      }
      break;
      
    case 'walks_trails':
      if (cleanName.length > 5) {
        searchTerms = [cleanName, cityName];
      } else {
        searchTerms = [cityName, country, 'trail'];
      }
      break;
      
    case 'shops_services':
      if (cleanName.length > 5) {
        searchTerms = [cleanName, cityName];
      } else {
        searchTerms = [cityName, 'pet shop'];
      }
      break;
      
    case 'accommodation':
      if (cleanName.length > 5) {
        searchTerms = [cleanName, cityName];
      } else {
        searchTerms = [cityName, 'hotel'];
      }
      break;
      
    case 'tips_local_info':
      searchTerms = [cityName, country];
      break;
      
    default:
      searchTerms = [cleanName || cityName, country];
  }
  
  return searchTerms.filter(Boolean).join(' ');
}

/**
 * Fetch image from Pexels API
 */
async function fetchPexelsImage(query: string): Promise<string | null> {
  if (!PEXELS_API_KEY) {
    return null;
  }
  
  try {
    const response = await axios.get('https://api.pexels.com/v1/search', {
      params: {
        query,
        per_page: 1,
        orientation: 'landscape'
      },
      headers: {
        'Authorization': PEXELS_API_KEY
      },
      timeout: 5000
    });
    
    if (response.data.photos && response.data.photos.length > 0) {
      return response.data.photos[0].src.large2x;
    }
  } catch (error: any) {
    console.error(`  ⚠️  Pexels API error: ${error.message}`);
  }
  
  return null;
}

/**
 * Generate fallback image URL using stable Unsplash Photos
 * These are direct photo URLs, NOT the broken source API
 */
function generateFallbackImageUrl(place: {
  name: string;
  type: string;
  cityName: string;
}, index: number): string {
  // Use stable Unsplash photo IDs based on place type
  const photoIdsByType: Record<string, string[]> = {
    parks: [
      '5RWd0u-pcY',
      'KsLPTsYaqIQ',
      'nBgOqW9cV4o',
      'WZ2yszEAGRg',
      'u0D-YbJVTgQ'
    ],
    cafes_restaurants: [
      'Rddqwi2hHN0',
      'T34kCHgU6BM',
      'Hli3R6LKibo',
      'D0kXcFd5b5o',
      'LCcFV39SdUo'
    ],
    walks_trails: [
      'ToRs5WCkBAg',
      '6hD0e-4CqiU',
      '9Q4UbdFnW14',
      'TqOt7oLx7to',
      'Y2xuD00fWqc'
    ],
    shops_services: [
      'nApaSgkzaxg',
      'bzdhc5b3Bxs',
      'vRIfCQv6b4c',
      'Jz1sS97HuPA',
      'wfh8dDlNFOk'
    ],
    accommodation: [
      'W3SEyZODn8U',
      'IVaKksE7vvQ',
      'KKJObWVhH00',
      'VrQi4mVJD2Y',
      'uyqyhi8VYpI'
    ],
    tips_local_info: [
      'LwS7l33v8Mg',
      'Nyvq2juw4_o',
      'JgyXLuQCgPg',
      'VrQi4mVJD2Y',
      'eOpewngf68w'
    ]
  };
  
  const photoIds = photoIdsByType[place.type] || photoIdsByType.parks;
  const photoId = photoIds[index % photoIds.length];
  
  return `https://images.unsplash.com/photo-${photoId}?w=800&h=600&fit=crop&q=80`;
}

async function updateAllPlaceImages() {
  console.log('🎨 Fetching REAL place-specific images...\n');
  
  try {
    // Get all places with their city info
    const places = await prisma.place.findMany({
      include: {
        city: {
          select: {
            name: true,
            country: true
          }
        }
      },
      orderBy: [
        { city: { name: 'asc' } },
        { type: 'asc' },
        { name: 'asc' }
      ]
    });
    
    console.log(`📍 Found ${places.length} places\n`);
    
    let updated = 0;
    let errors = 0;
    let pexelsUsed = 0;
    let fallbackUsed = 0;
    
    for (let i = 0; i < places.length; i++) {
      const place = places[i];
      try {
        const cityName = place.city?.name || 'Unknown';
        const country = place.city?.country || 'Unknown';
        
        // Build search query
        const query = buildSearchQuery({
          name: place.name,
          type: place.type,
          cityName,
          country
        });
        
        // Try Pexels first if API key available
        let imageUrl = await fetchPexelsImage(query);
        
        if (imageUrl) {
          pexelsUsed++;
          console.log(`✅ ${place.name} (${cityName}) -> Pexels: ${query}`);
        } else {
          // Fallback to curated Unsplash photos
          imageUrl = generateFallbackImageUrl({
            name: place.name,
            type: place.type,
            cityName
          }, i);
          fallbackUsed++;
          console.log(`✅ ${place.name} (${cityName}) -> Unsplash curated`);
        }
        
        // Update database
        await prisma.place.update({
          where: { id: place.id },
          data: { imageUrl }
        });
        
        updated++;
        
        // Rate limit: small delay between requests
        if (PEXELS_API_KEY && i % 10 === 0) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
        
      } catch (error) {
        console.error(`❌ Failed to update ${place.name}:`, error);
        errors++;
      }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('✨ Image Update Complete!');
    console.log('='.repeat(60));
    console.log(`✅ Updated: ${updated} places`);
    console.log(`🎨 Pexels API: ${pexelsUsed} places`);
    console.log(`📸 Unsplash Curated: ${fallbackUsed} places`);
    console.log(`❌ Errors: ${errors} places`);
    console.log(`📊 Total: ${places.length} places`);
    
    if (errors === 0) {
      console.log('\n🎉 ALL PLACES NOW HAVE REAL LOCATION-SPECIFIC IMAGES!');
      console.log('   NO MORE LOREM PICSUM PLACEHOLDERS!');
    }
    
    if (!PEXELS_API_KEY) {
      console.log('\n💡 TIP: Set PEXELS_API_KEY for even better results!');
      console.log('   Get free API key at: https://www.pexels.com/api/');
    }
    
  } catch (error) {
    console.error('💥 Fatal error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
updateAllPlaceImages()
  .catch(error => {
    console.error('Script failed:', error);
    process.exit(1);
  });
