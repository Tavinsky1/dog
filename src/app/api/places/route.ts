import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { placeCreateSchema } from "@/lib/schemas";
import { isLikelyDuplicate } from "@/lib/geo";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city") ?? "Berlin";
  const category = searchParams.get("category") ?? undefined;
  const q = searchParams.get("q") ?? undefined;
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Math.min(100, Number(searchParams.get("limit") ?? 20));
  const skip = (page - 1) * limit;

  // facet filters
  const dogsIndoor = searchParams.get("dogs_allowed_indoors") ?? undefined;
  const offLeash = searchParams.get("off_leash_allowed") ?? undefined;
  const bowls = searchParams.get("water_bowls") ?? undefined;

  const where: any = { city, status: "published" };
  if (category) where.category = category;

  // naive q filter server-side (fulltext index exists)
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { address: { contains: q, mode: "insensitive" } },
      { district: { contains: q, mode: "insensitive" } },
      { neighborhood: { contains: q, mode: "insensitive" } }
    ];
  }

  // facet joins via features table
  const featureFilters: any[] = [];
  if (dogsIndoor && dogsIndoor !== "any") {
    featureFilters.push({ key: "dogs_allowed_indoors", value: dogsIndoor });
  }
  if (offLeash && offLeash !== "any") {
    featureFilters.push({ key: "off_leash_allowed", value: offLeash });
  }
  if (bowls && bowls !== "any") {
    featureFilters.push({ key: "water_bowls", value: bowls });
  }

  const [total, items] = await Promise.all([
    prisma.place.count({ where }),
    prisma.place.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip, take: limit,
      include: {
        photos: { take: 1 },
        features: featureFilters.length ? {
          where: { OR: featureFilters }
        } : true
      }
    })
  ]);

  // if we applied facet filters, refine on server
  const filtered = featureFilters.length
    ? items.filter(p => {
        const map = new Map(p.features.map(f => [f.key, f.value]));
        return featureFilters.every(ff => map.get(ff.key) === ff.value);
      })
    : items;

  return NextResponse.json({ total, page, limit, items: filtered });
}

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = placeCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;

  // Fetch nearby with same city to dupe-check
  const candidates = await prisma.place.findMany({
    where: { city: data.city },
    select: { name: true, lat: true, lng: true }
  });

  if (isLikelyDuplicate(candidates, { name: data.name, lat: data.lat, lng: data.lng })) {
    return NextResponse.json(
      { error: "duplicate_suspected", message: "A similar place exists within ~50m. Please review before submitting." },
      { status: 409 }
    );
  }

  const place = await prisma.place.create({
    data: {
      city: data.city,
      name: data.name,
      category: data.category as any,
      description: data.description,
      address: data.address,
      district: data.district,
      neighborhood: data.neighborhood,
      lat: data.lat,
      lng: data.lng,
      website: data.website,
      phone: data.phone,
      priceLevel: data.priceLevel,
      status: "pending",
      features: data.features
        ? { create: Object.entries(data.features).map(([key, value]) => ({ key, value: String(value) })) }
        : undefined,
      hours: data.hours ? { create: data.hours } : undefined,
      activities: data.activity ? { create: { type: data.activity.type, attrs: data.activity.attrs } } : undefined
    }
  });

  await prisma.submission.create({
    data: {
      type: "new_place",
      payload: body,
      placeId: place.id,
      status: "pending"
    }
  });

  return NextResponse.json({ ok: true, id: place.id });
}
