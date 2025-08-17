// scripts/create_sample_data.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Creating sample data...');
  
  const places = [
    {
      city: 'berlin',
      slug: 'tempelhofer-feld',
      name: 'Tempelhofer Feld',
      category: 'park_offleash_area',
      description: 'Former airport turned into a massive park perfect for dogs',
      address: 'Tempelhofer Damm, 12101 Berlin',
      district: 'Tempelhof-Schöneberg',
      lat: 52.4847,
      lng: 13.4025,
      website: 'https://www.tempelhoferfeld.de',
      status: 'approved'
    },
    {
      city: 'berlin',
      slug: 'cafe-einstein-stammhaus',
      name: 'Cafe Einstein Stammhaus',
      category: 'cafe_restaurant_bar',
      description: 'Dog-friendly traditional Viennese coffee house',
      address: 'Kurfürstenstraße 58, 10785 Berlin',
      district: 'Tiergarten',
      lat: 52.5047,
      lng: 13.3669,
      website: 'https://www.cafeeinstein.com',
      status: 'approved'
    },
    {
      city: 'berlin',
      slug: 'grunewald-forest',
      name: 'Grunewald Forest',
      category: 'trail_hike',
      description: 'Large forest area with numerous hiking trails perfect for dogs',
      address: 'Grunewald, 14193 Berlin',
      district: 'Charlottenburg-Wilmersdorf',
      lat: 52.4675,
      lng: 13.2582,
      status: 'approved'
    },
    {
      city: 'berlin',
      slug: 'wannsee-lake',
      name: 'Wannsee Lake',
      category: 'lake_swim',
      description: 'Beautiful lake with dog-friendly areas for swimming',
      address: 'Wannsee, 14109 Berlin',
      district: 'Steglitz-Zehlendorf',
      lat: 52.4167,
      lng: 13.1792,
      status: 'approved'
    },
    {
      city: 'berlin',
      slug: 'fressnapf-kurfurstendamm',
      name: 'Fressnapf Kurfürstendamm',
      category: 'pet_store_boutique',
      description: 'Large pet store with everything for your dog',
      address: 'Kurfürstendamm 123, 10719 Berlin',
      district: 'Charlottenburg-Wilmersdorf',
      lat: 52.5037,
      lng: 13.3250,
      status: 'approved'
    }
  ];

  for (const place of places) {
    try {
      await prisma.place.create({
        data: place,
      });
      console.log(`Created place: ${place.name}`);
    } catch (error) {
      console.log(`Place ${place.name} already exists, skipping...`);
    }
  }

  console.log(`✅ Sample data creation completed`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
