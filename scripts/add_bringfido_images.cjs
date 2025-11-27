const { PrismaClient } = require('@prisma/client');

// Real images from BringFido - verified working URLs
const bringFidoImages = {
  // NYC
  'Barking Dog': 'https://photos.bringfido.com/photo/2009/06/30/luncheonette.jpg?size=slide600&density=2x',
  'La Bonbonniere': 'https://photos.bringfido.com/restaurants/8/7/2/3278/3278_48382.jpg?size=slide600&density=2x',
  'Gemma': 'https://photos.bringfido.com/restaurants/8978/20160616_3218_8978.jpg?size=slide600&density=2x',
  
  // LA
  'Eveleigh': 'https://photos.bringfido.com/photo/2011/06/20/Eveleigh_photo.jpg?size=slide600&density=2x',
};

async function addBringFidoImages() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🖼️  Adding BringFido images...\n');
    
    let updated = 0;
    
    for (const [name, imageUrl] of Object.entries(bringFidoImages)) {
      const result = await prisma.place.updateMany({
        where: { name },
        data: { imageUrl }
      });
      
      if (result.count > 0) {
        console.log(`✅ ${name}: Added BringFido image`);
        updated++;
      } else {
        console.log(`⚠️  ${name}: Not found in database`);
      }
    }
    
    console.log(`\n📊 Updated ${updated} places`);
    
    // Count remaining
    const withoutImages = await prisma.place.count({ where: { imageUrl: null } });
    console.log(`📋 Still need images: ${withoutImages}`);
    
  } finally {
    await prisma.$disconnect();
  }
}

addBringFidoImages();
