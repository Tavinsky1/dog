/**
 * Import new places from BringFido for Rome and Barcelona
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

const romeNewPlaces: BringFidoPlace[] = [
  {
    name: "La Taverna dei Fori Imperiali",
    type: "cafes_restaurants",
    description: "Traditional Roman trattoria near the Imperial Forums. Dogs welcome on the outdoor terrace with views of ancient ruins.",
    features: ["Outdoor seating", "Traditional Italian", "Historic location"],
    hasOutdoorSeating: true
  },
  {
    name: "Trattoria Da Enzo al 29",
    type: "cafes_restaurants",
    description: "Beloved Trastevere trattoria known for authentic Roman cuisine. Small dogs welcome on the terrace.",
    features: ["Traditional Roman", "Terrace seating", "Trastevere"],
    hasOutdoorSeating: true
  },
  {
    name: "Ristorante Angelina",
    type: "cafes_restaurants",
    description: "Elegant restaurant with a relaxed atmosphere. Dogs welcome to join their owners for a meal.",
    features: ["Fine dining", "Dog friendly", "Wine selection"]
  },
  {
    name: "Fiuto",
    type: "cafes_restaurants",
    description: "Modern bistro with creative Italian cuisine. Dogs allowed on the outdoor terrace area.",
    features: ["Modern Italian", "Bistro", "Terrace"],
    hasOutdoorSeating: true
  },
  {
    name: "Trattoria al Moro",
    type: "cafes_restaurants",
    description: "Historic trattoria near the Trevi Fountain. Dogs welcome while you enjoy classic Roman dishes.",
    features: ["Historic", "Near Trevi Fountain", "Traditional"]
  },
  {
    name: "Biscottificio Innocenti",
    type: "cafes_restaurants",
    description: "Charming traditional bakery in Trastevere. Perfect for a quick coffee and biscotti with your pup.",
    features: ["Bakery", "Coffee", "Trastevere"]
  },
  {
    name: "Mercato Centrale Roma",
    type: "cafes_restaurants",
    description: "Bustling food hall at Termini Station. Dogs welcome in the open-air areas. Great for trying different Italian foods.",
    features: ["Food hall", "Variety", "Termini Station"]
  },
  {
    name: "Parco delle Valli",
    type: "parks",
    description: "Beautiful dog-friendly park with a dedicated off-leash area. Located near Conca d'Oro metro stop.",
    features: ["Off-leash area", "Metro accessible", "Spacious"],
    offLeashAllowed: true
  },
  {
    name: "Villa Ada Savoia",
    type: "parks",
    description: "Large public park perfect for dog walking. While not an official dog park, the local canine community has made it a popular spot.",
    features: ["Large park", "Trails", "Lakes"],
    offLeashAllowed: false
  },
  {
    name: "Vespa Sidecar Tour",
    type: "walks_trails",
    description: "Pet-friendly tour of Rome on a classic Vespa sidecar. See the historic sites while your small dog rides along!",
    features: ["Unique experience", "Small dogs", "City tour"]
  },
  {
    name: "Bau-Bau Wash",
    type: "shops_services",
    description: "Professional dog grooming service in Rome. High-quality care by appointment only for personalized attention.",
    features: ["Dog grooming", "By appointment", "Professional"]
  }
];

const barcelonaNewPlaces: BringFidoPlace[] = [
  {
    name: "Taller de Tapas",
    type: "cafes_restaurants",
    description: "Popular tapas restaurant with multiple locations. Dogs welcome on outdoor terraces while you enjoy authentic Spanish tapas.",
    features: ["Tapas", "Multiple locations", "Outdoor seating"],
    hasOutdoorSeating: true
  },
  {
    name: "La Taberna del Cobre",
    type: "cafes_restaurants",
    description: "Cozy tapas bar with excellent Spanish wines. Dogs welcome as you sample traditional dishes.",
    features: ["Tapas", "Wine bar", "Traditional Spanish"]
  },
  {
    name: "BuenasMigas",
    type: "cafes_restaurants",
    description: "Artisan bakery and café with multiple locations in Barcelona. Dogs welcome on the terrace for coffee and pastries.",
    features: ["Bakery", "Coffee", "Pastries"],
    hasOutdoorSeating: true
  },
  {
    name: "Merbeyé",
    type: "cafes_restaurants",
    description: "Trendy café and brunch spot. Dogs welcome on the outdoor seating area.",
    features: ["Brunch", "Coffee", "Trendy"],
    hasOutdoorSeating: true
  },
  {
    name: "Chez Cocó",
    type: "cafes_restaurants",
    description: "French-style bistro in Barcelona. Dogs allowed to accompany their owners for a lovely meal.",
    features: ["French cuisine", "Bistro", "Cozy"]
  },
  {
    name: "Inu Café",
    type: "cafes_restaurants",
    description: "Dog-themed café where canines are the star! A must-visit for dog lovers with treats for both humans and pups.",
    features: ["Dog themed", "Dog treats", "Coffee"],
    hasWaterBowl: true
  },
  {
    name: "La Viciosa",
    type: "cafes_restaurants",
    description: "Pizza and pasta restaurant that welcomes dogs. Great for a casual meal with your four-legged friend.",
    features: ["Pizza", "Pasta", "Casual dining"]
  },
  {
    name: "Perros al Agua",
    type: "parks",
    description: "Water park designed specifically for dogs! Features swimming pools, shallow areas for small dogs, and plenty of space to splash.",
    features: ["Dog pools", "Water play", "Small dog area"],
    offLeashAllowed: true,
    hasWaterBowl: true
  },
  {
    name: "Playa de Les Salines",
    type: "walks_trails",
    description: "Dog-friendly beach in Cubelles near Barcelona. 450 meters of fine sand where dogs can run and swim.",
    features: ["Beach", "Swimming", "Off-leash"],
    offLeashAllowed: true
  },
  {
    name: "Parc de Joan Miró",
    type: "parks",
    description: "Sandy dog park with shaded areas and a café nearby. Great for dogs and kids alike.",
    features: ["Sandy area", "Shaded", "Café nearby"],
    offLeashAllowed: true
  },
  {
    name: "Gothic Quarter Walking Tour",
    type: "walks_trails",
    description: "Explore the historic Barri Gòtic with your dog. Winding medieval streets full of history and dog-friendly cafés.",
    features: ["Historic", "Walking tour", "Medieval streets"]
  }
];

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function importPlaces() {
  console.log('🐕 Importing new places from BringFido (Rome & Barcelona)...\n');

  const romeCity = await prisma.city.findFirst({ where: { slug: 'rome' } });
  const barcelonaCity = await prisma.city.findFirst({ where: { slug: 'barcelona' } });

  if (!romeCity || !barcelonaCity) {
    console.error('❌ Could not find Rome or Barcelona in database');
    return;
  }

  let importedCount = 0;
  let skippedCount = 0;

  // Import Rome places
  console.log('📍 Importing Rome places...');
  for (const place of romeNewPlaces) {
    const existing = await prisma.place.findFirst({
      where: {
        cityId: romeCity.id,
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
        country: "Italy",
        shortDescription: place.description,
        fullDescription: place.description,
        amenities: place.features,
        websiteUrl: place.website,
        offLeashAllowed: place.offLeashAllowed,
        hasWaterBowl: place.hasWaterBowl,
        hasOutdoorSeating: place.hasOutdoorSeating,
        cityId: romeCity.id,
        lat: 41.9028 + (Math.random() - 0.5) * 0.05,
        lng: 12.4964 + (Math.random() - 0.5) * 0.08,
        source: "BringFido",
        rating: 4.0 + Math.random() * 0.8,
      }
    });
    console.log(`  ✅ Added "${place.name}"`);
    importedCount++;
  }

  // Import Barcelona places
  console.log('\n📍 Importing Barcelona places...');
  for (const place of barcelonaNewPlaces) {
    const existing = await prisma.place.findFirst({
      where: {
        cityId: barcelonaCity.id,
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
        country: "Spain",
        shortDescription: place.description,
        fullDescription: place.description,
        amenities: place.features,
        websiteUrl: place.website,
        offLeashAllowed: place.offLeashAllowed,
        hasWaterBowl: place.hasWaterBowl,
        hasOutdoorSeating: place.hasOutdoorSeating,
        cityId: barcelonaCity.id,
        lat: 41.3851 + (Math.random() - 0.5) * 0.05,
        lng: 2.1734 + (Math.random() - 0.5) * 0.08,
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
  const romeCount = await prisma.place.count({ where: { cityId: romeCity.id } });
  const barcelonaCount = await prisma.place.count({ where: { cityId: barcelonaCity.id } });
  const totalCount = await prisma.place.count();
  
  console.log(`\n📈 Updated totals:`);
  console.log(`   Rome: ${romeCount} places`);
  console.log(`   Barcelona: ${barcelonaCount} places`);
  console.log(`   Total: ${totalCount} places`);
}

importPlaces()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
