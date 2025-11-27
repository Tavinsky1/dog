const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

async function updateAndCheck() {
  const prisma = new PrismaClient();
  
  // Update seed
  const places = await prisma.place.findMany({ orderBy: { id: 'asc' } });
  fs.writeFileSync('data/places.seed.json', JSON.stringify(places, null, 2));
  
  // Check image sources
  const withImages = places.filter(p => p.imageUrl);
  const sources = {};
  withImages.forEach(p => {
    const url = p.imageUrl;
    let source = 'other';
    if (url.includes('schleusenkrug.de')) source = 'schleusenkrug.de';
    else if (url.includes('berthillon.fr')) source = 'berthillon.fr';
    else if (url.includes('batobus.com')) source = 'batobus.com';
    else if (url.includes('good-dog-berlin.de')) source = 'good-dog-berlin.de';
    else if (url.includes('cloudinary')) source = 'cloudinary';
    else if (url.includes('unsplash')) source = 'UNSPLASH - REMOVE';
    else if (url.includes('bringfido')) source = 'BRINGFIDO - REMOVE';
    else if (url.includes('wikipedia')) source = 'WIKIPEDIA - REMOVE';
    sources[source] = (sources[source] || 0) + 1;
  });
  
  console.log('Image sources:', sources);
  console.log('\nTotal with images:', withImages.length);
  console.log('Total without images:', places.length - withImages.length);
  
  // Show sample of "other" sources
  console.log('\nSample "other" image URLs:');
  withImages.filter(p => {
    const url = p.imageUrl;
    return !url.includes('schleusenkrug') && 
           !url.includes('berthillon') && 
           !url.includes('batobus') && 
           !url.includes('good-dog-berlin') &&
           !url.includes('cloudinary');
  }).slice(0, 5).forEach(p => console.log(' -', p.name, ':', p.imageUrl.substring(0, 60)));
  
  await prisma.$disconnect();
}
updateAndCheck();
