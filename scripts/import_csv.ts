import fs from "fs";
import path from "path";
import { parse } from "fast-csv";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
        
        for (const place of places) {
          try {
            const slug = generateSlug(place.name);
            
            await prisma.place.upsert({
              where: { id: place.id },
              update: {
                name: place.name,
                slug: slug,
                city: place.city,
                description: place.full_description || place.short_description,
                category: place.type,
                district: place.region,
                address: place.region,
                lat: parseFloat(place.latitude) || null,
                lng: parseFloat(place.longitude) || null,
                website: place.website_url,
                phone: place.contact_phone,
                priceLevel: place.price_range,
                rating: parseFloat(place.rating) || 0,
                externalUrls: {
                  image_url: place.image_url,
                  gallery_urls: place.gallery_urls,
                  amenities: place.amenities,
                  rules: place.rules,
                  tags: place.tags
                }
              },
              create: {
                id: place.id,
                name: place.name,
                slug: slug,
                city: place.city,
                description: place.full_description || place.short_description,
                category: place.type,
                district: place.region,
                address: place.region,
                lat: parseFloat(place.latitude) || null,
                lng: parseFloat(place.longitude) || null,
                website: place.website_url,
                phone: place.contact_phone,
                priceLevel: place.price_range,
                rating: parseFloat(place.rating) || 0,
                externalUrls: {
                  image_url: place.image_url,
                  gallery_urls: place.gallery_urls,
                  amenities: place.amenities,
                  rules: place.rules,
                  tags: place.tags
                }
              }
            });
          } catch (error) {
            console.error(`Error importing place ${place.name}:`, error);
          }
        }
        
        console.log(`Imported ${places.length} places from ${path.basename(filePath)}`);
        resolve(places.length);
      })
      .on('error', reject);
  });
}

async function main() {
  try {
    const csvFiles = [
      'data/dog_atlas_berlin_v0_7.csv',
      'data/dog_atlas_paris_v0_7.csv',
      'data/dog_atlas_barcelona_v0_7.csv',
      'data/dog_atlas_rome_v0_7.csv'
    ];
    
    let totalImported = 0;
    
    for (const file of csvFiles) {
      if (fs.existsSync(file)) {
        console.log(`Importing ${file}...`);
        const count = await importCSV(file);
        totalImported += count as number;
      } else {
        console.log(`File ${file} not found, skipping...`);
      }
    }
    
    console.log(`Total imported: ${totalImported} places`);
  } catch (error) {
    console.error('Import failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
