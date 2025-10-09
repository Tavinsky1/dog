/**
 * Export data from SQLite (dev.db) and import to PostgreSQL (production)
 * 
 * Usage: npx tsx scripts/export_to_postgres.ts
 */

import { PrismaClient } from '@prisma/client';

// SQLite connection (local dev.db)
const sqlitePrisma = new PrismaClient({
  datasources: {
    db: {
      url: 'file:./prisma/dev.db'
    }
  }
});

// PostgreSQL connection (production)
const postgresPrisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || process.env.POSTGRES_URL
    }
  }
});

async function main() {
  console.log('🔄 Starting data migration from SQLite to PostgreSQL...\n');

  try {
    // 1. Export Cities from SQLite
    console.log('📍 Exporting cities from SQLite...');
    const cities = await sqlitePrisma.city.findMany({
      include: {
        _count: {
          select: { places: true }
        }
      }
    });
    console.log(`   ✅ Found ${cities.length} cities\n`);

    // 2. Import Cities to PostgreSQL
    console.log('📍 Importing cities to PostgreSQL...');
    for (const city of cities) {
      const { _count, ...cityData } = city;
      
      await postgresPrisma.city.upsert({
        where: { id: city.id },
        update: cityData as any,
        create: cityData as any
      });
      console.log(`   ✅ Imported: ${city.name} (${_count.places} places)`);
    }
    console.log('');

    // 3. Export Places from SQLite
    console.log('🏞️ Exporting places from SQLite...');
    const places = await sqlitePrisma.place.findMany({
      orderBy: [
        { cityId: 'asc' },
        { type: 'asc' }
      ]
    });
    console.log(`   ✅ Found ${places.length} places\n`);

    // 4. Import Places to PostgreSQL (in batches to avoid timeout)
    console.log('🏞️ Importing places to PostgreSQL...');
    const batchSize = 20;
    let imported = 0;

    for (let i = 0; i < places.length; i += batchSize) {
      const batch = places.slice(i, i + batchSize);
      
      for (const place of batch) {
        await postgresPrisma.place.upsert({
          where: { id: place.id },
          update: place as any,
          create: place as any
        });
        imported++;
        
        if (imported % 10 === 0) {
          console.log(`   ⏳ Imported ${imported}/${places.length} places...`);
        }
      }
    }
    console.log(`   ✅ Imported all ${places.length} places!\n`);

    // 5. Verify data in PostgreSQL
    console.log('✅ Verifying data in PostgreSQL...');
    const pgCities = await postgresPrisma.city.count();
    const pgPlaces = await postgresPrisma.place.count();
    
    console.log(`   📊 Cities: ${pgCities}`);
    console.log(`   📊 Places: ${pgPlaces}\n`);

    console.log('='.repeat(60));
    console.log('🎉 SUCCESS! Data migration complete!');
    console.log('='.repeat(60));
    console.log(`\n✅ Migrated ${cities.length} cities and ${places.length} places`);
    console.log(`\n🌐 Your production database is now populated!`);
    console.log(`   Visit: https://dog-atlas.vercel.app\n`);

  } catch (error) {
    console.error('❌ Error during migration:', error);
    throw error;
  } finally {
    await sqlitePrisma.$disconnect();
    await postgresPrisma.$disconnect();
  }
}

main()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
