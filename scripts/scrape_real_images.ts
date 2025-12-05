import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';

const prisma = new PrismaClient();

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'df65vubkc',
  api_key: '881336549948327',
  api_secret: '_qG1YQb3_oYm4wZv2QzUrhX1Ico'
});

const CITIES_NEEDING_IMAGES = [
  'milan', 'zurich', 'new-york', 'los-angeles', 'tokyo',
  'buenos-aires', 'cordoba', 'vancouver', 'sydney', 'melbourne'
];

// Try multiple image sources
async function findImageUrl(placeName: string, cityName: string, placeType: string): Promise<string | null> {
  const searchQuery = `${placeName} ${cityName}`;
  
  // 1. Try Wikimedia Commons API
  const wikimediaUrl = await tryWikimediaCommons(searchQuery);
  if (wikimediaUrl) return wikimediaUrl;
  
  // 2. Try Bing Image Search (via scraping)
  const bingUrl = await tryBingImages(searchQuery);
  if (bingUrl) return bingUrl;
  
  // 3. Try DuckDuckGo Images
  const ddgUrl = await tryDuckDuckGo(searchQuery);
  if (ddgUrl) return ddgUrl;
  
  // 4. Fallback: category-specific Wikimedia
  const categoryUrl = await tryCategoryWikimedia(placeType, cityName);
  if (categoryUrl) return categoryUrl;
  
  return null;
}

async function tryWikimediaCommons(query: string): Promise<string | null> {
  try {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srnamespace=6&format=json&srlimit=1`;
    const response = await fetch(url);
    const data = await response.json() as any;
    
    if (data.query?.search?.length > 0) {
      const title = data.query.search[0].title;
      // Get the actual image URL
      const imageInfoUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url&format=json`;
      const imageResponse = await fetch(imageInfoUrl);
      const imageData = await imageResponse.json() as any;
      
      const pages = imageData.query?.pages;
      if (pages) {
        const page = Object.values(pages)[0] as any;
        if (page?.imageinfo?.[0]?.url) {
          return page.imageinfo[0].url;
        }
      }
    }
  } catch (error) {
    // Silent fail, try next source
  }
  return null;
}

async function tryBingImages(query: string): Promise<string | null> {
  try {
    // Use Bing's web search page and extract image
    const searchUrl = `https://www.bing.com/images/search?q=${encodeURIComponent(query + ' place')}&first=1`;
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    });
    const html = await response.text();
    
    // Extract image URLs from the page
    const imgMatch = html.match(/murl&quot;:&quot;(https?:\/\/[^&]+\.(?:jpg|jpeg|png|webp))/i);
    if (imgMatch) {
      return imgMatch[1].replace(/\\u002f/g, '/');
    }
  } catch (error) {
    // Silent fail
  }
  return null;
}

async function tryDuckDuckGo(query: string): Promise<string | null> {
  try {
    // DuckDuckGo instant answers API
    const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1`;
    const response = await fetch(url);
    const data = await response.json() as any;
    
    if (data.Image) {
      return data.Image;
    }
  } catch (error) {
    // Silent fail
  }
  return null;
}

async function tryCategoryWikimedia(placeType: string, cityName: string): Promise<string | null> {
  // Map place types to Wikimedia categories
  const categoryMap: Record<string, string> = {
    'PARK': `Parks in ${cityName}`,
    'RESTAURANT': `Restaurants in ${cityName}`,
    'CAFE': `Cafés in ${cityName}`,
    'HOTEL': `Hotels in ${cityName}`,
    'VET': 'Veterinary clinics',
    'BEACH': `Beaches in ${cityName}`,
    'TRAIL': `Hiking trails`,
  };
  
  const category = categoryMap[placeType] || `${cityName} city`;
  
  try {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&list=categorymembers&cmtitle=Category:${encodeURIComponent(category)}&cmtype=file&format=json&cmlimit=5`;
    const response = await fetch(url);
    const data = await response.json() as any;
    
    if (data.query?.categorymembers?.length > 0) {
      // Pick a random one
      const files = data.query.categorymembers;
      const file = files[Math.floor(Math.random() * files.length)];
      
      // Get actual URL
      const imageInfoUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(file.title)}&prop=imageinfo&iiprop=url&format=json`;
      const imageResponse = await fetch(imageInfoUrl);
      const imageData = await imageResponse.json() as any;
      
      const pages = imageData.query?.pages;
      if (pages) {
        const page = Object.values(pages)[0] as any;
        if (page?.imageinfo?.[0]?.url) {
          return page.imageinfo[0].url;
        }
      }
    }
  } catch (error) {
    // Silent fail
  }
  return null;
}

async function uploadToCloudinary(imageUrl: string, placeName: string, citySlug: string): Promise<string | null> {
  try {
    const slug = placeName.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 40);
    
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: 'dog-atlas/places',
      public_id: `real-${citySlug}-${slug}-${Date.now()}`,
      transformation: [
        { width: 800, height: 600, crop: 'fill', quality: 'auto', fetch_format: 'auto' }
      ]
    });
    
    return result.secure_url;
  } catch (error) {
    console.log(`    Upload failed for ${placeName}`);
    return null;
  }
}

async function main() {
  console.log('=== Scraping REAL Images for Missing Cities ===\n');
  console.log('Sources: Wikimedia Commons, Bing Images, DuckDuckGo\n');
  
  let totalSuccess = 0;
  let totalFailed = 0;
  
  for (const citySlug of CITIES_NEEDING_IMAGES) {
    const city = await prisma.city.findFirst({
      where: { slug: citySlug },
      select: { id: true, name: true, slug: true }
    });
    
    if (!city) {
      console.log(`City not found: ${citySlug}`);
      continue;
    }
    
    console.log(`\n📍 ${city.name}`);
    
    const places = await prisma.place.findMany({
      where: {
        cityId: city.id,
        OR: [{ imageUrl: null }, { imageUrl: '' }]
      }
    });
    
    console.log(`   ${places.length} places need images`);
    
    let citySuccess = 0;
    
    for (let i = 0; i < places.length; i++) {
      const place = places[i];
      
      // Progress every 10
      if (i > 0 && i % 10 === 0) {
        console.log(`   [${i}/${places.length}] ${citySuccess} found so far`);
      }
      
      // Rate limit
      await new Promise(r => setTimeout(r, 500));
      
      const imageUrl = await findImageUrl(place.name, city.name, place.type);
      
      if (!imageUrl) {
        totalFailed++;
        continue;
      }
      
      const cloudinaryUrl = await uploadToCloudinary(imageUrl, place.name, city.slug);
      
      if (cloudinaryUrl) {
        await prisma.place.update({
          where: { id: place.id },
          data: { imageUrl: cloudinaryUrl }
        });
        totalSuccess++;
        citySuccess++;
        process.stdout.write('✓');
      } else {
        totalFailed++;
        process.stdout.write('✗');
      }
    }
    
    console.log(`\n   ${city.name}: ${citySuccess}/${places.length} images found`);
  }
  
  console.log('\n\n=== FINAL RESULTS ===');
  console.log(`✓ Success: ${totalSuccess}`);
  console.log(`✗ Failed: ${totalFailed}`);
  
  await prisma.$disconnect();
}

main().catch(console.error);
