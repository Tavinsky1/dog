const { PrismaClient } = require('@prisma/client');

async function cleanImages() {
  const prisma = new PrismaClient();
  try {
    // Remove all placeholder images (Unsplash, placeholder services, etc.)
    const result = await prisma.place.updateMany({
      where: {
        OR: [
          { imageUrl: { contains: 'unsplash' } },
          { imageUrl: { contains: 'placeholder' } },
          { imageUrl: { contains: 'picsum' } },
          { imageUrl: { contains: 'lorem' } }
        ]
      },
      data: { imageUrl: null }
    });
    
    console.log('🧹 Removed', result.count, 'placeholder images');
    
    // Check current state
    const places = await prisma.place.findMany();
    const withImages = places.filter(p => p.imageUrl);
    const withoutImages = places.filter(p => !p.imageUrl);
    
    console.log('\n📊 Current Image Status:');
    console.log('   Total places:', places.length);
    console.log('   With REAL images:', withImages.length);
    console.log('   Without images:', withoutImages.length);
    
    // Show which sources have images
    const bringfidoPlaces = places.filter(p => p.source === 'BringFido');
    const bringfidoWithImages = bringfidoPlaces.filter(p => p.imageUrl);
    console.log('\n   BringFido places:', bringfidoPlaces.length);
    console.log('   BringFido with real images:', bringfidoWithImages.length);
    
  } finally {
    await prisma.$disconnect();
  }
}

cleanImages();
