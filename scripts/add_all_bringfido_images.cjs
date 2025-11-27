const { PrismaClient } = require('@prisma/client');

// All verified BringFido images for remaining places
const allBringFidoImages = {
  // Barcelona
  'Chez Cocó': 'https://photos.bringfido.com/restaurants/8/2/7/74728/74728_277932.jpg?size=slide600&density=2x',
  'BuenasMigas': 'https://photos.bringfido.com/restaurants/15037/20160616_10638_15037.jpg?size=slide600&density=2x',
  'Merbeyé': 'https://photos.bringfido.com/restaurants/12853/20160616_8731_12853.jpg?size=slide600&density=2x',
  'Inu Café': 'https://photos.bringfido.com/restaurants/6/4/5/84546/84546_314797.jpg?size=slide600&density=2x',
  'Perros al Agua': 'https://photos.bringfido.com/attractions/3/8/8/15883/15883_36669.jpg?size=slide600&density=2x',
  'Gothic Quarter Walking Tour': 'https://photos.bringfido.com/photo/2009/07/03/gothicquarter.jpg?size=slide600&density=2x',
  
  // Paris
  'Cafe de L\'Industrie': 'https://photos.bringfido.com/restaurants/450/20160616_10563_450.jpg?size=slide600&density=2x',
  'Perruche': 'https://photos.bringfido.com/posted/2023/05/15/image.jpg?size=slide600&density=2x',
  
  // Rome
  'Trattoria Da Enzo al 29': 'https://photos.bringfido.com/posted/2024/04/24/41705707_1961152487240275_5336368102160465920_n.jpeg?size=slide600&density=2x',
  'Ristorante Angelina': 'https://photos.bringfido.com/restaurants/8/2/4/117428/117428_18734423.jpg?size=slide600&density=2x',
  'Fiuto': 'https://photos.bringfido.com/posted/2024/03/08/424769443_122145493076072116_1400876707466104095_n.jpeg?size=slide600&density=2x',
  'Biscottificio Innocenti': 'https://photos.bringfido.com/posted/2024/03/08/386501921_800246762105136_5340753143508719644_n.jpeg?size=slide600&density=2x',
  'Vespa Sidecar Tour': 'https://photos.bringfido.com/posted/2024/03/07/148442539_1809919935846426_5186298022827894423_n.jpeg?size=slide600&density=2x',
  
  // Berlin
  'Wahrhaft Nahrhaft': 'https://photos.bringfido.com/restaurants/2/9/8/74892/74892_283480.jpg?size=slide600&density=2x',
  'Minty\'s Fresh Food Bar': 'https://photos.bringfido.com/restaurants/7/9/7/125797/125797_99145278.jpg?size=slide600&density=2x',
  'Ni\'s Restaurant': 'https://photos.bringfido.com/posted/2024/11/21/458557892_526003399952561_1614617182611515524_n.jpg?size=slide600&density=2x',
  
  // NYC Attractions
  'Sirius Dog Run': 'https://photos.bringfido.com/photo/2010/08/28/SiriusDogRun2.jpg?size=slide600&density=2x',
  'Rockaway Beach Dog Area': 'https://photos.bringfido.com/attractions/0/7/8/27870/27870_68489.jpg?size=slide600&density=2x',
  'Z-Travel & Leisure Tours': 'https://photos.bringfido.com/photo/2014/12/29/tours_highlights.jpg?size=slide600&density=2x',
};

async function addAllBringFidoImages() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🖼️  Adding all BringFido images...\n');
    
    let updated = 0;
    
    for (const [name, imageUrl] of Object.entries(allBringFidoImages)) {
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
        select: { name: true, country: true, source: true }
      });
      console.log(`\n📋 Still need images:`);
      missing.forEach(p => console.log(`   - ${p.name} (${p.country}) [${p.source}]`));
    }
    
  } finally {
    await prisma.$disconnect();
  }
}

addAllBringFidoImages();
