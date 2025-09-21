const { PrismaClient } = require('@prisma/client');

async function importTestPlaces() {
  const prisma = new PrismaClient();
  
  const testPlaces = [
    {
      name: "Zur Letzten Instanz",
      slug: "zur-letzten-instanz",
      city: "Berlin",
      description: "Historic restaurant with dog-friendly outdoor seating",
      category: "cafe_restaurant_bar"
    },
    {
      name: "Tiergarten",
      slug: "tiergarten",
      city: "Berlin", 
      description: "Large central park perfect for dog walks",
      category: "park_offleash_area"
    },
    {
      name: "Wannsee Beach",
      slug: "wannsee-beach",
      city: "Berlin",
      description: "Popular lake beach where dogs can swim",
      category: "lake_swim"
    },
    {
      name: "Grunewald Forest",
      slug: "grunewald-forest", 
      city: "Berlin",
      description: "Extensive forest trails for hiking with dogs",
      category: "trail_hike"
    },
    {
      name: "Café Einstein",
      slug: "cafe-einstein",
      city: "Berlin",
      description: "Charming café with outdoor terrace for dogs",
      category: "cafe_restaurant_bar"
    },
    {
      name: "Volkspark Friedrichshain",
      slug: "volkspark-friedrichshain",
      city: "Berlin",
      description: "Popular park with designated off-leash areas",
      category: "park_offleash_area"
    }
  ];

  try {
    for (const place of testPlaces) {
      await prisma.place.upsert({
        where: { slug: place.slug },
        update: place,
        create: place
      });
      console.log(`✅ Imported: ${place.name} (${place.category})`);
    }
    
    console.log(`\n🎉 Successfully imported ${testPlaces.length} test places!`);
    
    // Show category counts
    const counts = await prisma.place.groupBy({
      by: ['category'],
      where: { city: 'Berlin' },
      _count: { category: true }
    });
    
    console.log('\n📊 Places by category:');
    counts.forEach(count => {
      console.log(`- ${count.category}: ${count._count.category} places`);
    });
    
  } catch (error) {
    console.error('Error importing places:', error);
  } finally {
    await prisma.$disconnect();
  }
}

importTestPlaces();
