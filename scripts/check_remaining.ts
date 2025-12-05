import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

interface PlaceWithType {
  name: string;
  type: string;
}

interface CityWithPlaces {
  name: string;
  slug: string;
  places: PlaceWithType[];
}

async function check() {
  const cities = await prisma.city.findMany({
    include: {
      places: {
        where: { imageUrl: null },
        select: { name: true, type: true }
      }
    }
  }) as CityWithPlaces[];
  
  for (const city of cities.sort((a: CityWithPlaces, b: CityWithPlaces) => b.places.length - a.places.length)) {
    if (city.places.length > 0) {
      console.log(`\n${city.name} (${city.slug}): ${city.places.length} without images`);
      // Group by type
      const byType: Record<string, number> = {};
      city.places.forEach((p: PlaceWithType) => { byType[p.type] = (byType[p.type] || 0) + 1; });
      console.log('  Types:', Object.entries(byType).map(([k,v]) => `${k}: ${v}`).join(', '));
    }
  }
  await prisma.$disconnect();
}
check();
