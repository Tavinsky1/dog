import { PrismaClient } from '@prisma/client';
import https from 'https';
import http from 'http';

const prisma = new PrismaClient();

// Wikimedia Commons API to search for images
async function searchWikimediaCommons(query: string): Promise<string | null> {
  return new Promise((resolve) => {
    const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srnamespace=6&format=json&srlimit=5`;
    
    https.get(searchUrl, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const results = json.query?.search || [];
          
          // Filter for image files
          for (const result of results) {
            const title = result.title;
            if (title.match(/\.(jpg|jpeg|png)$/i)) {
              // Get the actual image URL
              getImageUrl(title).then(resolve);
              return;
            }
          }
          resolve(null);
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

async function getImageUrl(title: string): Promise<string | null> {
  return new Promise((resolve) => {
    const infoUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url&iiurlwidth=800&format=json`;
    
    https.get(infoUrl, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const pages = json.query?.pages || {};
          for (const pageId of Object.keys(pages)) {
            const imageinfo = pages[pageId]?.imageinfo?.[0];
            if (imageinfo?.thumburl) {
              resolve(imageinfo.thumburl);
              return;
            }
          }
          resolve(null);
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

// Wikipedia API to get image from article
async function getWikipediaImage(query: string): Promise<string | null> {
  return new Promise((resolve) => {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(query)}&prop=pageimages&pithumbsize=800&format=json&redirects=1`;
    
    https.get(searchUrl, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const pages = json.query?.pages || {};
          for (const pageId of Object.keys(pages)) {
            const thumbnail = pages[pageId]?.thumbnail?.source;
            if (thumbnail) {
              resolve(thumbnail);
              return;
            }
          }
          resolve(null);
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

// Try multiple search strategies to find an image
async function findImageForPlace(placeName: string, cityName: string, placeType: string): Promise<string | null> {
  // Clean up name for search
  const cleanName = placeName.replace(/[^\w\s]/g, ' ').trim();
  
  // Strategy 1: Direct Wikipedia article search
  let image = await getWikipediaImage(cleanName);
  if (image) return image;
  
  // Strategy 2: With city name
  image = await getWikipediaImage(`${cleanName} ${cityName}`);
  if (image) return image;
  
  // Strategy 3: Wikimedia Commons search
  image = await searchWikimediaCommons(`${cleanName} ${cityName}`);
  if (image) return image;
  
  // Strategy 4: Just the place name on Commons
  image = await searchWikimediaCommons(cleanName);
  if (image) return image;
  
  return null;
}

// Process a batch of places
async function processBatch(citySlug: string) {
  console.log(`\n📍 Processing ${citySlug}...`);
  
  const places = await prisma.place.findMany({
    where: {
      city: { slug: citySlug }
    },
    include: {
      city: { select: { name: true } }
    }
  });
  
  console.log(`   Found ${places.length} places`);
  
  let updated = 0;
  let failed = 0;
  
  for (const place of places) {
    // Skip if already has an image
    if (place.imageUrl) {
      console.log(`   ⏭️  ${place.name} - already has image`);
      continue;
    }
    
    // Skip tips/local info as they don't need real photos
    if (place.type === 'tips_local_info') {
      console.log(`   ⏭️  ${place.name} - info type, skipping`);
      continue;
    }
    
    const image = await findImageForPlace(place.name, place.city.name, place.type);
    
    if (image) {
      await prisma.place.update({
        where: { id: place.id },
        data: { imageUrl: image }
      });
      console.log(`   ✅ ${place.name}`);
      updated++;
    } else {
      console.log(`   ❌ ${place.name} - no image found`);
      failed++;
    }
    
    // Small delay to be nice to the API
    await new Promise(r => setTimeout(r, 200));
  }
  
  console.log(`   Done: ${updated} updated, ${failed} no image found`);
  return { updated, failed };
}

// Main function
async function main() {
  const args = process.argv.slice(2);
  const citySlug = args[0];
  
  if (!citySlug) {
    // Get all cities
    const cities = await prisma.city.findMany({
      select: { slug: true, name: true },
      where: { active: true }
    });
    
    console.log('🌍 Available cities:');
    for (const city of cities) {
      const count = await prisma.place.count({ where: { cityId: city.slug } });
      console.log(`   ${city.slug}: ${count} places`);
    }
    console.log('\nUsage: npx ts-node scripts/fetch_real_images.ts <city-slug>');
    console.log('Example: npx ts-node scripts/fetch_real_images.ts london');
    return;
  }
  
  await processBatch(citySlug);
  
  await prisma.$disconnect();
}

main().catch(console.error);
