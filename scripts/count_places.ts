import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const cities = await prisma.city.findMany({
    include: { _count: { select: { places: true } } },
    orderBy: { name: 'asc' }
  });
  
  console.log('\nCity Place Counts:');
  console.log('==================');
  let total = 0;
  for (const city of cities) {
    console.log(`${city.name}: ${city._count.places} places`);
    total += city._count.places;
  }
  console.log('==================');
  console.log(`Total: ${cities.length} cities, ${total} places\n`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(e => {
    console.error(e);
    prisma.$disconnect();
  });
