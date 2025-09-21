const { PrismaClient } = require('@prisma/client');

async function checkPlaces() {
  const prisma = new PrismaClient();
  
  try {
    const places = await prisma.place.findMany({
      where: { city: 'Berlin' },
      select: { id: true, name: true, category: true }
    });
    
    console.log(`Found ${places.length} places in Berlin:`);
    places.forEach(place => {
      console.log(`- ${place.name} (${place.category})`);
    });
    
    if (places.length === 0) {
      console.log('\n❌ No places found! This is why category pages are empty.');
      console.log('💡 You need to import places data first.');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPlaces();
