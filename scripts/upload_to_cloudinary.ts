/**
 * Upload all local place images to Cloudinary and update database URLs
 * 
 * This script:
 * 1. Finds all places with local image URLs (/images/places/...)
 * 2. Uploads each image to Cloudinary
 * 3. Updates the database with the Cloudinary URL
 * 4. After completion, you can delete the local images to save space
 * 
 * Run with: npx tsx scripts/upload_to_cloudinary.ts
 */

import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'df65vubkc',
  api_key: process.env.CLOUDINARY_API_KEY || '881336549948327',
  api_secret: process.env.CLOUDINARY_API_SECRET || '_qG1YQb3_oYm4wZv2QzUrhX1Ico',
});

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const BATCH_SIZE = 10; // Upload 10 images at a time to avoid rate limits

interface UploadResult {
  placeId: string;
  placeName: string;
  oldUrl: string;
  newUrl: string;
  success: boolean;
  error?: string;
}

async function uploadImage(localPath: string, publicId: string): Promise<string> {
  const fullPath = path.join(PUBLIC_DIR, localPath);
  
  if (!fs.existsSync(fullPath)) {
    throw new Error(`File not found: ${fullPath}`);
  }
  
  const result = await cloudinary.uploader.upload(fullPath, {
    public_id: publicId,
    folder: 'dog-atlas/places',
    overwrite: true,
    resource_type: 'image',
    transformation: [
      { quality: 'auto', fetch_format: 'auto' }
    ]
  });
  
  return result.secure_url;
}

async function main() {
  console.log('🚀 Starting Cloudinary upload...\n');
  
  // Find all places with local image URLs
  const places = await prisma.place.findMany({
    where: {
      imageUrl: {
        startsWith: '/images/places/'
      }
    },
    select: {
      id: true,
      name: true,
      imageUrl: true,
      slug: true,
    }
  });
  
  console.log(`📦 Found ${places.length} places with local images\n`);
  
  if (places.length === 0) {
    console.log('✅ No local images to upload!');
    await prisma.$disconnect();
    return;
  }
  
  const results: UploadResult[] = [];
  let successCount = 0;
  let errorCount = 0;
  
  // Process in batches
  for (let i = 0; i < places.length; i += BATCH_SIZE) {
    const batch = places.slice(i, i + BATCH_SIZE);
    console.log(`\n📤 Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(places.length / BATCH_SIZE)} (${batch.length} images)...`);
    
    const batchPromises = batch.map(async (place) => {
      const result: UploadResult = {
        placeId: place.id,
        placeName: place.name,
        oldUrl: place.imageUrl!,
        newUrl: '',
        success: false,
      };
      
      try {
        // Create a clean public ID from the filename
        const filename = path.basename(place.imageUrl!, path.extname(place.imageUrl!));
        const publicId = filename.substring(0, 100); // Cloudinary has limits on public_id length
        
        // Upload to Cloudinary
        const cloudinaryUrl = await uploadImage(place.imageUrl!, publicId);
        result.newUrl = cloudinaryUrl;
        
        // Update database
        await prisma.place.update({
          where: { id: place.id },
          data: { imageUrl: cloudinaryUrl }
        });
        
        result.success = true;
        successCount++;
        console.log(`  ✅ ${place.name}`);
        
      } catch (error: any) {
        result.error = error.message;
        errorCount++;
        console.log(`  ❌ ${place.name}: ${error.message}`);
      }
      
      return result;
    });
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    
    // Small delay between batches to avoid rate limiting
    if (i + BATCH_SIZE < places.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 UPLOAD SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${errorCount}`);
  console.log(`📦 Total: ${places.length}`);
  
  if (errorCount > 0) {
    console.log('\n❌ Failed uploads:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.placeName}: ${r.error}`);
    });
  }
  
  if (successCount > 0) {
    console.log('\n🎉 Upload complete!');
    console.log('\n📁 You can now safely delete the local images to save space:');
    console.log('   rm -rf public/images/places/*');
    console.log('\n   This will free up ~290MB of storage.');
  }
  
  await prisma.$disconnect();
}

main().catch(async (error) => {
  console.error('Fatal error:', error);
  await prisma.$disconnect();
  process.exit(1);
});
