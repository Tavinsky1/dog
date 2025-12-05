
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDuplicates() {
  console.log('Checking for duplicate image URLs...');
  
  const places = await prisma.place.findMany({
    select: {
      id: true,
      name: true,
      imageUrl: true
    }
  });

  const urlCounts: Record<string, number> = {};
  const duplicates: string[] = [];

  for (const place of places) {
    if (place.imageUrl) {
      if (urlCounts[place.imageUrl]) {
        urlCounts[place.imageUrl]++;
        if (urlCounts[place.imageUrl] === 2) {
          duplicates.push(place.imageUrl);
        }
      } else {
        urlCounts[place.imageUrl] = 1;
      }
    }
  }

  console.log(`Total places: ${places.length}`);
  console.log(`Unique images: ${Object.keys(urlCounts).length}`);
  console.log(`Duplicate URLs found: ${duplicates.length}`);

  if (duplicates.length > 0) {
    console.log('Sample duplicates:');
    duplicates.slice(0, 5).forEach(url => console.log(` - ${url}`));
  }
}

checkDuplicates()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
