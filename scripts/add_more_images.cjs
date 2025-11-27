const { PrismaClient } = require('@prisma/client');

// Real images from official websites - verified working URLs
const moreOfficialImages = {
  // US - NYC from official websites
  '44 & X Hell\'s Kitchen': 'https://44andx.com/images/pano2560crop.jpg',
  
  // US - LA from official websites  
  'Alcove Cafe & Bakery': 'https://images.squarespace-cdn.com/content/v1/617982776722243ab35602c1/d86dda2d-2684-455d-8d2d-a5d007f00591/Add+a+little+bit+of+body+text.jpg?format=2500w',
  'Angel City Brewery': 'https://angelcitybrewery.com/wp-content/uploads/2022/01/logo-mark.svg', // SVG logo, might need alternative
  'Westfield Century City': 'https://res.cloudinary.com/westfielddg/image/upload/w_1920/f_auto/q_auto/v1758830379/Westfield%20Website%20-%20Global%20Repository/02%20-%20REGIONAL%20ASSETS/US%20-%20United%20States/Westfield%20Century%20City/Hero%20Banner/CAMP_Room6_2732.jpg',
  
  // Paris - from official sources
  'Le Comptoir Général': 'https://lecomptoirgeneral.com/wp-content/uploads/2021/09/FESTIVE-BAR.png',
};

async function addMoreImages() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🖼️  Adding more official images...\n');
    
    let updated = 0;
    
    for (const [name, imageUrl] of Object.entries(moreOfficialImages)) {
      const result = await prisma.place.updateMany({
        where: { name },
        data: { imageUrl }
      });
      
      if (result.count > 0) {
        console.log(`✅ ${name}: Added image`);
        updated++;
      } else {
        console.log(`⚠️  ${name}: Not found in database`);
      }
    }
    
    console.log(`\n📊 Updated ${updated} places`);
    
    // Final count
    const total = await prisma.place.count();
    const withImages = await prisma.place.count({ where: { imageUrl: { not: null } } });
    const withoutImages = await prisma.place.count({ where: { imageUrl: null } });
    
    console.log(`\n📊 Final Status:`);
    console.log(`   Total places: ${total}`);
    console.log(`   With images: ${withImages}`);
    console.log(`   Without images: ${withoutImages}`);
    
    // List remaining places without images by city
    if (withoutImages > 0) {
      const missing = await prisma.place.findMany({
        where: { imageUrl: null },
        select: { name: true, city: true, country: true, type: true },
        orderBy: [{ city: 'asc' }, { name: 'asc' }]
      });
      
      console.log(`\n📋 Places still missing images (${missing.length}):\n`);
      
      let currentCity = '';
      missing.forEach(p => {
        if (p.city !== currentCity) {
          currentCity = p.city;
          console.log(`\n  ${currentCity}, ${p.country}:`);
        }
        console.log(`    - ${p.name} (${p.type})`);
      });
    }
    
  } finally {
    await prisma.$disconnect();
  }
}

addMoreImages();
