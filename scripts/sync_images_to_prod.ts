import { PrismaClient } from '@prisma/client';
import * as path from 'path';

async function syncImages() {
  console.log('🔄 Starting image sync from local to production...\n');

  // Local SQLite database
  const localDbPath = path.join(process.cwd(), 'prisma', 'dev.db');
  const localPrisma = new PrismaClient({
    datasources: {
      db: {
        url: `file:${localDbPath}`
      }
    }
  });

  // Production PostgreSQL database
  const prodDbUrl = process.env.PROD_DATABASE_URL || process.env.DATABASE_URL;
  if (!prodDbUrl || prodDbUrl.includes('file:')) {
    console.error('❌ Error: PROD_DATABASE_URL must be set to PostgreSQL connection string');
    process.exit(1);
  }

  const prodPrisma = new PrismaClient({
    datasources: {
      db: {
        url: prodDbUrl
      }
    }
  });

  try {
    // Get all places from local database with their images
    console.log('📖 Reading from local SQLite database...');
    const localPlaces = await localPrisma.place.findMany({
      select: {
        id: true,
        name: true,
        imageUrl: true,
        gallery: true,
      }
    });

    console.log(`📊 Found ${localPlaces.length} places in local database\n`);

    // Test connection to production
    console.log('🔌 Connecting to production database...');
    await prodPrisma.$connect();
    console.log('✅ Connected to production database\n');

    let updated = 0;
    let failed = 0;
    let skipped = 0;

    for (const place of localPlaces) {
      try {
        if (!place.imageUrl) {
          console.log(`⏭️  Skipping ${place.name} (no image)`);
          skipped++;
          continue;
        }

        // Update the production database with the image data
        await prodPrisma.place.update({
          where: { id: place.id },
          data: {
            imageUrl: place.imageUrl,
            gallery: place.gallery as any,
          }
        });

        const galleryCount = Array.isArray(place.gallery) ? place.gallery.length : 0;
        console.log(`✅ ${place.name}`);
        console.log(`   📸 Primary: ${place.imageUrl}`);
        if (galleryCount > 0) {
          console.log(`   🖼️  Gallery: ${galleryCount} additional images`);
        }
        updated++;
      } catch (error: any) {
        console.error(`❌ Failed to update ${place.name}:`, error.message);
        failed++;
      }
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log(`✅ SYNC COMPLETE!`);
    console.log(`${'='.repeat(60)}`);
    console.log(`   ✅ Updated: ${updated}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log(`${'='.repeat(60)}\n`);

  } catch (error) {
    console.error('❌ Error during sync:', error);
    process.exit(1);
  } finally {
    await localPrisma.$disconnect();
    await prodPrisma.$disconnect();
  }
}

syncImages();
