import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing stock/placeholder images from places...\n');
  
  // Clear all Unsplash images (stock photos)
  const result = await prisma.place.updateMany({
    where: {
      OR: [
        { imageUrl: { contains: 'unsplash' } },
        { imageUrl: { contains: 'placeholder' } }
      ]
    },
    data: {
      imageUrl: null
    }
  });
  
  console.log(`✓ Cleared ${result.count} stock images`);
  
  // Show final stats
  const total = await prisma.place.count();
  const withImages = await prisma.place.count({ where: { imageUrl: { not: null } } });
  
  console.log(`\nFinal status:`);
  console.log(`  Total places: ${total}`);
  console.log(`  With real images: ${withImages}`);
  console.log(`  Without images (will show category icons): ${total - withImages}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
