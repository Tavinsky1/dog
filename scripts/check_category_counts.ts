import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const results = await prisma.place.groupBy({
    by: ['cityId', 'type'],
    _count: { id: true },
    orderBy: [{ cityId: 'asc' }, { type: 'asc' }]
  });
  
  const cities = await prisma.city.findMany({ select: { id: true, name: true } });
  const cityMap: Record<string, string> = {};
  for (const c of cities) {
    cityMap[c.id] = c.name;
  }
  
  // Group by city
  const byCityType: Record<string, Record<string, number>> = {};
  for (const r of results) {
    const cityName = cityMap[r.cityId] || r.cityId;
    if (!byCityType[cityName]) byCityType[cityName] = {};
    byCityType[cityName][r.type] = r._count.id;
  }
  
  const categories = ['parks', 'cafes_restaurants', 'accommodation', 'shops_services', 'walks_trails', 'tips_local_info'];
  
  console.log('\nPlaces per City per Category (Target: 15+ each):');
  console.log('=================================================\n');
  
  for (const city of Object.keys(byCityType).sort()) {
    console.log(`${city}:`);
    let total = 0;
    for (const cat of categories) {
      const count = byCityType[city][cat] || 0;
      total += count;
      const status = count >= 15 ? '✅' : `❌ need ${15 - count} more`;
      console.log(`  ${cat}: ${count} ${status}`);
    }
    console.log(`  TOTAL: ${total}\n`);
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(e => {
    console.error(e);
    prisma.$disconnect();
  });
