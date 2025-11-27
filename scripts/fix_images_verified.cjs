const { PrismaClient } = require('@prisma/client');

// Real images from OFFICIAL SOURCES - each place's own website or verified sources
// NO BringFido, NO Wikipedia, NO placeholders
const realImages = {
  // From official websites
  'Schleusenkrug': 'https://www.schleusenkrug.de/wp-content/uploads/2023/06/2_hclgpe.jpg',
  'Berthillon': 'https://berthillon.fr/wp-content/uploads/2023/02/Dessin-devanture-glacier-Berthillon-Paris.png',
  'Batobus Paris': 'https://www.batobus.com/sites/default/files/2025-10/320x390_4.jpg',
  'Good Dog Berlin': 'https://good-dog-berlin.de/wp-content/uploads/2024/03/header1.jpg',
  
  // These need their images set to null - no verified real source available
  // Better to have no image than a broken/fake one
};

// Places without verified real images - set to null
const noImageAvailable = [
  'Tiergarten Park',
  'Café Einstein', 
  'Grunewald Forest',
  'Mauerpark',
  'Park Güell',
  'Barceloneta Beach',
  'Jardin du Luxembourg',
  'Bois de Boulogne',
  'Le Comptoir Général',
  'Villa Borghese',
  'Antico Caffè Greco',
  'Jungfernheide Dog Park',
  'Wahrhaft Nahrhaft',
  "Minty's Fresh Food Bar",
  "Ni's Restaurant",
  "Cafe de L'Industrie",
  'Jouvence',
  'Perruche',
  'Two Tails Pet Store',
  'Social Dog Paris',
  'Ho Dog Chic',
  'Trattoria Da Enzo al 29',
  'Ristorante Angelina',
  'Fiuto',
  'Biscottificio Innocenti',
  'Mercato Centrale Roma',
  'Vespa Sidecar Tour',
  'Bau-Bau Wash',
  'Taller de Tapas',
  'BuenasMigas',
  'Merbeyé',
  'Chez Cocó',
  'Inu Café',
  'Perros al Agua',
  'Gothic Quarter Walking Tour',
  'Barking Dog',
  '44 & X Hell\'s Kitchen',
  'Gemma',
  'La Bonbonniere',
  'Sirius Dog Run',
  'Rockaway Beach Dog Area',
  'Z-Travel & Leisure Tours',
  'New York Dog Nanny',
  'City Veterinary Care',
  'The Pet Maven',
  'Tails of Dog Training',
  'Alcove Cafe & Bakery',
  'Fred 62',
  'Eveleigh',
  'Angel City Brewery',
  'Westfield Century City',
  'Vanderpump Dogs',
  'Den Urban Dog Retreat',
  'Sit. Stay. Hike!',
  "Lorenzo's Dog Training",
];

async function fixImages() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔧 Fixing images with verified real sources only...\n');
    
    // Update places with verified real images
    let updated = 0;
    for (const [name, imageUrl] of Object.entries(realImages)) {
      const result = await prisma.place.updateMany({
        where: { name },
        data: { imageUrl }
      });
      if (result.count > 0) {
        console.log(`✅ ${name}: Set real image from official website`);
        updated++;
      }
    }
    
    // Set null for places without verified images
    let cleared = 0;
    for (const name of noImageAvailable) {
      const result = await prisma.place.updateMany({
        where: { name },
        data: { imageUrl: null }
      });
      if (result.count > 0) {
        console.log(`⚪ ${name}: No verified image available`);
        cleared++;
      }
    }
    
    // Final status
    const total = await prisma.place.count();
    const withImages = await prisma.place.count({ where: { imageUrl: { not: null } } });
    const withoutImages = await prisma.place.count({ where: { imageUrl: null } });
    
    console.log(`\n📊 Final Status:`);
    console.log(`   Total places: ${total}`);
    console.log(`   With verified real images: ${withImages}`);
    console.log(`   Without images (no verified source): ${withoutImages}`);
    console.log(`\n✨ Updated: ${updated}, Cleared: ${cleared}`);
    
  } finally {
    await prisma.$disconnect();
  }
}

fixImages();
