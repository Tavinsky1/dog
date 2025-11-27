import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkImages() {
  // Check places with no images or placeholder images
  const places = await prisma.place.findMany({
    select: { name: true, imageUrl: true, city: { select: { name: true } } },
    orderBy: { city: { name: 'asc' } }
  });

  let noImage = 0;
  let unsplash = 0;
  let real = 0;

  for (const p of places) {
    if (!p.imageUrl) {
      noImage++;
      console.log('[NO IMAGE]', p.city.name + ':', p.name);
    } else if (p.imageUrl.includes('unsplash.com') || p.imageUrl.includes('placeholder') || p.imageUrl.includes('picsum')) {
      unsplash++;
      console.log('[UNSPLASH/PLACEHOLDER]', p.city.name + ':', p.name, '->', p.imageUrl.substring(0, 50) + '...');
    } else {
      real++;
    }
  }

  console.log('\n=== Summary ===');
  console.log('No image:', noImage);
  console.log('Unsplash/Placeholder:', unsplash);
  console.log('Real images:', real);
  console.log('Total:', places.length);

  await prisma.$disconnect();
}

checkImages().catch(console.error);
