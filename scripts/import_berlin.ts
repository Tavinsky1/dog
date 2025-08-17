/* Run: pnpm ts-node --transpile-only scripts/import_berlin.ts */
import { PrismaClient } from "@prisma/client";
import { normalizePlace } from "@/lib/import/schemas";
import { readJsonlFiles, readJsonFiles, domainFrom } from "@/lib/import/io";
import { haversineMeters, namesLookSimilar } from "@/lib/geo";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();

type Existing = { id: string; name: string; slug: string; lat: number|null; lng: number|null };

async function loadInputs() {
  const arr: any[] = [];
  for await (const row of readJsonlFiles("data/berlin/**/*.jsonl")) arr.push(row);
  arr.push(...await readJsonFiles("data/berlin/**/*.json"));
  return arr;
}

async function main() {
  const raw = await loadInputs();
  const ts = new Date().toISOString().replace(/[:.]/g,"-");
  const reportDir = path.join("data", "import-report");
  await fs.promises.mkdir(reportDir, { recursive: true });
  const failures: any[] = [];
  const dupes: any[] = [];

  // existing places cache (Berlin only)
  const existing: Existing[] = await prisma.place.findMany({
    where: { city: "Berlin" },
    select: { id: true, name: true, slug: true, lat: true, lng: true }
  });

  let created = 0, updated = 0, skipped = 0;

  for (const row of raw) {
    const norm = normalizePlace(row);
    if (!norm.ok) {
      failures.push({ row, error: norm.error });
      continue;
    }
    const v = norm.value;
    // dedupe vs existing (≤60m & similar name)
    const maybeDupe = existing.find(e => {
      if (!e.lat || !e.lng || !v.lat || !v.lng) return false;
      const close = haversineMeters({ lat: e.lat, lng: e.lng }, { lat: v.lat, lng: v.lng }) <= 60;
      return close && namesLookSimilar(e.name, v.name);
    });
    if (maybeDupe) {
      dupes.push({ candidate: v, duplicateOf: maybeDupe });
      skipped++;
      continue;
    }

    const dataBase: any = {
      city: "Berlin",
      name: v.name,
      slug: v.slug,
      category: v.category,
      description: v.description ?? null,
      address: v.address ?? null,
      district: v.district ?? null,
      neighborhood: v.neighborhood ?? null,
      lat: v.lat ?? null,
      lng: v.lng ?? null,
      website: v.website ?? null,
      phone: v.phone ?? null,
      rating: v.rating ?? null,
      ratingCount: v.ratingCount ?? null,
      status: "published" as const,
    };

    // upsert on (city, slug)
    const existingBySlug = await prisma.place.findFirst({ where: { city: "Berlin", slug: v.slug } });
    const place = existingBySlug
      ? await prisma.place.update({
          where: { id: existingBySlug.id },
          data: {
            ...dataBase,
            // rating/ratingCount: prefer higher ratingCount
            ...(v.ratingCount != null && ((existingBySlug as any).ratingCount ?? 0) <= v.ratingCount
              ? { rating: v.rating ?? existingBySlug.rating, ratingCount: v.ratingCount }
              : {}),
          }
        })
      : await prisma.place.create({ data: dataBase });

    if (existingBySlug) updated++; else { created++; existing.push({ id: place.id, name: place.name, slug: place.slug, lat: place.lat, lng: place.lng }); }

    // features
    if (v.features && Object.keys(v.features).length) {
      const pairs = Object.entries(v.features).map(([key, value]) => ({ key, value: String(value) }));
      await prisma.placeFeature.createMany({
        data: pairs.map(p => ({ placeId: place.id, ...p })),
        skipDuplicates: true,
      });
    }

    // activity
    if (v.activity?.type) {
      const existingAct = await prisma.activity.findUnique({ where: { placeId: place.id } });
      if (!existingAct) {
        await prisma.activity.create({
          data: { placeId: place.id, type: v.activity.type, attrs: v.activity.attrs ?? {} as any }
        });
      }
    }

    // photos
    if (v.photoUrls?.length) {
      const toCreate = v.photoUrls.slice(0, 6).map(url => ({
        placeId: place.id,
        url,
        status: "approved" as const,
        attribution: domainFrom(url),
      }));
      await prisma.photo.createMany({ data: toCreate, skipDuplicates: true });
    }

    // sources (optional JSON column). If you don't have it, comment out.
    // await prisma.place.update({ where: { id: place.id }, data: { sources: v.sourceUrls ?? [] } });
  }

  await fs.promises.writeFile(path.join(reportDir, `failed_${ts}.json`), JSON.stringify(failures, null, 2));
  await fs.promises.writeFile(path.join(reportDir, `dupes_${ts}.json`), JSON.stringify(dupes, null, 2));

  console.log(`Imported: ${created}, Updated: ${updated}, Skipped(Dupes): ${skipped}, Failures: ${failures.length}`);
}

main().then(()=>process.exit(0)).catch(e=>{ console.error(e); process.exit(1); });
