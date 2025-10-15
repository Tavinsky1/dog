import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';

const prisma = new PrismaClient();

interface CSVPlace {
  country: string;
  city: string;
  name: string;
  category: string;
  lat: string;
  lon: string;
  description: string;
  address: string;
  website: string;
  phone: string;
  photo_url: string;
  verified: string;
}

// Map CSV country slugs to countries.json country names
const COUNTRY_MAP: Record<string, string> = {
  'united-states': 'United States',
  'australia': 'Australia',
  'argentina': 'Argentina',
  'japan': 'Japan',
  'austria': 'Austria',
  'netherlands': 'Netherlands',
};

// Map CSV city slugs to proper city names and coordinates
const CITY_MAP: Record<string, { name: string; lat: number; lng: number }> = {
  'new-york': { name: 'New York', lat: 40.7128, lng: -74.006 },
  'los-angeles': { name: 'Los Angeles', lat: 34.0522, lng: -118.2437 },
  'sydney': { name: 'Sydney', lat: -33.8688, lng: 151.2093 },
  'melbourne': { name: 'Melbourne', lat: -37.8136, lng: 144.9631 },
  'buenos-aires': { name: 'Buenos Aires', lat: -34.6037, lng: -58.3816 },
  'cordoba': { name: 'Córdoba', lat: -31.4201, lng: -64.1888 },
  'tokyo': { name: 'Tokyo', lat: 35.6762, lng: 139.6503 },
  'vienna': { name: 'Vienna', lat: 48.2082, lng: 16.3738 },
  'amsterdam': { name: 'Amsterdam', lat: 52.3676, lng: 4.9041 },
};

// Map CSV categories to PlaceType enum
const CATEGORY_MAP: Record<string, 'parks' | 'cafes_restaurants' | 'accommodation' | 'shops_services' | 'walks_trails' | 'tips_local_info'> = {
  'parks': 'parks',
  'cafes_restaurants': 'cafes_restaurants',
  'trails': 'walks_trails',
  'hotels': 'accommodation',
  'shops': 'shops_services',
  'vets': 'shops_services',
  'groomers': 'shops_services',
  'trainers': 'shops_services',
};

async function importCSV(csvPath: string) {
  const filename = path.basename(csvPath);
  console.log(`\n📂 Processing ${filename}...`);

  // Read and parse CSV
  const fileContent = fs.readFileSync(csvPath, 'utf-8');
  const records: CSVPlace[] = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  console.log(`   Found ${records.length} places`);

  let imported = 0;
  let skipped = 0;

  for (const record of records) {
    try {
      // Get proper country and city info
      const countryName = COUNTRY_MAP[record.country] || record.country;
      const cityInfo = CITY_MAP[record.city];
      
      if (!cityInfo) {
        console.warn(`   ⚠️  Unknown city: ${record.city}`);
        skipped++;
        continue;
      }

      // Find or create city
      let city = await prisma.city.findFirst({
        where: { slug: record.city },
      });

      if (!city) {
        console.log(`   Creating city: ${cityInfo.name}`);
        city = await prisma.city.create({
          data: {
            slug: record.city,
            name: cityInfo.name,
            country: countryName,
            lat: cityInfo.lat,
            lng: cityInfo.lng,
          },
        });
      }

      // Check if place already exists
      const existing = await prisma.place.findFirst({
        where: {
          slug: record.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          cityId: city.id,
        },
      });

      if (existing) {
        skipped++;
        continue;
      }

      // Map category to PlaceType enum
      const placeType = CATEGORY_MAP[record.category];
      if (!placeType) {
        console.warn(`   ⚠️  Unknown category for ${record.name}: ${record.category}`);
        skipped++;
        continue;
      }

      // Validate coordinates
      const lat = parseFloat(record.lat);
      const lon = parseFloat(record.lon);

      if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
        console.warn(`   ⚠️  Invalid coordinates for ${record.name}: (${record.lat}, ${record.lon})`);
        skipped++;
        continue;
      }

      // Create place
      await prisma.place.create({
        data: {
          slug: record.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          name: record.name,
          type: placeType,
          shortDescription: record.description || '',
          fullDescription: record.description || '',
          websiteUrl: record.website || null,
          phone: record.phone || null,
          imageUrl: record.photo_url || null,
          lat,
          lng: lon,
          country: record.address || record.city, // Store address in country field (matches existing pattern)
          cityId: city.id,
        },
      });

      imported++;
    } catch (error) {
      console.error(`   ❌ Error importing ${record.name}:`, error);
      skipped++;
    }
  }

  console.log(`   ✅ Imported: ${imported}, Skipped: ${skipped}`);
  return { imported, skipped };
}

async function main() {
  console.log('🚀 Starting CSV import to database...\n');

  const seedDir = path.join(process.cwd(), 'seed');
  const csvFiles = fs.readdirSync(seedDir).filter(f => f.endsWith('.csv'));

  console.log(`Found ${csvFiles.length} CSV files in seed/ directory`);

  let totalImported = 0;
  let totalSkipped = 0;

  for (const file of csvFiles) {
    const { imported, skipped } = await importCSV(path.join(seedDir, file));
    totalImported += imported;
    totalSkipped += skipped;
  }

  console.log('\n' + '='.repeat(50));
  console.log(`✨ Import complete!`);
  console.log(`   Total imported: ${totalImported}`);
  console.log(`   Total skipped: ${totalSkipped}`);
  console.log('='.repeat(50));

  // Show summary by city
  const cities = await prisma.city.findMany({
    include: {
      _count: {
        select: { places: true },
      },
    },
    orderBy: { name: 'asc' },
  });

  console.log('\n📊 Places by city:');
  cities.forEach(city => {
    console.log(`   ${city.name}: ${city._count.places} places`);
  });
}

main()
  .catch((e) => {
    console.error('❌ Import failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
