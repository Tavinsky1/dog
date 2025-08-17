// Simple import script for Berlin data
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import readline from "readline";

const prisma = new PrismaClient();

function slugify(input: string) {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function readJsonlFile(filePath: string): Promise<any[]> {
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const results: any[] = [];
  for await (const line of rl) {
    const trimmed = line.trim();
    if (trimmed) {
      try {
        results.push(JSON.parse(trimmed));
      } catch (error) {
        console.warn(`Failed to parse line: ${trimmed}`);
      }
    }
  }
  return results;
}

async function main() {
  console.log("Starting Berlin import...");
  
  const dataFile = path.join(process.cwd(), "data/berlin/sample.jsonl");
  
  if (!fs.existsSync(dataFile)) {
    console.error("Data file not found:", dataFile);
    return;
  }

  const places = await readJsonlFile(dataFile);
  console.log(`Found ${places.length} places to import`);

  let imported = 0;
  let updated = 0;
  let skipped = 0;

  for (const place of places) {
    try {
      const slug = slugify(`${place.name}-${place.district || ""}`);
      
      // Check if place already exists
      const existing = await prisma.place.findFirst({
        where: {
          AND: [
            { city: "Berlin" },
            { name: place.name }
          ]
        }
      });

      const placeData = {
        city: "Berlin",
        name: place.name,
        slug: slug,
        category: place.category,
        description: place.description || null,
        address: place.address || null,
        district: place.district || null,
        neighborhood: place.neighborhood || null,
        lat: place.lat || null,
        lng: place.lng || null,
        website: place.website || null,
        phone: place.phone || null,
        rating: place.rating || null,
        ratingCount: place.ratingCount || null,
        status: "published",
      };

      let createdPlace;
      if (existing) {
        createdPlace = await prisma.place.update({
          where: { id: existing.id },
          data: placeData
        });
        updated++;
        console.log(`Updated: ${place.name}`);
      } else {
        createdPlace = await prisma.place.create({
          data: placeData
        });
        imported++;
        console.log(`Created: ${place.name}`);
      }

      // Add features if present
      if (place.features && Object.keys(place.features).length > 0) {
        // Delete existing features first
        await prisma.placeFeature.deleteMany({
          where: { placeId: createdPlace.id }
        });
        
        // Add new features
        const features = Object.entries(place.features).map(([key, value]) => ({
          placeId: createdPlace.id,
          key,
          value: String(value)
        }));
        
        await prisma.placeFeature.createMany({
          data: features
        });
      }

      // Add photos if present
      if (place.photoUrls && place.photoUrls.length > 0) {
        const photos = place.photoUrls.slice(0, 6).map((url: string) => ({
          placeId: createdPlace.id,
          url,
          status: "approved",
          attribution: new URL(url).hostname.replace(/^www\./, "")
        }));
        
        await prisma.photo.createMany({
          data: photos,
          skipDuplicates: true
        });
      }

    } catch (error) {
      console.error(`Error importing ${place.name}:`, error);
      skipped++;
    }
  }

  console.log(`\nImport completed!`);
  console.log(`Created: ${imported}, Updated: ${updated}, Skipped: ${skipped}`);
  
  await prisma.$disconnect();
}

main().catch(console.error);
