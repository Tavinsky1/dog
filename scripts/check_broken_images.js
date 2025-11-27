import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkBrokenImages() {
  const places = await prisma.place.findMany({
    select: { id: true, name: true, imageUrl: true, city: { select: { name: true } } },
    orderBy: { city: { name: 'asc' } }
  });

  console.log('Checking', places.length, 'image URLs...\n');
  
  let broken = [];
  let working = 0;
  
  for (const p of places) {
    if (!p.imageUrl) continue;
    
    try {
      const response = await fetch(p.imageUrl, { method: 'HEAD', redirect: 'follow' });
      if (!response.ok) {
        broken.push({ city: p.city.name, name: p.name, url: p.imageUrl, status: response.status });
      } else {
        working++;
        if (working % 50 === 0) console.log('Checked', working, 'working images...');
      }
    } catch (error) {
      broken.push({ city: p.city.name, name: p.name, url: p.imageUrl, error: error.message });
    }
  }

  console.log('\n=== Broken Images ===');
  for (const b of broken) {
    console.log(`[BROKEN] ${b.city}: ${b.name}`);
    console.log(`  URL: ${b.url.substring(0, 80)}...`);
    console.log(`  Error: ${b.status || b.error}`);
  }

  console.log('\n=== Summary ===');
  console.log('Working:', working);
  console.log('Broken:', broken.length);
  console.log('Total:', places.length);

  await prisma.$disconnect();
}

checkBrokenImages().catch(console.error);
