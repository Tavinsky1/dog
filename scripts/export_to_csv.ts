/**
 * Export all places from Supabase to CSV for backup
 */
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgres://postgres.eqitcwamtvggscanypwy:Y4Bhtt1fM0iJ1IvA@aws-1-eu-central-1.pooler.supabase.com:5432/postgres?sslmode=require"
    }
  }
});

async function exportToCSV() {
  console.log('📊 Exporting data from Supabase...\n');

  // Export cities
  const cities = await prisma.city.findMany({
    orderBy: { country: 'asc' }
  });
  
  console.log(`Found ${cities.length} cities`);
  
  const cityCsv = [
    'id,slug,name,region,country,lat,lng,active,createdAt,updatedAt'
  ];
  
  for (const city of cities) {
    cityCsv.push([
      city.id,
      city.slug,
      `"${city.name}"`,
      city.region ? `"${city.region}"` : '',
      `"${city.country}"`,
      city.lat,
      city.lng,
      city.active,
      city.createdAt.toISOString(),
      city.updatedAt.toISOString()
    ].join(','));
  }
  
  fs.writeFileSync('backups/cities_backup.csv', cityCsv.join('\n'));
  console.log('✅ Exported cities to backups/cities_backup.csv');

  // Export places by country
  const places = await prisma.place.findMany({
    orderBy: [{ country: 'asc' }, { name: 'asc' }],
    include: { city: true }
  });
  
  console.log(`Found ${places.length} places`);
  
  const placeCsv = [
    'id,slug,name,type,city,cityId,country,region,lat,lng,shortDescription,imageUrl,websiteUrl,phone,rating,hasWaterBowl,offLeashAllowed,hasOutdoorSeating,createdAt'
  ];
  
  for (const place of places) {
    placeCsv.push([
      place.id,
      place.slug,
      `"${place.name.replace(/"/g, '""')}"`,
      place.type,
      `"${place.city?.name || ''}"`,
      place.cityId,
      `"${place.country}"`,
      place.region ? `"${place.region}"` : '',
      place.lat,
      place.lng,
      `"${(place.shortDescription || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
      place.imageUrl || '',
      place.websiteUrl || '',
      place.phone || '',
      place.rating || '',
      place.hasWaterBowl || false,
      place.offLeashAllowed || false,
      place.hasOutdoorSeating || false,
      place.createdAt.toISOString()
    ].join(','));
  }
  
  fs.writeFileSync('backups/places_backup.csv', placeCsv.join('\n'));
  console.log('✅ Exported places to backups/places_backup.csv');

  // Summary by country
  const countryStats: Record<string, number> = {};
  for (const place of places) {
    countryStats[place.country] = (countryStats[place.country] || 0) + 1;
  }
  
  console.log('\n📊 Places by country:');
  Object.entries(countryStats)
    .sort((a, b) => b[1] - a[1])
    .forEach(([country, count]) => {
      console.log(`   ${country}: ${count}`);
    });

  await prisma.$disconnect();
  console.log('\n🎉 Export complete!');
}

exportToCSV().catch(console.error);
