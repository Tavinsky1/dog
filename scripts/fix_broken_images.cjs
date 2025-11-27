const { PrismaClient } = require('@prisma/client');

// Real images from official websites - verified working URLs
const realImages = {
  // From official websites
  'Mercato Centrale Roma': 'https://www.mercatocentrale.it/wp-content/uploads/2018/07/MCR_Location-7.jpg',
  'Taller de Tapas': 'https://tallerdetapas.com/wp-content/uploads/Slider-Rambla-1.webp',
  'Fred 62': 'https://fred62.com/wp-content/uploads/2025/02/hp-img-4up1.jpg',
  'Vanderpump Dogs': 'https://images.squarespace-cdn.com/content/v1/5eab105a5d4a651e825785e1/1589914043555-1OOKZ558NCPFMR8F3YPT/IMG_7686.jpg',
  
  // Places without websites - set to null (no image is better than broken image)
  'Tiergarten Park': null,
  'Café Einstein': null,
  'Grunewald Forest': null,
  'Mauerpark': null,
  'Park Güell': null,
  'Barceloneta Beach': null,
  'Jardin du Luxembourg': null,
  'Bois de Boulogne': null,
  'Le Comptoir Général': null,
  'Villa Borghese': null,
  'Antico Caffè Greco': null,
  'Jungfernheide Dog Park': null,
  
  // BringFido places - remove broken images
  'Wahrhaft Nahrhaft': null,
  "Minty's Fresh Food Bar": null,
  "Ni's Restaurant": null,
  'Cafe de L\'Industrie': null,
  'Jouvence': null,
  'Perruche': null,
  'Two Tails Pet Store': null,
  'Social Dog Paris': null,
  'Ho Dog Chic': null,
  'Trattoria Da Enzo al 29': null,
  'Ristorante Angelina': null,
  'Fiuto': null,
  'Biscottificio Innocenti': null,
  'Vespa Sidecar Tour': null,
  'Bau-Bau Wash': null,
  'BuenasMigas': null,
  'Merbeyé': null,
  'Chez Cocó': null,
  'Inu Café': null,
  'Perros al Agua': null,
  'Gothic Quarter Walking Tour': null,
  'Barking Dog': null,
  '44 & X Hell\'s Kitchen': null,
  'Gemma': null,
  'La Bonbonniere': null,
  'Sirius Dog Run': null,
  'Rockaway Beach Dog Area': null,
  'Z-Travel & Leisure Tours': null,
  'New York Dog Nanny': null,
  'City Veterinary Care': null,
  'The Pet Maven': null,
  'Tails of Dog Training': null,
  'Alcove Cafe & Bakery': null,
  'Eveleigh': null,
  'Angel City Brewery': null,
  'Westfield Century City': null,
  'Den Urban Dog Retreat': null,
  'Sit. Stay. Hike!': null,
  "Lorenzo's Dog Training": null,
};

async function updateImages() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🖼️  Updating images with verified working URLs...\n');
    
    let updated = 0;
    let cleared = 0;
    
    for (const [name, imageUrl] of Object.entries(realImages)) {
      const result = await prisma.place.updateMany({
        where: { name },
        data: { imageUrl }
      });
      
      if (result.count > 0) {
        if (imageUrl) {
          console.log(`✅ ${name}: Set real image`);
          updated++;
        } else {
          console.log(`🧹 ${name}: Cleared broken image`);
          cleared++;
        }
      }
    }
    
    // Final count
    const total = await prisma.place.count();
    const withImages = await prisma.place.count({ where: { imageUrl: { not: null } } });
    const withoutImages = await prisma.place.count({ where: { imageUrl: null } });
    
    console.log(`\n📊 Final Status:`);
    console.log(`   Total places: ${total}`);
    console.log(`   With working images: ${withImages}`);
    console.log(`   Without images: ${withoutImages}`);
    console.log(`   Updated: ${updated}, Cleared: ${cleared}`);
    
  } finally {
    await prisma.$disconnect();
  }
}

updateImages();
