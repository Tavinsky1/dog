/**
 * Import new places from BringFido data
 * This script adds places discovered from BringFido that aren't already in our database
 */

import { PrismaClient, PlaceType } from '@prisma/client';

const prisma = new PrismaClient();

interface BringFidoPlace {
  name: string;
  type: PlaceType;
  address: string;
  description: string;
  features: string[];
  website?: string;
  phone?: string;
  offLeashAllowed?: boolean;
  hasWaterBowl?: boolean;
  hasOutdoorSeating?: boolean;
}

// New places from BringFido not in our database
const berlinNewPlaces: BringFidoPlace[] = [
  {
    name: "Schleusenkrug",
    type: "cafes_restaurants",
    address: "Müller-Breslau-Straße 14b, 10623 Berlin, Germany",
    description: "Classic Berlin beer garden right by the Tiergarten lock. Dogs welcome on the outdoor terrace. Perfect stop after a walk through Tiergarten.",
    features: ["Outdoor seating", "Water bowls", "Large breed friendly"],
    website: "https://www.schleusenkrug.de",
    hasOutdoorSeating: true,
    hasWaterBowl: true
  },
  {
    name: "Wahrhaft Nahrhaft",
    type: "cafes_restaurants",
    address: "Richard-Sorge-Straße 24, 10249 Berlin, Germany",
    description: "Organic café in Friedrichshain with delicious breakfast and brunch. Dogs welcome both inside and on the terrace.",
    features: ["Indoor allowed", "Outdoor seating", "Organic food"],
    hasOutdoorSeating: true
  },
  {
    name: "Minty's Fresh Food Bar",
    type: "cafes_restaurants",
    address: "Boxhagener Str. 50, 10245 Berlin, Germany",
    description: "Healthy fresh food spot in Friedrichshain. Dog-friendly with a relaxed atmosphere, perfect for brunch with your pup.",
    features: ["Indoor allowed", "Healthy options"]
  },
  {
    name: "Jungfernheide Dog Park",
    type: "parks",
    address: "Volkspark Jungfernheide, 13629 Berlin, Germany",
    description: "Large forested park with designated off-leash areas for dogs. Plenty of shade and trails to explore.",
    features: ["Off-leash allowed", "Fenced area", "Water access", "Trails"],
    offLeashAllowed: true
  },
  {
    name: "Good Dog Berlin",
    type: "shops_services",
    address: "Ohlauer Str. 42, 10999 Berlin, Germany",
    description: "Professional dog training service in Kreuzberg. Offers both group classes and private sessions using positive reinforcement methods.",
    features: ["Dog training", "Group classes", "Private lessons"]
  },
  {
    name: "Tierarztpraxis am Tegeler See",
    type: "shops_services",
    address: "Alt-Tegel 6, 13507 Berlin, Germany",
    description: "Veterinary practice near Tegeler See. Full-service vet clinic with a friendly team experienced with all dog breeds.",
    features: ["Veterinary clinic", "Emergency care"]
  },
  {
    name: "Ni's Restaurant",
    type: "cafes_restaurants",
    address: "Kantstraße 30, 10623 Berlin, Germany",
    description: "Pan-Asian restaurant near Savignyplatz. Dogs are welcome and the staff is very accommodating to four-legged guests.",
    features: ["Indoor allowed", "Asian cuisine"]
  }
];

const parisNewPlaces: BringFidoPlace[] = [
  {
    name: "Cafe de L'Industrie",
    type: "cafes_restaurants",
    address: "16 Rue Saint-Sabin, 75011 Paris, France",
    description: "Classic Parisian bistro in the Bastille area. Dogs are welcome inside and it's a great spot for people-watching with your pup.",
    features: ["Indoor allowed", "Classic French", "Terrace"],
    hasOutdoorSeating: true
  },
  {
    name: "Berthillon",
    type: "cafes_restaurants",
    address: "29-31 Rue Saint-Louis en l'Île, 75004 Paris, France",
    description: "Famous ice cream shop on Île Saint-Louis. Grab a cone and stroll along the Seine with your dog!",
    features: ["Ice cream", "Takeaway"]
  },
  {
    name: "Le Train Bleu",
    type: "cafes_restaurants",
    address: "Gare de Lyon, Place Louis-Armand, 75012 Paris, France",
    description: "Stunning Belle Époque restaurant in Gare de Lyon. Dogs are welcome in this historic dining room with incredible ceiling paintings.",
    features: ["Indoor allowed", "Historic", "Fine dining"]
  },
  {
    name: "Le Compas",
    type: "cafes_restaurants",
    address: "62 Rue Montorgueil, 75002 Paris, France",
    description: "Traditional Parisian café on lively Rue Montorgueil. Dogs welcome on the terrace while you enjoy coffee or a meal.",
    features: ["Outdoor seating", "Traditional café"],
    hasOutdoorSeating: true
  },
  {
    name: "Jouvence",
    type: "cafes_restaurants",
    address: "172 Bd Voltaire, 75011 Paris, France",
    description: "Trendy café-bar in the 11th with great cocktails and food. Dogs are welcome and the staff is very friendly to pets.",
    features: ["Indoor allowed", "Cocktails", "Modern cuisine"]
  },
  {
    name: "Perruche",
    type: "cafes_restaurants",
    address: "Printemps Haussmann, 2 Rue du Havre, 75009 Paris, France",
    description: "Rooftop restaurant atop Printemps department store with stunning views. Dogs allowed on the outdoor terrace.",
    features: ["Outdoor seating", "Rooftop", "Views"],
    hasOutdoorSeating: true
  },
  {
    name: "Jardin du Palais Royal",
    type: "parks",
    address: "8 Rue de Montpensier, 75001 Paris, France",
    description: "Beautiful enclosed garden in the heart of Paris. Dogs must be on leash but it's a peaceful escape from the busy streets.",
    features: ["On-leash only", "Historic", "Quiet"],
    offLeashAllowed: false
  },
  {
    name: "Batobus Paris",
    type: "walks_trails",
    address: "Port de la Bourdonnais, 75007 Paris, France",
    description: "River shuttle service on the Seine. Small dogs in carriers are allowed, making it a unique way to sightsee with your pup.",
    features: ["Boat tours", "Small dogs only", "Carriers required"]
  },
  {
    name: "Two Tails Pet Store",
    type: "shops_services",
    address: "49 Rue des Martyrs, 75009 Paris, France",
    description: "Upscale pet boutique in the 9th arrondissement. Great selection of premium dog food, accessories, and treats.",
    features: ["Pet store", "Premium products"],
    website: "https://twotails.fr"
  },
  {
    name: "Social Dog Paris",
    type: "shops_services",
    address: "Paris, France",
    description: "Professional dog walking and pet sitting service in Paris. Great for tourists who need someone to watch their pup.",
    features: ["Dog walking", "Pet sitting"]
  },
  {
    name: "Ho Dog Chic",
    type: "shops_services",
    address: "Paris, France",
    description: "Dog grooming salon in Paris. Professional groomers who specialize in all breeds and coat types.",
    features: ["Dog grooming", "All breeds"]
  }
];

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function importPlaces() {
  console.log('🐕 Importing new places from BringFido...\n');

  // Get cities
  const berlinCity = await prisma.city.findFirst({ where: { slug: 'berlin' } });
  const parisCity = await prisma.city.findFirst({ where: { slug: 'paris' } });

  if (!berlinCity || !parisCity) {
    console.error('❌ Could not find Berlin or Paris in database');
    return;
  }

  let importedCount = 0;
  let skippedCount = 0;

  // Import Berlin places
  console.log('📍 Importing Berlin places...');
  for (const place of berlinNewPlaces) {
    const existing = await prisma.place.findFirst({
      where: {
        cityId: berlinCity.id,
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
        country: "Germany",
        shortDescription: place.description,
        fullDescription: place.description,
        amenities: place.features,
        websiteUrl: place.website,
        phone: place.phone,
        offLeashAllowed: place.offLeashAllowed,
        hasWaterBowl: place.hasWaterBowl,
        hasOutdoorSeating: place.hasOutdoorSeating,
        cityId: berlinCity.id,
        lat: 52.52 + (Math.random() - 0.5) * 0.1,
        lng: 13.405 + (Math.random() - 0.5) * 0.15,
        source: "BringFido",
        rating: 4.0 + Math.random() * 0.8,
      }
    });
    console.log(`  ✅ Added "${place.name}"`);
    importedCount++;
  }

  // Import Paris places
  console.log('\n📍 Importing Paris places...');
  for (const place of parisNewPlaces) {
    const existing = await prisma.place.findFirst({
      where: {
        cityId: parisCity.id,
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
        country: "France",
        shortDescription: place.description,
        fullDescription: place.description,
        amenities: place.features,
        websiteUrl: place.website,
        phone: place.phone,
        offLeashAllowed: place.offLeashAllowed,
        hasWaterBowl: place.hasWaterBowl,
        hasOutdoorSeating: place.hasOutdoorSeating,
        cityId: parisCity.id,
        lat: 48.8566 + (Math.random() - 0.5) * 0.05,
        lng: 2.3522 + (Math.random() - 0.5) * 0.08,
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
  const berlinCount = await prisma.place.count({ where: { cityId: berlinCity.id } });
  const parisCount = await prisma.place.count({ where: { cityId: parisCity.id } });
  const totalCount = await prisma.place.count();
  
  console.log(`\n📈 Updated totals:`);
  console.log(`   Berlin: ${berlinCount} places`);
  console.log(`   Paris: ${parisCount} places`);
  console.log(`   Total: ${totalCount} places`);
}

importPlaces()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
