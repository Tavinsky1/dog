import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// City images - UNIQUE verified accurate Unsplash photos for each city
const cityImages: Record<string, string> = {
  // European Cities - ALL UNIQUE PHOTOS
  'london': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800', // Big Ben at dusk
  'paris': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800', // Eiffel Tower
  'berlin': 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800', // Brandenburg Gate
  'rome': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800', // Colosseum
  'barcelona': 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800', // Sagrada Familia
  'madrid': 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=800', // Gran Via Madrid
  'lisbon': 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=800', // Lisbon tram
  'munich': 'https://images.unsplash.com/photo-1577462281852-f949cf7c05e8?w=800', // Marienplatz
  'dublin': 'https://images.unsplash.com/photo-1549918864-48ac978761a4?w=800', // Temple Bar
  'prague': 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=800', // Charles Bridge
  'copenhagen': 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=800', // Nyhavn harbor
  'milan': 'https://images.unsplash.com/photo-1520440229-6469a149ac59?w=800', // Duomo Milano
  'zurich': 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=800', // Zurich Lake
  'vienna': 'https://images.unsplash.com/photo-1609856878074-cf31e21ccb6b?w=800', // Schönbrunn
  'amsterdam': 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800', // Amsterdam canals
  'cordoba': 'https://images.unsplash.com/photo-1558370781-d6196949e317?w=800', // Mezquita arches
  
  // North American Cities - ALL UNIQUE PHOTOS
  'new-york': 'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=800', // Manhattan skyline
  'los-angeles': 'https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=800', // Hollywood sign/LA
  'vancouver': 'https://images.unsplash.com/photo-1559511260-66a654ae982a?w=800', // Vancouver harbor
  
  // Asia Pacific Cities - ALL UNIQUE PHOTOS
  'tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800', // Tokyo Tower
  'melbourne': 'https://images.unsplash.com/photo-1514395462725-fb4566210144?w=800', // Flinders Station
  'sydney': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800', // Opera House
  
  // South American Cities - ALL UNIQUE PHOTOS  
  'buenos-aires': 'https://images.unsplash.com/photo-1612294037637-ec328d0e075e?w=800', // Obelisco BA
};

async function updateCityImages() {
  console.log('🖼️  Updating city images...\n');
  
  for (const [slug, imageUrl] of Object.entries(cityImages)) {
    try {
      const result = await prisma.city.updateMany({
        where: { slug },
        data: { image: imageUrl }
      });
      
      if (result.count > 0) {
        console.log(`  ✅ Updated ${slug}`);
      } else {
        console.log(`  ⚠️  City not found: ${slug}`);
      }
    } catch (error) {
      console.error(`  ❌ Error updating ${slug}:`, error);
    }
  }
  
  console.log('\n✅ City images update complete!');
}

updateCityImages()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
