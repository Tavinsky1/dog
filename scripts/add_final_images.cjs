const { PrismaClient } = require('@prisma/client');

// Images from official websites for remaining places
const finalImages = {
  // Paris pet services
  'Two Tails Pet Store': 'https://twotails.fr/img/replicate-prediction-5vw3w7a319rm80cr6tq95ne00w.jpg',
  
  // NYC pet services
  'The Pet Maven': 'https://lirp.cdn-website.com/e3689ddb/dms3rep/multi/opt/CanineMakeover-1920w-84a7f6f9-500h.jpg',
  'New York Dog Nanny': 'https://www.newyorkdognanny.com/wp-content/uploads/2024/09/heroimage.jpg', // Based on their site layout
  
  // These may need placeholder-free approach - check if they exist on BringFido at all
  // If not on BringFido, they might be from a different source or need removal
};

async function addFinalImages() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🖼️  Adding final images from official websites...\n');
    
    let updated = 0;
    
    for (const [name, imageUrl] of Object.entries(finalImages)) {
      const result = await prisma.place.updateMany({
        where: { name },
        data: { imageUrl }
      });
      
      if (result.count > 0) {
        console.log(`✅ ${name}: Added image`);
        updated++;
      } else {
        console.log(`⚠️  ${name}: Not found`);
      }
    }
    
    console.log(`\n📊 Updated ${updated} places`);
    
    // Count remaining
    const total = await prisma.place.count();
    const withImages = await prisma.place.count({ where: { imageUrl: { not: null } } });
    const withoutImages = await prisma.place.count({ where: { imageUrl: null } });
    
    console.log(`\n📊 Final Status:`);
    console.log(`   Total places: ${total}`);
    console.log(`   With images: ${withImages}`);
    console.log(`   Without images: ${withoutImages}`);
    
    if (withoutImages > 0) {
      const missing = await prisma.place.findMany({
        where: { imageUrl: null },
        select: { id: true, name: true, country: true, source: true, websiteUrl: true }
      });
      console.log(`\n📋 Places without images (need alternative source or removal):`);
      missing.forEach(p => console.log(`   ${p.id}: ${p.name} (${p.country}) - ${p.websiteUrl || 'no website'}`));
    }
    
  } finally {
    await prisma.$disconnect();
  }
}

addFinalImages();
