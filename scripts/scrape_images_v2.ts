import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';

const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: 'df65vubkc',
  api_key: '881336549948327',
  api_secret: '_qG1YQb3_oYm4wZv2QzUrhX1Ico'
});

async function searchWikimedia(query: string): Promise<string | null> {
  try {
    // Search Wikimedia Commons
    const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srnamespace=6&format=json&srlimit=3`;
    const res = await fetch(searchUrl);
    const data = await res.json() as any;
    
    if (data.query?.search?.length > 0) {
      for (const result of data.query.search) {
        const title = result.title;
        // Skip SVG, PDF files
        if (title.match(/\.(svg|pdf|ogg|ogv)$/i)) continue;
        
        const infoUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url&format=json`;
        const infoRes = await fetch(infoUrl);
        const infoData = await infoRes.json() as any;
        
        const pages = infoData.query?.pages;
        if (pages) {
          const page = Object.values(pages)[0] as any;
          const url = page?.imageinfo?.[0]?.url;
          if (url && url.match(/\.(jpg|jpeg|png|webp)$/i)) {
            return url;
          }
        }
      }
    }
  } catch (e) {}
  return null;
}

async function searchWikipedia(query: string): Promise<string | null> {
  try {
    // Try Wikipedia for the place
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(query)}&prop=pageimages&pithumbsize=800&format=json`;
    const res = await fetch(url);
    const data = await res.json() as any;
    
    const pages = data.query?.pages;
    if (pages) {
      const page = Object.values(pages)[0] as any;
      if (page?.thumbnail?.source) {
        return page.thumbnail.source;
      }
    }
  } catch (e) {}
  return null;
}

async function searchBing(query: string): Promise<string | null> {
  try {
    const searchUrl = `https://www.bing.com/images/search?q=${encodeURIComponent(query)}&first=1&count=5`;
    const res = await fetch(searchUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
    });
    const html = await res.text();
    
    // Find image URLs in the response
    const matches = html.matchAll(/murl&quot;:&quot;(https?:\/\/[^&"]+)/g);
    for (const match of matches) {
      const url = match[1].replace(/\\u002f/g, '/').replace(/&amp;/g, '&');
      if (url.match(/\.(jpg|jpeg|png|webp)/i) && !url.includes('bing.com')) {
        return url;
      }
    }
  } catch (e) {}
  return null;
}

async function upload(imageUrl: string, name: string, city: string): Promise<string | null> {
  try {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 35);
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: 'dog-atlas/places',
      public_id: `${city}-${slug}-${Date.now()}`,
      transformation: [{ width: 800, height: 600, crop: 'fill', quality: 'auto' }]
    });
    return result.secure_url;
  } catch (e) {
    return null;
  }
}

async function main() {
  console.log('=== Image Scraper v2 ===\n');
  
  // Get all places without images
  const places = await prisma.place.findMany({
    where: {
      OR: [{ imageUrl: null }, { imageUrl: '' }],
      city: { active: true }
    },
    include: { city: true }
  });
  
  console.log(`Found ${places.length} places needing images\n`);
  
  let success = 0;
  let failed = 0;
  
  for (let i = 0; i < places.length; i++) {
    const place = places[i];
    const cityName = place.city.name;
    
    if (i % 20 === 0) {
      console.log(`\n[${i}/${places.length}] ${success} success, ${failed} failed`);
    }
    
    // Wait to avoid rate limits
    await new Promise(r => setTimeout(r, 300));
    
    // Try multiple search strategies
    let imageUrl: string | null = null;
    
    // 1. Exact name search on Wikimedia
    imageUrl = await searchWikimedia(`${place.name} ${cityName}`);
    
    // 2. Try Wikipedia
    if (!imageUrl) {
      imageUrl = await searchWikipedia(place.name);
    }
    
    // 3. Try with just place name on Wikimedia
    if (!imageUrl) {
      imageUrl = await searchWikimedia(place.name);
    }
    
    // 4. Try Bing
    if (!imageUrl) {
      imageUrl = await searchBing(`${place.name} ${cityName}`);
    }
    
    // 5. Generic city + type search
    if (!imageUrl) {
      const typeQuery = place.type === 'PARK' ? 'park' : 
                       place.type === 'RESTAURANT' ? 'restaurant' :
                       place.type === 'HOTEL' ? 'hotel' : 'place';
      imageUrl = await searchWikimedia(`${cityName} ${typeQuery}`);
    }
    
    if (imageUrl) {
      const cloudinaryUrl = await upload(imageUrl, place.name, place.city.slug);
      if (cloudinaryUrl) {
        await prisma.place.update({
          where: { id: place.id },
          data: { imageUrl: cloudinaryUrl }
        });
        success++;
        process.stdout.write('✓');
      } else {
        failed++;
        process.stdout.write('x');
      }
    } else {
      failed++;
      process.stdout.write('.');
    }
  }
  
  console.log(`\n\n=== DONE ===`);
  console.log(`Success: ${success}`);
  console.log(`Failed: ${failed}`);
  
  await prisma.$disconnect();
}

main();
