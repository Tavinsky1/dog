/* Seed JSONL into DB: node/ts-node scripts/seed.ts seed/berlin.jsonl */
import fs from "fs";
import readline from "readline";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function run(file: string) {
  const stream = fs.createReadStream(file, { encoding: "utf-8" });
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

  let count = 0;
  for await (const line of rl) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const obj = JSON.parse(trimmed);

    const place = await prisma.place.create({
      data: {
        city: obj.city ?? "Berlin",
        name: obj.name,
        category: obj.category,
        description: obj.description ?? null,
        address: obj.address ?? null,
        district: obj.district ?? null,
        neighborhood: obj.neighborhood ?? null,
        lat: obj.lat ?? null,
        lng: obj.lng ?? null,
        website: obj.website ?? null,
        phone: obj.phone ?? null,
        priceLevel: obj.priceLevel ?? null,
        status: "published",
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
  console.error("Usage: pnpm seed seed/berlin.jsonl");
  process.exit(1);
}
run(file).then(() => process.exit(0));
