/**
 * Migrate data from local SQLite to Supabase PostgreSQL
 * This script reads from local JSON exports and inserts into Supabase
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

// Supabase connection
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgres://postgres.eqitcwamtvggscanypwy:Y4Bhtt1fM0iJ1IvA@aws-1-eu-central-1.pooler.supabase.com:5432/postgres?sslmode=require"
    }
  }
});

async function migrate() {
  console.log('🚀 Starting migration to Supabase...\n');

  try {
    // Read exported data
    const cities = JSON.parse(fs.readFileSync('/tmp/cities.json', 'utf-8'));
    const places = JSON.parse(fs.readFileSync('/tmp/places.json', 'utf-8'));
    const users = JSON.parse(fs.readFileSync('/tmp/users.json', 'utf-8'));

    console.log(`📊 Data to migrate:`);
    console.log(`   - Cities: ${cities.length}`);
    console.log(`   - Places: ${places.length}`);
    console.log(`   - Users: ${users.length}\n`);

    // Migrate Cities
    console.log('📍 Migrating cities...');
    for (const city of cities) {
      await prisma.city.upsert({
        where: { id: city.id },
        update: {},
        create: {
          id: city.id,
          slug: city.slug,
          name: city.name,
          region: city.region,
          country: city.country,
          lat: city.lat,
          lng: city.lng,
          bbox: city.bbox,
          active: city.active === 1,
          createdAt: new Date(city.createdAt),
          updatedAt: new Date(city.updatedAt),
        }
      });
    }
    console.log(`   ✅ ${cities.length} cities migrated\n`);

    // Migrate Users
    console.log('👤 Migrating users...');
    for (const user of users) {
      await prisma.user.upsert({
        where: { id: user.id },
        update: {},
        create: {
          id: user.id,
          email: user.email,
          emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
          username: user.username,
          name: user.name,
          image: user.image,
          password: user.password,
          role: user.role || 'USER',
          bio: user.bio,
          createdAt: new Date(user.createdAt),
          updatedAt: new Date(user.updatedAt),
        }
      });
    }
    console.log(`   ✅ ${users.length} users migrated\n`);

    // Migrate Places
    console.log('🏠 Migrating places...');
    let placeCount = 0;
    for (const place of places) {
      try {
        await prisma.place.upsert({
          where: { id: place.id },
          update: {},
          create: {
            id: place.id,
            slug: place.slug,
            name: place.name,
            shortDescription: place.shortDescription || '',
            fullDescription: place.fullDescription,
            cityId: place.cityId,
            country: place.country,
            region: place.region,
            type: place.type as any,
            lat: place.lat,
            lng: place.lng,
            imageUrl: place.imageUrl,
            gallery: place.gallery,
            dogFriendlyLevel: place.dogFriendlyLevel,
            amenities: place.amenities,
            rules: place.rules,
            websiteUrl: place.websiteUrl,
            phone: place.phone,
            email: place.email,
            priceRange: place.priceRange as any,
            openingHours: place.openingHours,
            rating: place.rating,
            tags: place.tags,
            source: place.source,
            dogSizeAllowed: place.dogSizeAllowed as any,
            hasWaterBowl: place.hasWaterBowl === 1,
            offLeashAllowed: place.offLeashAllowed === 1,
            hasOutdoorSeating: place.hasOutdoorSeating === 1,
            petFee: place.petFee,
            maxDogsAllowed: place.maxDogsAllowed,
            createdAt: new Date(place.createdAt),
            updatedAt: new Date(place.updatedAt),
          }
        });
        placeCount++;
        if (placeCount % 50 === 0) {
          console.log(`   ... ${placeCount}/${places.length} places migrated`);
        }
      } catch (err: any) {
        console.log(`   ⚠️ Skipped place ${place.name}: ${err.message}`);
      }
    }
    console.log(`   ✅ ${placeCount} places migrated\n`);

    // Verify migration
    console.log('🔍 Verifying migration...');
    const cityCount = await prisma.city.count();
    const userCount = await prisma.user.count();
    const placeCountDb = await prisma.place.count();
    
    console.log(`   Cities in Supabase: ${cityCount}`);
    console.log(`   Users in Supabase: ${userCount}`);
    console.log(`   Places in Supabase: ${placeCountDb}`);

    console.log('\n🎉 Migration complete!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrate();
