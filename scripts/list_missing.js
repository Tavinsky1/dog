import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function listPlaces() {
  const cities = ['tokyo', 'sydney', 'melbourne', 'new-york', 'los-angeles', 'vancouver', 'buenos-aires'];
  
  for (const citySlug of cities) {
    const places = await prisma.place.findMany({
      where: { 
        city: { slug: citySlug },
        imageUrl: null 
      },
      select: { name: true, type: true }
    });
    
    console.log('\n=== ' + citySlug.toUpperCase() + ' ===');
    const byType = {};
    for (const p of places) {
      if (!byType[p.type]) byType[p.type] = [];
      byType[p.type].push(p.name);
    }
    
    for (const [type, names] of Object.entries(byType)) {
      if (type !== 'shops_services' && type !== 'tips_local_info') {
        console.log('\n' + type + ':');
        for (const n of names) {
          console.log('  "' + n + '",');
        }
      }
    }
  }
  await prisma.$disconnect();
}
listPlaces();
