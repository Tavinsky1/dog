/**
 * Import data from JSON exports to PostgreSQL
 * Usage: npx tsx scripts/import_from_json.ts
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Importing data to PostgreSQL...\n');

  try {
    // 1. Import Cities
    console.log('📍 Importing cities...');
    const citiesData = JSON.parse(fs.readFileSync('/tmp/cities.json', 'utf-8'));
    
    for (const city of citiesData) {
      // Parse JSON fields
      if (typeof city.bbox === 'string') {
        city.bbox = JSON.parse(city.bbox);
      }
      
      // Convert timestamps
      city.createdAt = new Date(city.createdAt);
      city.updatedAt = new Date(city.updatedAt);
      
      // Convert SQLite integer (0/1) to Boolean
      city.active = city.active === 1 || city.active === true;
      
      await prisma.city.upsert({
        where: { id: city.id },
        update: city,
        create: city
      });
      console.log(`   ✅ ${city.name}`);
    }
    console.log(`\n✅ Imported ${citiesData.length} cities\n`);

    // 2. Import Places
    console.log('🏞️ Importing places...');
    const placesData = JSON.parse(fs.readFileSync('/tmp/places.json', 'utf-8'));
    
    let imported = 0;
    for (const place of placesData) {
      // Parse JSON fields
      if (typeof place.amenities === 'string') {
        place.amenities = JSON.parse(place.amenities);
      }
      if (typeof place.gallery === 'string') {
        place.gallery = JSON.parse(place.gallery);
      }
      if (typeof place.tags === 'string') {
        place.tags = JSON.parse(place.tags);
      }
      
      // Convert timestamps
      place.createdAt = new Date(place.createdAt);
      place.updatedAt = new Date(place.updatedAt);
      
      await prisma.place.upsert({
        where: { id: place.id },
        update: place,
        create: place
      });
      
      imported++;
      if (imported % 20 === 0) {
        console.log(`   ⏳ Imported ${imported}/${placesData.length}...`);
      }
    }
    console.log(`   ✅ Imported ${placesData.length} places\n`);

    // 3. Verify
    console.log('✅ Verifying...');
    const cityCount = await prisma.city.count();
    const placeCount = await prisma.place.count();
    
    console.log(`   📊 Cities: ${cityCount}`);
    console.log(`   📊 Places: ${placeCount}\n`);

    console.log('='.repeat(60));
    console.log('🎉 SUCCESS! Your production database is populated!');
    console.log('='.repeat(60));
    console.log(`\n🌐 Visit: https://dog-atlas.vercel.app\n`);

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
