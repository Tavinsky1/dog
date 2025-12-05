
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const city = await prisma.city.findUnique({
    where: { slug: 'paris' },
    include: {
      places: true
    }
  });

  if (!city) {
    console.log('Paris not found!');
    return;
  }

  console.log(`Paris found: ${city.name} (${city.lat}, ${city.lng})`);
  console.log(`Total places: ${city.places.length}`);

  const validPlaces = city.places.filter(p => p.lat !== null && p.lng !== null);
  console.log(`Places with coordinates: ${validPlaces.length}`);

  if (validPlaces.length > 0) {
    console.log('First 5 places:');
    validPlaces.slice(0, 5).forEach(p => {
      console.log(`- ${p.name}: ${p.lat}, ${p.lng}`);
    });
  } else {
    console.log('No places with coordinates!');
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
