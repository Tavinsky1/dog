import { PrismaClient } from '@prisma/client';
import fs from 'fs';

async function seed() {
  const prisma = new PrismaClient();
  
  try {
    // Load seed data
    const data = JSON.parse(fs.readFileSync('data/places.seed.json', 'utf-8'));
    const places = data.places || data;
    const cities = data.cities || [];
    
    console.log('Seeding', places.length, 'places...');
    
    // Get city slug to ID mapping from the database
    const dbCities = await prisma.city.findMany();
    const citySlugToId = {};
    for (const city of dbCities) {
      citySlugToId[city.slug] = city.id;
    }
    console.log('Found', dbCities.length, 'cities in database');
    
    // Create a mapping from old city IDs to slugs
    const oldIdToSlug = {};
    for (const city of cities) {
      oldIdToSlug[city.id] = city.slug;
    }
    
    // Seed places with corrected cityId
    let seeded = 0;
    let skipped = 0;
    for (const place of places) {
      // Get the city slug from the old ID, then get the new ID
      const citySlug = oldIdToSlug[place.cityId];
      const newCityId = citySlugToId[citySlug];
      
      if (!newCityId) {
        console.log('Skipping place', place.name, '- no city found for', place.cityId);
        skipped++;
        continue;
      }
      
      // Create place data with corrected cityId
      const placeData = { ...place, cityId: newCityId };
      delete placeData.id; // Let Postgres generate IDs
      
      await prisma.place.upsert({
        where: { slug: place.slug },
        update: placeData,
        create: placeData
      });
      seeded++;
      if (seeded % 50 === 0) {
        console.log('Progress:', seeded, '/', places.length);
      }
    }
    console.log('✓ Places seeded:', seeded, 'Skipped:', skipped);
    
    const count = await prisma.place.count();
    console.log('Total places in DB:', count);
  } finally {
    await prisma.$disconnect();
  }
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
