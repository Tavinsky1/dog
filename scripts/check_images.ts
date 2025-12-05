import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const total = await prisma.place.count();
  const withImages = await prisma.place.count({ where: { imageUrl: { not: null } } });
  const unsplashImages = await prisma.place.count({ where: { imageUrl: { contains: 'unsplash' } } });
  const wikimediaImages = await prisma.place.count({ where: { imageUrl: { contains: 'wikimedia' } } });
  const noImages = total - withImages;
  
  console.log('Place Image Status:');
  console.log(`  Total places: ${total}`);
  console.log(`  With images: ${withImages}`);
  console.log(`  Without images: ${noImages}`);
  console.log(`  Unsplash images: ${unsplashImages}`);
  console.log(`  Wikimedia images: ${wikimediaImages}`);
  
  // Sample some places with Unsplash images
  const sampleUnsplash = await prisma.place.findMany({
    where: { imageUrl: { contains: 'unsplash' } },
    take: 5,
    select: { name: true, imageUrl: true }
  });
  
  if (sampleUnsplash.length > 0) {
    console.log('\nSample Unsplash places:');
    sampleUnsplash.forEach(p => console.log(`  - ${p.name}: ${p.imageUrl?.substring(0, 60)}...`));
  }
}

main().finally(() => prisma.$disconnect());
