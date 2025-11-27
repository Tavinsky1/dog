const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

async function exportToSeed() {
  const prisma = new PrismaClient();
  
  try {
    console.log('📤 Exporting current database to seed file...\n');
    
    // Export all places
    const places = await prisma.place.findMany({
      orderBy: [{ name: 'asc' }]
    });
    
    console.log(`✅ Found ${places.length} places`);
    
    // Verify all have images
    const withoutImages = places.filter(p => !p.imageUrl);
    if (withoutImages.length > 0) {
      console.log(`⚠️  Warning: ${withoutImages.length} places without images!`);
      withoutImages.forEach(p => console.log(`   - ${p.name}`));
    } else {
      console.log(`✅ All places have real images`);
    }
    
    // Export cities
    const cities = await prisma.city.findMany({
      orderBy: { name: 'asc' }
    });
    console.log(`✅ Found ${cities.length} cities`);
    
    // Export reviews
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: 'desc' }
    });
    console.log(`✅ Found ${reviews.length} reviews`);
    
    // Create seed data object
    const seedData = {
      exportedAt: new Date().toISOString(),
      stats: {
        places: places.length,
        cities: cities.length,
        reviews: reviews.length,
        allPlacesHaveImages: withoutImages.length === 0
      },
      cities,
      places,
      reviews
    };
    
    // Write to seed file
    const seedPath = path.join(__dirname, '..', 'data', 'places.seed.json');
    fs.writeFileSync(seedPath, JSON.stringify(seedData, null, 2));
    console.log(`\n📁 Saved to: ${seedPath}`);
    
    // Verify file
    const stats = fs.statSync(seedPath);
    console.log(`   File size: ${(stats.size / 1024).toFixed(1)} KB`);
    
  } finally {
    await prisma.$disconnect();
  }
}

exportToSeed();
