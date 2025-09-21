/* Seed JSONL into DB: npx tsx scripts/seed.ts seed/berlin.jsonl */
import fs from "fs";
import readline from "readline";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

async function run(file: string) {
  const stream = fs.createReadStream(file, { encoding: "utf-8" });
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });
  let count = 0;
  for await (const line of rl) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const obj = JSON.parse(trimmed);

    const slug = generateSlug(obj.name);
    
    const place = await prisma.place.create({
      data: {
        city: obj.city ?? "Berlin",
        name: obj.name,
        slug: slug,
        category: obj.category,
        description: obj.description ?? null,
        district: obj.district ?? null,
        neighborhood: obj.neighborhood ?? null,
        address: obj.address ?? null,
        lat: obj.lat ?? null,
        lng: obj.lng ?? null,
        website: obj.website ?? null,
        phone: obj.phone ?? null,
        priceLevel: obj.priceLevel ?? null,
        rating: 0, // Will be calculated from reviews later
        externalUrls: {}, // Keep for additional data
        features: obj.features
          ? { create: Object.entries(obj.features).map(([k, v]: any) => ({ key: k, value: String(v) })) }
          : undefined,
        hours: obj.hours ? { create: obj.hours } : undefined,
        activities: obj.activity ? { create: { type: obj.activity.type, attrs: obj.activity.attrs } } : undefined
      }
    });
    count++;
  }
  console.log(`Imported ${count} places.`);
}

const file = process.argv[2];
if (!file) {
  console.error("Usage: npx tsx scripts/seed.ts seed/berlin.jsonl");
  process.exit(1);
}
run(file).then(() => process.exit(0));
