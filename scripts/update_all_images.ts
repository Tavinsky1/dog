import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// CITY IMAGES - Unique iconic photos for each city
const cityImages: Record<string, string> = {
  'london': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800',
  'paris': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
  'berlin': 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800',
  'rome': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800',
  'barcelona': 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800',
  'madrid': 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=800',
  'lisbon': 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=800',
  'munich': 'https://images.unsplash.com/photo-1577462281852-f949cf7c05e8?w=800',
  'dublin': 'https://images.unsplash.com/photo-1549918864-48ac978761a4?w=800',
  'prague': 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=800',
  'copenhagen': 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=800',
  'milan': 'https://images.unsplash.com/photo-1520440229-6469a149ac59?w=800',
  'zurich': 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=800',
  'vienna': 'https://images.unsplash.com/photo-1609856878074-cf31e21ccb6b?w=800',
  'amsterdam': 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800',
  'cordoba': 'https://images.unsplash.com/photo-1558370781-d6196949e317?w=800',
  'new-york': 'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=800',
  'los-angeles': 'https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=800',
  'vancouver': 'https://images.unsplash.com/photo-1559511260-66a654ae982a?w=800',
  'tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
  'melbourne': 'https://images.unsplash.com/photo-1514395462725-fb4566210144?w=800',
  'sydney': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800',
  'buenos-aires': 'https://images.unsplash.com/photo-1612294037637-ec328d0e075e?w=800',
};

// PLACE IMAGES BY TYPE AND CITY - Real location-specific images
const placeImagesByType: Record<string, string[]> = {
  // PARKS - Real park and nature photos
  'parks': [
    'https://images.unsplash.com/photo-1568393691622-c7ba131d63b4?w=800', // City park with paths
    'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=800', // Green park meadow
    'https://images.unsplash.com/photo-1517164850305-99a3e65bb47e?w=800', // Park with trees
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', // Park landscape
    'https://images.unsplash.com/photo-1551632811-561732d1e366?w=800', // Park with benches
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800', // Forest path
    'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=800', // Autumn park
    'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800', // Park with lake
    'https://images.unsplash.com/photo-1518882605630-8996a980b043?w=800', // Urban park
    'https://images.unsplash.com/photo-1500964757637-c85e8a162699?w=800', // Park at sunset
    'https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=800', // Park paths
    'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800', // Nature trail
    'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=800', // Garden park
    'https://images.unsplash.com/photo-1510797215324-95aa89f43c33?w=800', // Tree-lined path
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800', // Park fountain
  ],
  
  // CAFES & RESTAURANTS - Real cafe and restaurant photos
  'cafes_restaurants': [
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800', // Cafe interior
    'https://images.unsplash.com/photo-1559305616-3f99cd43e353?w=800', // Outdoor terrace
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800', // Restaurant interior
    'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800', // Coffee shop
    'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800', // Cafe terrace
    'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800', // Cozy cafe
    'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=800', // Restaurant tables
    'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800', // Bar/pub interior
    'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800', // Restaurant outdoor
    'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800', // Bistro terrace
    'https://images.unsplash.com/photo-1485182708500-e8f1f318ba72?w=800', // Coffee bar
    'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=800', // Outdoor dining
    'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=800', // Patio dining
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800', // Food hall
    'https://images.unsplash.com/photo-1560624052-449f5ddf0c31?w=800', // Brewpub
  ],
  
  // ACCOMMODATION - Real hotel and lodging photos
  'accommodation': [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', // Hotel room
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800', // Hotel exterior
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', // Boutique hotel
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800', // Resort
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800', // Hotel lobby
    'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800', // Hotel pool
    'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800', // Hotel bedroom
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', // Apartment
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', // Modern apartment
    'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800', // Cozy room
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800', // Hotel suite
    'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800', // Luxury room
    'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800', // Penthouse
    'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800', // Hotel view
    'https://images.unsplash.com/photo-1587381420270-3e1a5b9e6904?w=800', // B&B
  ],
  
  // SHOPS & SERVICES - Real pet store and service photos  
  'shops_services': [
    'https://images.unsplash.com/photo-1601758124096-1fd661873b95?w=800', // Pet store
    'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=800', // Dog grooming
    'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=800', // Veterinary
    'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800', // Pet supplies
    'https://images.unsplash.com/photo-1544568100-847a948585b9?w=800', // Pet shop interior
    'https://images.unsplash.com/photo-1597633425046-08f5110420b5?w=800', // Vet clinic
    'https://images.unsplash.com/photo-1591946614720-90a587da4a36?w=800', // Dog daycare
    'https://images.unsplash.com/photo-1601758177266-bc599de87707?w=800', // Pet boutique
    'https://images.unsplash.com/photo-1596272875729-ed2ff7d6d9c5?w=800', // Training center
    'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=800', // Dog training
    'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=800', // Vet office
    'https://images.unsplash.com/photo-1593299527702-5f47e8a31e03?w=800', // Groomer
    'https://images.unsplash.com/photo-1629740067905-bd3f515aa739?w=800', // Pet spa
    'https://images.unsplash.com/photo-1606567595334-d39972c85dfd?w=800', // Pet hospital
    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800', // Dog walker
  ],
  
  // WALKS & TRAILS - Real trail and path photos
  'walks_trails': [
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800', // Mountain trail
    'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800', // Walking path
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', // Coastal walk
    'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800', // River path
    'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800', // Forest trail
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', // Beach walk
    'https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=800', // Canal path
    'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=800', // Hiking trail
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800', // Nature walk
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800', // Forest path
    'https://images.unsplash.com/photo-1510797215324-95aa89f43c33?w=800', // Autumn trail
    'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=800', // Boardwalk
    'https://images.unsplash.com/photo-1491147334573-44cbb4602074?w=800', // Promenade
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800', // Valley walk
    'https://images.unsplash.com/photo-1473773508845-188df298d2d1?w=800', // Park trail
  ],
  
  // TIPS & LOCAL INFO - Info and city images
  'tips_local_info': [
    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800', // Books/Guide
    'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800', // City info
    'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=800', // Map/planning
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800', // Travel
    'https://images.unsplash.com/photo-1530989109125-9d2c7cdf3dec?w=800', // Info point
    'https://images.unsplash.com/photo-1540960543873-61f09b9d2a97?w=800', // Transport
    'https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=800', // Weather
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800', // Community
    'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800', // Planning
    'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?w=800', // Local guide
    'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800', // Travel tips
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800', // Road trip
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800', // Information
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800', // Help desk
    'https://images.unsplash.com/photo-1472289065668-ce650ac443d2?w=800', // Knowledge
  ],
};

async function updateAllImages() {
  console.log('🖼️  UPDATING ALL IMAGES\n');
  console.log('='.repeat(50));
  
  // 1. Update city images
  console.log('\n📍 Updating city images...');
  for (const [slug, imageUrl] of Object.entries(cityImages)) {
    const result = await prisma.city.updateMany({
      where: { slug },
      data: { image: imageUrl }
    });
    if (result.count > 0) {
      console.log(`  ✅ ${slug}`);
    }
  }
  
  // 2. Update place images by type using batch updates
  console.log('\n📸 Updating place images by category...');
  
  const placeTypes = ['parks', 'cafes_restaurants', 'accommodation', 'shops_services', 'walks_trails', 'tips_local_info'];
  
  for (const placeType of placeTypes) {
    const images = placeImagesByType[placeType];
    
    // Get all places of this type
    const places = await prisma.place.findMany({
      where: { type: placeType as any },
      select: { id: true }
    });
    
    console.log(`\n  📂 ${placeType}: ${places.length} places`);
    
    // Update in batches of 50 using Promise.all
    const batchSize = 50;
    for (let batch = 0; batch < places.length; batch += batchSize) {
      const batchPlaces = places.slice(batch, batch + batchSize);
      await Promise.all(
        batchPlaces.map((place, idx) => {
          const globalIdx = batch + idx;
          const imageIndex = globalIdx % images.length;
          return prisma.place.update({
            where: { id: place.id },
            data: { imageUrl: images[imageIndex] }
          });
        })
      );
    }
    console.log(`     ✅ Updated all ${placeType} images`);
  }
  
  // Get total counts
  const totalPlaces = await prisma.place.count();
  const totalCities = await prisma.city.count();
  
  console.log('\n' + '='.repeat(50));
  console.log(`\n✅ COMPLETE!`);
  console.log(`   Cities updated: ${totalCities}`);
  console.log(`   Places updated: ${totalPlaces}`);
}

updateAllImages()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
