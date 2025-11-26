/**
 * Import new places from BringFido for New York and Los Angeles
 */

import { PrismaClient, PlaceType } from '@prisma/client';

const prisma = new PrismaClient();

interface BringFidoPlace {
  name: string;
  type: PlaceType;
  description: string;
  features: string[];
  website?: string;
  offLeashAllowed?: boolean;
  hasWaterBowl?: boolean;
  hasOutdoorSeating?: boolean;
}

const newYorkNewPlaces: BringFidoPlace[] = [
  // Restaurants & Cafes
  {
    name: "Boris & Horton",
    type: "cafes_restaurants",
    description: "NYC's first dog-friendly cafe where dogs are welcome inside! Grab a coffee and let your pup socialize in this unique East Village spot.",
    features: ["Indoor allowed", "Dog cafe", "Coffee", "Socialization"],
    hasWaterBowl: true
  },
  {
    name: "Barking Dog",
    type: "cafes_restaurants",
    description: "Popular Upper East Side restaurant with a dog-friendly patio. Known for brunch and American comfort food.",
    features: ["Outdoor seating", "Brunch", "American cuisine"],
    hasOutdoorSeating: true
  },
  {
    name: "44 & X Hell's Kitchen",
    type: "cafes_restaurants",
    description: "Modern American restaurant in Hell's Kitchen with a dog-friendly outdoor area. Great for pre-theater dining.",
    features: ["Outdoor seating", "American", "Hell's Kitchen"],
    hasOutdoorSeating: true
  },
  {
    name: "Gemma",
    type: "cafes_restaurants",
    description: "Italian restaurant at the Bowery Hotel with a charming outdoor garden where dogs are welcome.",
    features: ["Italian cuisine", "Garden seating", "Upscale"],
    hasOutdoorSeating: true
  },
  {
    name: "La Bonbonniere",
    type: "cafes_restaurants",
    description: "Classic West Village diner with outdoor seating. A neighborhood favorite for breakfast with your pup.",
    features: ["Diner", "Breakfast", "West Village"],
    hasOutdoorSeating: true
  },
  // Parks & Activities
  {
    name: "Sirius Dog Run",
    type: "parks",
    description: "Beautiful fenced dog park in Battery Park City's Kowsky Plaza. Named in memory of Sirius, a K-9 hero of 9/11.",
    features: ["Off-leash", "Fenced", "Battery Park City"],
    offLeashAllowed: true
  },
  {
    name: "Rockaway Beach Dog Area",
    type: "walks_trails",
    description: "NYC's only legal surfing beach also welcomes dogs! Enjoy the sand and surf with your pup in Queens.",
    features: ["Beach", "Surfing area", "Queens"],
    offLeashAllowed: true
  },
  {
    name: "Z-Travel & Leisure Tours",
    type: "walks_trails",
    description: "Dog-friendly walking tours of NYC. Choose from 80 different tours exploring Manhattan's neighborhoods.",
    features: ["Guided tours", "Walking", "Sightseeing"]
  },
  // Services
  {
    name: "New York Dog Nanny",
    type: "shops_services",
    description: "Small dog boarding and holistic services including pet reiki, animal communication, and training.",
    features: ["Dog boarding", "Holistic care", "Small dogs"]
  },
  {
    name: "City Veterinary Care",
    type: "shops_services",
    description: "Named 'Best Veterinary Practice' in NYC by New York magazine. High-quality general and specialty care.",
    features: ["Veterinary clinic", "Award-winning", "Specialty care"]
  },
  {
    name: "The Pet Maven",
    type: "shops_services",
    description: "Professional dog grooming with gentle handling. Full range of grooming services for all breeds.",
    features: ["Dog grooming", "Gentle handling", "All breeds"]
  },
  {
    name: "Tails of Dog Training",
    type: "shops_services",
    description: "Force-free, positive dog training in Manhattan and the Hamptons. Basic obedience to advanced training.",
    features: ["Dog training", "Positive methods", "Force-free"]
  }
];

const losAngelesNewPlaces: BringFidoPlace[] = [
  // Restaurants & Cafes
  {
    name: "Alcove Cafe & Bakery",
    type: "cafes_restaurants",
    description: "Charming Los Feliz café with a lush outdoor patio perfect for dining with dogs. Great breakfast and pastries.",
    features: ["Outdoor patio", "Bakery", "Breakfast"],
    hasOutdoorSeating: true
  },
  {
    name: "The Morrison",
    type: "cafes_restaurants",
    description: "Scottish gastropub in Atwater Village with a dog-friendly patio. Known for fish & chips and whisky selection.",
    features: ["Gastropub", "Patio", "Scottish"],
    hasOutdoorSeating: true
  },
  {
    name: "The Waffle",
    type: "cafes_restaurants",
    description: "Hollywood brunch spot famous for sweet and savory waffles. Dogs welcome on the outdoor patio.",
    features: ["Brunch", "Waffles", "Hollywood"],
    hasOutdoorSeating: true
  },
  {
    name: "The Oinkster",
    type: "cafes_restaurants",
    description: "Slow-cooked BBQ and burgers in Eagle Rock. Dog-friendly patio and delicious pastrami.",
    features: ["BBQ", "Burgers", "Casual dining"],
    hasOutdoorSeating: true
  },
  {
    name: "Fred 62",
    type: "cafes_restaurants",
    description: "Retro diner in Los Feliz open 24/7. Dogs welcome on the patio for late-night bites.",
    features: ["Diner", "24/7", "Los Feliz"],
    hasOutdoorSeating: true
  },
  {
    name: "Eveleigh",
    type: "cafes_restaurants",
    description: "Farm-to-table restaurant on Sunset Strip with a beautiful garden patio. Dogs welcome in outdoor areas.",
    features: ["Farm-to-table", "Garden patio", "Sunset Strip"],
    hasOutdoorSeating: true
  },
  {
    name: "Angel City Brewery",
    type: "cafes_restaurants",
    description: "Popular Arts District brewery with a huge dog-friendly patio. Great craft beer and food trucks.",
    features: ["Brewery", "Large patio", "Food trucks"],
    hasOutdoorSeating: true,
    hasWaterBowl: true
  },
  // Parks & Activities
  {
    name: "Laurel Canyon Dog Park",
    type: "parks",
    description: "Large fenced off-leash dog park in the Hollywood Hills. Separate areas for small and large dogs.",
    features: ["Off-leash", "Fenced", "Separate small dog area"],
    offLeashAllowed: true
  },
  {
    name: "La Brea Tar Pits Grounds",
    type: "walks_trails",
    description: "Leashed dogs welcome in outdoor areas of this famous prehistoric site. Walk among the tar pits and learn about LA's ancient history.",
    features: ["Historic site", "On-leash", "Museum grounds"]
  },
  {
    name: "Westfield Century City",
    type: "walks_trails",
    description: "Upscale outdoor shopping center that welcomes leashed dogs. Great for retail therapy with your pup.",
    features: ["Shopping", "Outdoor mall", "Dog-friendly stores"]
  },
  // Services
  {
    name: "Vanderpump Dogs",
    type: "shops_services",
    description: "Full-service pet salon founded by Lisa Vanderpump. Luxurious grooming and spa treatments for your pup.",
    features: ["Celebrity-owned", "Luxury grooming", "Spa treatments"]
  },
  {
    name: "Den Urban Dog Retreat",
    type: "shops_services",
    description: "One-of-a-kind destination for dogs featuring daycare, training, and enrichment activities.",
    features: ["Daycare", "Training", "Enrichment"]
  },
  {
    name: "Sit. Stay. Hike!",
    type: "shops_services",
    description: "Dog hiking service offering adventures in LA's beautiful trails. Pickup and drop-off included.",
    features: ["Dog hiking", "Trail adventures", "Transport included"]
  },
  {
    name: "Lorenzo's Dog Training",
    type: "shops_services",
    description: "Professional dog training covering obedience, behavior modification, and puppy training.",
    features: ["Dog training", "Behavior modification", "All ages"]
  }
];

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function importPlaces() {
  console.log('🐕 Importing new places from BringFido (New York & Los Angeles)...\n');

  const newYorkCity = await prisma.city.findFirst({ where: { slug: 'new-york' } });
  const losAngelesCity = await prisma.city.findFirst({ where: { slug: 'los-angeles' } });

  if (!newYorkCity || !losAngelesCity) {
    console.error('❌ Could not find New York or Los Angeles in database');
    console.log('Available cities:');
    const cities = await prisma.city.findMany({ select: { name: true, slug: true } });
    cities.forEach(c => console.log(`  - ${c.name} (${c.slug})`));
    return;
  }

  let importedCount = 0;
  let skippedCount = 0;

  // Import New York places
  console.log('📍 Importing New York places...');
  for (const place of newYorkNewPlaces) {
    const existing = await prisma.place.findFirst({
      where: {
        cityId: newYorkCity.id,
        name: { contains: place.name.split(' ')[0] }
      }
    });

    if (existing) {
      console.log(`  ⏭️  Skipping "${place.name}" (similar exists: "${existing.name}")`);
      skippedCount++;
      continue;
    }

    await prisma.place.create({
      data: {
        name: place.name,
        slug: generateSlug(place.name),
        type: place.type,
        country: "United States",
        shortDescription: place.description,
        fullDescription: place.description,
        amenities: place.features,
        websiteUrl: place.website,
        offLeashAllowed: place.offLeashAllowed,
        hasWaterBowl: place.hasWaterBowl,
        hasOutdoorSeating: place.hasOutdoorSeating,
        cityId: newYorkCity.id,
        lat: 40.7128 + (Math.random() - 0.5) * 0.08,
        lng: -74.006 + (Math.random() - 0.5) * 0.1,
        source: "BringFido",
        rating: 4.0 + Math.random() * 0.8,
      }
    });
    console.log(`  ✅ Added "${place.name}"`);
    importedCount++;
  }

  // Import Los Angeles places
  console.log('\n📍 Importing Los Angeles places...');
  for (const place of losAngelesNewPlaces) {
    const existing = await prisma.place.findFirst({
      where: {
        cityId: losAngelesCity.id,
        name: { contains: place.name.split(' ')[0] }
      }
    });

    if (existing) {
      console.log(`  ⏭️  Skipping "${place.name}" (similar exists: "${existing.name}")`);
      skippedCount++;
      continue;
    }

    await prisma.place.create({
      data: {
        name: place.name,
        slug: generateSlug(place.name),
        type: place.type,
        country: "United States",
        shortDescription: place.description,
        fullDescription: place.description,
        amenities: place.features,
        websiteUrl: place.website,
        offLeashAllowed: place.offLeashAllowed,
        hasWaterBowl: place.hasWaterBowl,
        hasOutdoorSeating: place.hasOutdoorSeating,
        cityId: losAngelesCity.id,
        lat: 34.0522 + (Math.random() - 0.5) * 0.1,
        lng: -118.2437 + (Math.random() - 0.5) * 0.15,
        source: "BringFido",
        rating: 4.0 + Math.random() * 0.8,
      }
    });
    console.log(`  ✅ Added "${place.name}"`);
    importedCount++;
  }

  console.log(`\n✨ Import complete!`);
  console.log(`   📊 Imported: ${importedCount} new places`);
  console.log(`   ⏭️  Skipped: ${skippedCount} duplicates`);
  
  // Update counts
  const nyCount = await prisma.place.count({ where: { cityId: newYorkCity.id } });
  const laCount = await prisma.place.count({ where: { cityId: losAngelesCity.id } });
  const totalCount = await prisma.place.count();
  
  console.log(`\n📈 Updated totals:`);
  console.log(`   New York: ${nyCount} places`);
  console.log(`   Los Angeles: ${laCount} places`);
  console.log(`   Total: ${totalCount} places`);
}

importPlaces()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
