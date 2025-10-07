#!/usr/bin/env npx tsx

import fs from "fs";
import path from "path";
import { parse } from "fast-csv";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Category mapping from CSV types to consolidated categories
function mapCategory(csvType: string): string {
  const type = csvType.toLowerCase();

  // Parks
  if (type.includes('park') || type.includes('airfield') || type.includes('forest') || type.includes('urban park')) {
    return 'parks';
  }

  // Cafés & Restaurants
  if (type.includes('cafe') || type.includes('restaurant') || type.includes('bar') || type.includes('brewery')) {
    return 'cafes_restaurants';
  }

  // Accommodation
  if (type.includes('hotel') || type.includes('hostel') || type.includes('bnb') || type.includes('apartment')) {
    return 'accommodation';
  }

  // Shops & Services
  if (type.includes('vet') || type.includes('groom') || type.includes('store') || type.includes('clinic') || type.includes('training')) {
    return 'shops_services';
  }

  // Walks & Trails
  if (type.includes('trail') || type.includes('walk') || type.includes('hiking') || type.includes('beach') || type.includes('lake')) {
    return 'walks_trails';
  }

  // Default to tips_local_info
  return 'tips_local_info';
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

async function importCSV(filePath: string) {
  const places: any[] = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(parse({ headers: true }))
      .on('data', (row) => {
        places.push(row);
      })
      .on('end', async () => {
        console.log(`Found ${places.length} places in ${filePath}`);

        let imported = 0;
        let skipped = 0;

        for (const place of places) {
          try {
            // Find or create city
            let city = await prisma.city.findFirst({
              where: { name: place.city }
            });

            if (!city) {
              city = await prisma.city.create({
                data: {
                  name: place.city,
                  slug: place.city.toLowerCase(),
                  country: place.country || 'Germany',
                  lat: parseFloat(place.latitude) || 0,
                  lng: parseFloat(place.longitude) || 0
                }
              });
            }

            const slug = generateSlug(place.name);
            const mappedCategory = mapCategory(place.type);

            await prisma.place.create({
              data: {
                name: place.name,
                slug: slug,
                type: mappedCategory as any,
                cityId: city.id,
                country: place.country || 'Germany',
                lat: parseFloat(place.latitude) || 0,
                lng: parseFloat(place.longitude) || 0,
                shortDescription: place.short_description || '',
                fullDescription: place.full_description,
                imageUrl: place.image_url,
                dogFriendlyLevel: place.dog_friendly_level ? parseInt(place.dog_friendly_level) : null,
                rules: place.rules,
                websiteUrl: place.website_url,
                phone: place.contact_phone,
                email: place.contact_email,
                priceRange: place.price_range,
                openingHours: place.opening_hours,
                rating: place.rating ? parseFloat(place.rating) : null,
                source: 'csv_import'
              }
            });

            imported++;
            console.log(`✓ Imported: ${place.name} (${mappedCategory})`);

          } catch (error) {
            console.error(`Error importing ${place.name}:`, error);
            skipped++;
          }
        }

        console.log(`\n=== Import Summary ===`);
        console.log(`Imported: ${imported} places`);
        console.log(`Skipped: ${skipped} places`);
        resolve(true);
      })
      .on('error', reject);
  });
}

async function main() {
  const csvFiles = [
    'data/dog_atlas_berlin_v0_7.csv',
    'data/dog_atlas_paris_v0_7.csv',
    'data/dog_atlas_rome_v0_7.csv',
    'data/dog_atlas_barcelona_v0_7.csv'
  ];

  for (const csvFile of csvFiles) {
    const filePath = path.join(process.cwd(), csvFile);
    if (fs.existsSync(filePath)) {
      console.log(`\n📁 Importing ${csvFile}...`);
      await importCSV(filePath);
    } else {
      console.log(`⚠️  File not found: ${csvFile}`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });