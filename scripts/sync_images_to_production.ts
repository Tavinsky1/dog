import { PrismaClient } from '@prisma/client';

// Local SQLite database (source of truth for images)
const localPrisma = new PrismaClient({
  datasources: {
    db: {
      url: 'file:./prisma/dev.db'
    }
  }
});

// Production database (needs to be updated)
const prodPrisma = new PrismaClient();

async function syncImages() {
  console.log('�� Starting image sync from local to production...\n');

  try {
    // Get all places from local database with their images
    const localPlaces = await localPrisma.place.findMany({
      select: {
        id: true,
        name: true,
        imageUrl: true,
        gallery: true,
      }
    });

    console.log(`📊 Found ${localPlaces.length} places in local database\n`);

    let updated = 0;
    let failed = 0;

    for (const place of localPlaces) {
      try {
        // Update the production database with the image data
        await prodPrisma.place.update({
          where: { id: place.id },
          data: {
            imageUrl: place.imageUrl,
            gallery: place.gallery,
          }
        });

        console.log(`✅ ${place.name}: ${place.imageUrl}`);
        if (Array.isArray(place.gallery) && place.gallery.length > 0) {
          console.log(`   📸 Gallery: ${place.gallery.length} images`);
        }
        updated++;
      } catch (error: any) {
        console.error(`❌ Failed to update ${place.name}:`, error.message);
        failed++;
      }
    }

    console.log(`\n✅ Sync complete!`);
    console.log(`   Updated: ${updated}`);
    console.log(`   Failed: ${failed}`);

  } catch (error) {
    console.error('❌ Error during sync:', error);
  } finally {
    await localPrisma.$disconnect();
    await prodPrisma.$disconnect();
  }
}

syncImages();
