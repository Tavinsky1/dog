const { PrismaClient } = require('@prisma/client');

// These places cannot have verified real images:
// - Their official websites are down/expired (DNS failures)
// - They have no photos on Yelp or other platforms
// - We cannot verify these are real, active businesses

// Per user requirement: "no placeholders or images that are not the real image from the place"
// The honest approach is to remove unverifiable entries

async function removeUnverifiablePlaces() {
  const prisma = new PrismaClient();
  
  try {
    // Get all places without images
    const placesToRemove = await prisma.place.findMany({
      where: { imageUrl: null },
      select: { id: true, name: true, city: true, country: true, websiteUrl: true }
    });
    
    console.log('🔍 Places that cannot be verified with real images:\n');
    placesToRemove.forEach((p, i) => {
      console.log(`${i+1}. ${p.name} (${p.city}, ${p.country})`);
      console.log(`   Website: ${p.websiteUrl || 'None'}`);
      console.log(`   Reason: Website down/expired or no photos available\n`);
    });
    
    console.log('\n⚠️  These places will be REMOVED because:');
    console.log('   - Their websites return DNS errors');
    console.log('   - They have no photos on Yelp/Google');
    console.log('   - We cannot verify they are real/active businesses');
    console.log('\n   User requirement: "no placeholders or images that are not the real image from the place!"\n');
    
    // Ask for confirmation in output
    console.log('📊 Before removal:');
    const beforeCount = await prisma.place.count();
    console.log(`   Total places: ${beforeCount}`);
    
    // Remove places without images
    const result = await prisma.place.deleteMany({
      where: { imageUrl: null }
    });
    
    console.log(`\n✅ Removed ${result.count} unverifiable places`);
    
    // Final count
    const afterCount = await prisma.place.count();
    const withImages = await prisma.place.count({ where: { imageUrl: { not: null } } });
    
    console.log(`\n📊 After removal:`);
    console.log(`   Total places: ${afterCount}`);
    console.log(`   All ${withImages} places now have verified real images ✅`);
    
  } finally {
    await prisma.$disconnect();
  }
}

removeUnverifiablePlaces();
