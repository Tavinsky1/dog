import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';

const prisma = new PrismaClient();

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'df65vubkc',
  api_key: '881336549948327',
  api_secret: '_qG1YQb3_oYm4wZv2QzUrhX1Ico'
});

// Cities that need images
const CITIES_NEEDING_IMAGES = [
  'milan', 'zurich', 'new-york', 'los-angeles', 'tokyo',
  'buenos-aires', 'cordoba', 'vancouver', 'sydney', 'melbourne'
];

// Unsplash Access Key
const UNSPLASH_ACCESS_KEY = 'JgXCP8b8MYqfCVYl7VF1eFN7gKz8mh8sJ5LqKQ_T7fA';

async function searchUnsplash(query: string): Promise<string | null> {
  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
      {
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
        }
      }
    );
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json() as any;
    if (data.results && data.results.length > 0) {
      return data.results[0].urls.regular;
    }
    return null;
  } catch (error) {
    return null;
  }
}

async function uploadToCloudinary(imageUrl: string, placeName: string): Promise<string | null> {
  try {
    const slug = placeName.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 50);
    
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: 'dog-atlas/places',
      public_id: `unsplash-${slug}-${Date.now()}`,
      transformation: [
        { width: 800, height: 600, crop: 'fill', quality: 'auto' }
      ]
    });
    
    return result.secure_url;
  } catch (error) {
    return null;
  }
}

function buildSearchQuery(place: any, cityName: string): string {
  const type = place.type || '';
  const name = place.name || '';
  
  if (type === 'PARK' || name.toLowerCase().includes('park')) {
    return `${cityName} park dogs walking nature`;
  } else if (type === 'RESTAURANT' || type === 'CAFE') {
    return `${cityName} dog friendly cafe terrace outdoor`;
  } else if (type === 'HOTEL' || type === 'ACCOMMODATION') {
    return `${cityName} luxury hotel pet friendly`;
  } else if (type === 'VET' || type === 'PET_STORE') {
    return `veterinary clinic pets dogs`;
  } else if (type === 'BEACH' || name.toLowerCase().includes('beach')) {
    return `${cityName} beach dogs`;
  } else if (type === 'TRAIL' || name.toLowerCase().includes('trail') || name.toLowerCase().includes('walk')) {
    return `${cityName} hiking trail nature dogs`;
  } else {
    return `${cityName} dog friendly outdoor`;
  }
}

async function main() {
  console.log('=== Fetching Images for Missing Cities ===\n');
  
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
    
    console.log(`\n📍 Processing ${city.name}...`);
    
    const places = await prisma.place.findMany({
      where: {
        cityId: city.id,
        OR: [{ imageUrl: null }, { imageUrl: '' }]
      }
    });
    
    console.log(`   Found ${places.length} places without images`);
    
    let citySuccess = 0;
    
    for (let i = 0; i < places.length; i++) {
      const place = places[i];
      
      // Rate limiting
      if (i > 0 && i % 10 === 0) {
        console.log(`\n   Progress: ${i}/${places.length}`);
        await new Promise(r => setTimeout(r, 2000));
      }
      
      const query = buildSearchQuery(place, city.name);
      const unsplashUrl = await searchUnsplash(query);
      
      if (!unsplashUrl) {
        totalFailed++;
        continue;
      }
      
      const cloudinaryUrl = await uploadToCloudinary(unsplashUrl, place.name);
      
      if (cloudinaryUrl) {
        await prisma.place.update({
          where: { id: place.id },
          data: { imageUrl: cloudinaryUrl }
        });
        totalSuccess++;
        citySuccess++;
        process.stdout.write('.');
      } else {
        totalFailed++;
      }
    }
    
    console.log(`\n   ${city.name}: ${citySuccess}/${places.length} images added`);
  }
  
  console.log('\n\n=== SUMMARY ===');
  console.log(`Successful: ${totalSuccess}`);
  console.log(`Failed: ${totalFailed}`);
  
  await prisma.$disconnect();
}

main().catch(console.error);
