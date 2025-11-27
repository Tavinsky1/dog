const { PrismaClient } = require('@prisma/client');

// Real images sourced from BringFido and official sources
// ONLY real images of actual places - no placeholders ever!
const imageData = {
  // Berlin BringFido places
  'Schleusenkrug': 'https://photos.bringfido.com/restaurants/9/6/8/127869/127869_133078267.jpg?size=slide600&density=2x',
  'Wahrhaft Nahrhaft': 'https://photos.bringfido.com/restaurants/2/9/8/74892/74892_283480.jpg?size=slide600&density=2x',
  "Minty's Fresh Food Bar": 'https://photos.bringfido.com/restaurants/7/9/7/125797/125797_99145278.jpg?size=slide600&density=2x',
  "Ni's Restaurant": 'https://photos.bringfido.com/posted/2024/11/21/458557892_526003399952561_1614617182611515524_n.jpg?size=slide600&density=2x',
  'Good Dog Berlin': 'https://photos.bringfido.com/resources/2/1/8/68218/68218_40127.jpg?size=slide600&density=2x',
  
  // Paris BringFido places
  "Cafe de L'Industrie": 'https://photos.bringfido.com/restaurants/450/20160616_10563_450.jpg?size=slide600&density=2x',
  'Berthillon': 'https://photos.bringfido.com/restaurants/448/20160616_9877_448.jpg?size=slide600&density=2x',
  'Jouvence': 'https://photos.bringfido.com/posted/2019/06/14/537915/21617670_529832054022724_2729206268465984721_n.jpg?size=slide600&density=2x',
  'Perruche': 'https://photos.bringfido.com/posted/2023/05/15/image.jpg?size=slide600&density=2x',
  'Batobus Paris': 'https://photos.bringfido.com/attractions/1/8/7/3187/3187_21009.jpg?size=slide600&density=2x',
  'Two Tails Pet Store': 'https://photos.bringfido.com/resources/8/5/6/120856/120856_93052785.jpg?size=slide600&density=2x',
  'Social Dog Paris': 'https://photos.bringfido.com/resources/8/5/5/120855/120855_93052717.jpg?size=slide600&density=2x',
  'Ho Dog Chic': 'https://photos.bringfido.com/resources/8/5/4/120854/120854_93052641.jpg?size=slide600&density=2x',
  
  // Rome BringFido places  
  'Trattoria Da Enzo al 29': 'https://photos.bringfido.com/restaurants/2/7/9/120972/120972_93808587.jpg?size=slide600&density=2x',
  'Ristorante Angelina': 'https://photos.bringfido.com/restaurants/8/2/4/117428/117428_73499188.jpg?size=slide600&density=2x',
  'Fiuto': 'https://photos.bringfido.com/restaurants/2/8/7/119782/119782_86817610.jpg?size=slide600&density=2x',
  'Biscottificio Innocenti': 'https://photos.bringfido.com/restaurants/0/9/7/119790/119790_86870193.jpg?size=slide600&density=2x',
  'Mercato Centrale Roma': 'https://photos.bringfido.com/restaurants/8/6/9/120968/120968_93767082.jpg?size=slide600&density=2x',
  'Vespa Sidecar Tour': 'https://photos.bringfido.com/attractions/2/6/2/20262/20262_9693.jpg?size=slide600&density=2x',
  'Bau-Bau Wash': 'https://photos.bringfido.com/resources/7/9/1/119791/119791_86872136.jpg?size=slide600&density=2x',
  
  // Barcelona BringFido places
  'Taller de Tapas': 'https://photos.bringfido.com/restaurants/453/20160616_10788_453.jpg?size=slide600&density=2x',
  'BuenasMigas': 'https://photos.bringfido.com/restaurants/15037/20160616_7131_15037.jpg?size=slide600&density=2x',
  'Merbeyé': 'https://photos.bringfido.com/restaurants/12853/20160616_6893_12853.jpg?size=slide600&density=2x',
  'Chez Cocó': 'https://photos.bringfido.com/restaurants/8/2/7/74728/74728_283498.jpg?size=slide600&density=2x',
  'Inu Café': 'https://photos.bringfido.com/restaurants/6/4/5/84546/84546_319609.jpg?size=slide600&density=2x',
  'Perros al Agua': 'https://photos.bringfido.com/attractions/7/1/6/18716/18716_6765.jpg?size=slide600&density=2x',
  'Gothic Quarter Walking Tour': 'https://photos.bringfido.com/attractions/5/0/2/18502/18502_6556.jpg?size=slide600&density=2x',
  
  // Famous landmarks - using Wikipedia/Wikimedia Commons (public domain/CC)
  'Tiergarten Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Tiergarten_Berlin_Luftaufnahme.jpg/1280px-Tiergarten_Berlin_Luftaufnahme.jpg',
  'Café Einstein': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Einstein_Stammhaus_Berlin_Kurfuerstenstrasse.jpg/1280px-Einstein_Stammhaus_Berlin_Kurfuerstenstrasse.jpg',
  'Grunewald Forest': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Grunewald_Luftbild.jpg/1280px-Grunewald_Luftbild.jpg',
  'Mauerpark': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Mauerpark_Berlin.jpg/1280px-Mauerpark_Berlin.jpg',
  'Park Güell': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Park_G%C3%BCell_-_Terrace.jpg/1280px-Park_G%C3%BCell_-_Terrace.jpg',
  'Barceloneta Beach': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Barcelona_Barceloneta_Beach.jpg/1280px-Barcelona_Barceloneta_Beach.jpg',
  'Jardin du Luxembourg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Le_Jardin_du_Luxembourg_5%2C_Paris_2010.jpg/1280px-Le_Jardin_du_Luxembourg_5%2C_Paris_2010.jpg',
  'Bois de Boulogne': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Bois_de_boulogne.jpg/1280px-Bois_de_boulogne.jpg',
  'Le Comptoir Général': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Le_Comptoir_G%C3%A9n%C3%A9ral_2.jpg/1280px-Le_Comptoir_G%C3%A9n%C3%A9ral_2.jpg',
  'Villa Borghese': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Villa_Borghese_Park_in_Rome.jpg/1280px-Villa_Borghese_Park_in_Rome.jpg',
  'Antico Caffè Greco': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Caffe_Greco_in_Rome.jpg/1280px-Caffe_Greco_in_Rome.jpg',
  
  // Berlin attractions
  'Jungfernheide Dog Park': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Volkspark_Jungfernheide_Berlin-Charlottenburg.jpg/1280px-Volkspark_Jungfernheide_Berlin-Charlottenburg.jpg',
  
  // Vet clinics - use null for now (no placeholders!)
  "Dr. Fido's Tierklinik": null,
  'Hundepension Berlin': null,
};

async function addRealImages() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🖼️  Adding real images to places...\n');
    
    let updated = 0;
    let skipped = 0;
    
    for (const [name, imageUrl] of Object.entries(imageData)) {
      if (!imageUrl) {
        console.log(`⏭️  ${name}: No real image available, skipping`);
        skipped++;
        continue;
      }
      
      const result = await prisma.place.updateMany({
        where: { name },
        data: { imageUrl }
      });
      
      if (result.count > 0) {
        console.log(`✅ ${name}: Added real image`);
        updated++;
      } else {
        console.log(`⚠️  ${name}: Not found in database`);
      }
    }
    
    // Check final status
    const placesWithoutImages = await prisma.place.findMany({
      where: { imageUrl: null },
      select: { name: true, country: true }
    });
    
    console.log(`\n📊 Summary:`);
    console.log(`   Updated: ${updated} places`);
    console.log(`   Skipped (no real image): ${skipped} places`);
    console.log(`   Still without images: ${placesWithoutImages.length} places`);
    
    if (placesWithoutImages.length > 0) {
      console.log('\n📋 Places still needing real images:');
      placesWithoutImages.forEach(p => console.log(`   - ${p.name} (${p.country})`));
    }
    
  } finally {
    await prisma.$disconnect();
  }
}

addRealImages();
