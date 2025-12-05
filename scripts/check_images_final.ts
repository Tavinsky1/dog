
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkImages() {
  const totalPlaces = await prisma.place.count();
  const placesWithImages = await prisma.place.count({
    where: {
      imageUrl: {
        not: null
      }
    }
  });

  const placesWithLocalImages = await prisma.place.count({
    where: {
      imageUrl: {
        startsWith: '/images/places/'
      }
    }
  });

  console.log(`Total Places: ${totalPlaces}`);
  console.log(`Places with Images: ${placesWithImages}`);
  console.log(`Places with Local Images: ${placesWithLocalImages}`);

  const cities = await prisma.city.findMany({
    where: {
      name: {
        in: ['Los Angeles', 'New York', 'Buenos Aires', 'Copenhagen']
      }
    },
    select: {
      name: true,
      slug: true
    }
  });

  console.log('City Slugs:', JSON.stringify(cities, null, 2));
}

checkImages()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
