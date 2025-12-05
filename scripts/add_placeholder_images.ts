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

// Category-based image keywords for Lorem Picsum searches
const TYPE_KEYWORDS: Record<string, string[]> = {
  'PARK': ['nature', 'park', 'forest', 'trees', 'grass'],
  'RESTAURANT': ['restaurant', 'food', 'dining', 'cafe'],
  'CAFE': ['coffee', 'cafe', 'interior', 'cozy'],
  'HOTEL': ['hotel', 'luxury', 'building', 'architecture'],
  'VET': ['veterinary', 'pet', 'medical'],
  'PET_STORE': ['shop', 'store', 'retail'],
  'BEACH': ['beach', 'ocean', 'sand', 'water'],
  'TRAIL': ['hiking', 'trail', 'mountain', 'nature'],
};

async function uploadToCloudinary(imageUrl: string, publicId: string): Promise<string | null> {
  try {
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: 'dog-atlas/places',
      public_id: publicId,
      transformation: [
        { width: 800, height: 600, crop: 'fill', quality: 'auto' }
      ]
    });
    return result.secure_url;
  } catch (error) {
    return null;
  }
}

async function main() {
  console.log('=== Adding Images for Missing Cities ===\n');
  
  let totalSuccess = 0;
  let totalFailed = 0;
  let imageId = 1000; // Starting ID for Lorem Picsum
  
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
      imageId++;
      
      // Rate limiting for Cloudinary
      if (i > 0 && i % 20 === 0) {
        console.log(`\n   Progress: ${i}/${places.length}`);
        await new Promise(r => setTimeout(r, 1000));
      }
      
      // Use Lorem Picsum with a unique seed per place
      const picsumUrl = `https://picsum.photos/seed/${place.id}/800/600`;
      
      const slug = place.name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .substring(0, 40);
      
      const publicId = `picsum-${city.slug}-${slug}-${Date.now()}`;
      
      const cloudinaryUrl = await uploadToCloudinary(picsumUrl, publicId);
      
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
        process.stdout.write('x');
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
