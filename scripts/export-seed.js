#!/usr/bin/env node

/**
 * Export all places from local SQLite database to seed JSON file
 * Run this whenever you update the local database with new places
 * 
 * Usage: npm run export-seed
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Map cities to their countries
const cityToCountry = {
  'new-york': 'usa',
  'los-angeles': 'usa',
  'buenos-aires': 'argentina',
  'cordoba': 'argentina',
  'sydney': 'australia',
  'melbourne': 'australia',
  'tokyo': 'japan',
  'berlin': 'germany',
  'paris': 'france',
  'rome': 'italy',
  'barcelona': 'spain',
  'vienna': 'austria',
  'amsterdam': 'netherlands'
};

console.log('🚀 Exporting places from local database to seed file...\n');

try {
  // Check if database exists
  const dbPath = path.join(__dirname, '..', 'prisma', 'dev.db');
  if (!fs.existsSync(dbPath)) {
    console.error('❌ Error: Local database not found at prisma/dev.db');
    console.error('   Run: npx prisma db push');
    process.exit(1);
  }

  // Export all places with SQLite JSON mode
  const sql = `
    SELECT 
      p.id,
      c.slug as city,
      p.name,
      p.type as category,
      p.lat,
      p.lng as lon,
      p.shortDescription as description,
      p.fullDescription,
      p.imageUrl,
      p.websiteUrl as website,
      p.phone
    FROM Place p
    JOIN City c ON p.cityId = c.id
    ORDER BY c.slug, p.name
  `;

  console.log('📊 Querying database...');
  const json = execSync(`sqlite3 -json "${dbPath}" "${sql}"`, { encoding: 'utf-8' });
  const rawPlaces = JSON.parse(json);

  // Transform to seed format
  const places = rawPlaces.map(p => {
    const place = {
      id: p.id,
      country: cityToCountry[p.city] || 'unknown',
      city: p.city,
      name: p.name,
      category: p.category,
      lat: p.lat,
      lon: p.lon,
    };

    // Add optional fields
    if (p.description) place.description = p.description;
    if (p.fullDescription) place.fullDescription = p.fullDescription;
    if (p.imageUrl) place.photos = [p.imageUrl];
    if (p.website) place.website = p.website;
    if (p.phone) place.phone = p.phone;

    place.verified = true;

    return place;
  });

  // Count places by city
  const cityCounts = {};
  places.forEach(p => {
    cityCounts[p.city] = (cityCounts[p.city] || 0) + 1;
  });

  // Write to seed file
  const seedPath = path.join(__dirname, '..', 'data', 'places.seed.json');
  fs.writeFileSync(seedPath, JSON.stringify(places, null, 2));

  // Success summary
  console.log(`\n✅ Exported ${places.length} places to data/places.seed.json\n`);
  console.log('Places by city:');
  Object.entries(cityCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([city, count]) => {
      console.log(`  ${city}: ${count}`);
    });

  console.log('\n📦 Next steps:');
  console.log('  1. git add data/places.seed.json');
  console.log('  2. git commit -m "Update seed data with latest places"');
  console.log('  3. git push origin master');
  console.log('  4. vercel --prod');

} catch (error) {
  console.error('❌ Error exporting places:', error.message);
  process.exit(1);
}
