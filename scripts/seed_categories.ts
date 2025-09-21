#!/usr/bin/env npx tsx

import { PrismaClient } from '@prisma/client'
import { PLACE_CATEGORIES, getAllCategoriesOrdered } from '../src/lib/categories'

const prisma = new PrismaClient()

const CITIES = [
  {
    slug: 'berlin',
    name: 'Berlin',
    region: 'Berlin',
    country: 'Germany',
    lat: 52.5200,
    lng: 13.4050,
    active: true
  },
  {
    slug: 'barcelona',
    name: 'Barcelona',
    region: 'Catalonia',
    country: 'Spain',
    lat: 41.3851,
    lng: 2.1734,
    active: true
  },
  {
    slug: 'paris',
    name: 'Paris',
    region: 'Île-de-France',
    country: 'France',
    lat: 48.8566,
    lng: 2.3522,
    active: true
  },
  {
    slug: 'rome',
    name: 'Rome',
    region: 'Lazio',
    country: 'Italy',
    lat: 41.9028,
    lng: 12.4964,
    active: true
  }
]

// Sample places for each category to demonstrate the system
const SAMPLE_PLACES = [
  // Berlin - Recreation
  {
    slug: 'tiergarten-park',
    name: 'Tiergarten Park',
    type: 'park_onleash_area',
    citySlug: 'berlin',
    lat: 52.5144,
    lng: 13.3501,
    shortDescription: 'Large central park perfect for on-leash walks with beautiful gardens and paths',
    dogFriendlyLevel: 4,
    rating: 4.5
  },
  {
    slug: 'hundezone-prenzlauer-berg',
    name: 'Hundezone Prenzlauer Berg',
    type: 'park_offleash_area',
    citySlug: 'berlin',
    lat: 52.5482,
    lng: 13.4029,
    shortDescription: 'Fenced off-leash area where dogs can run free and socialize',
    dogFriendlyLevel: 5,
    rating: 4.7
  },
  {
    slug: 'grunewald-forest-trail',
    name: 'Grunewald Forest Trail',
    type: 'trail_hiking',
    citySlug: 'berlin',
    lat: 52.4746,
    lng: 13.2594,
    shortDescription: 'Forest hiking trail with natural paths and wildlife',
    dogFriendlyLevel: 5,
    rating: 4.6
  },
  {
    slug: 'wannsee-beach',
    name: 'Wannsee Dog Beach',
    type: 'beach_dog_friendly',
    citySlug: 'berlin',
    lat: 52.4223,
    lng: 13.1642,
    shortDescription: 'Designated dog beach area for swimming and playing',
    dogFriendlyLevel: 5,
    rating: 4.3
  },

  // Berlin - Food & Services
  {
    slug: 'cafe-einstein-berlin',
    name: 'Café Einstein',
    type: 'cafe_dog_friendly',
    citySlug: 'berlin',
    lat: 52.5023,
    lng: 13.3617,
    shortDescription: 'Classic Viennese-style café with outdoor seating welcoming dogs',
    dogFriendlyLevel: 4,
    rating: 4.2
  },
  {
    slug: 'tierarztpraxis-mitte',
    name: 'Tierarztpraxis Mitte',
    type: 'vet_clinic',
    citySlug: 'berlin',
    lat: 52.5200,
    lng: 13.4050,
    shortDescription: 'Modern veterinary clinic in the heart of Berlin',
    dogFriendlyLevel: 5,
    rating: 4.8
  },
  {
    slug: 'hundesalon-berlin',
    name: 'Hundesalon Berlin',
    type: 'grooming_salon',
    citySlug: 'berlin',
    lat: 52.5170,
    lng: 13.3888,
    shortDescription: 'Professional dog grooming with full spa services',
    dogFriendlyLevel: 5,
    rating: 4.5
  },

  // Barcelona - Recreation
  {
    slug: 'park-guell-barcelona',
    name: 'Park Güell',
    type: 'park_onleash_area',
    citySlug: 'barcelona',
    lat: 41.4145,
    lng: 2.1527,
    shortDescription: 'Famous Gaudí park with mosaic art and city views (dogs on leash)',
    dogFriendlyLevel: 3,
    rating: 4.4
  },
  {
    slug: 'barceloneta-dog-beach',
    name: 'Barceloneta Dog Beach',
    type: 'beach_dog_friendly',
    citySlug: 'barcelona',
    lat: 41.3755,
    lng: 2.1838,
    shortDescription: 'Designated dog area on Barcelona\'s famous beach',
    dogFriendlyLevel: 4,
    rating: 4.1
  },
  {
    slug: 'collserola-hiking-trail',
    name: 'Collserola Natural Park',
    type: 'trail_hiking',
    citySlug: 'barcelona',
    lat: 41.4203,
    lng: 2.1137,
    shortDescription: 'Mountain hiking trails with panoramic views of Barcelona',
    dogFriendlyLevel: 5,
    rating: 4.6
  },

  // Paris - Mix of categories
  {
    slug: 'bois-de-boulogne',
    name: 'Bois de Boulogne',
    type: 'park_onleash_area',
    citySlug: 'paris',
    lat: 48.8619,
    lng: 2.2509,
    shortDescription: 'Large park with lakes, gardens, and walking paths',
    dogFriendlyLevel: 4,
    rating: 4.3
  },
  {
    slug: 'cafe-des-chats-paris',
    name: 'Le Procope',
    type: 'cafe_dog_friendly',
    citySlug: 'paris',
    lat: 48.8534,
    lng: 2.3379,
    shortDescription: 'Historic café with outdoor terrace welcoming well-behaved dogs',
    dogFriendlyLevel: 3,
    rating: 4.0
  },

  // Rome - Mix of categories
  {
    slug: 'villa-borghese-rome',
    name: 'Villa Borghese',
    type: 'park_onleash_area',
    citySlug: 'rome',
    lat: 41.9142,
    lng: 12.4922,
    shortDescription: 'Historic park with gardens, museums, and walking paths',
    dogFriendlyLevel: 4,
    rating: 4.4
  },
  {
    slug: 'ostia-dog-beach',
    name: 'Ostia Dog Beach',
    type: 'beach_dog_friendly',
    citySlug: 'rome',
    lat: 41.7347,
    lng: 12.2889,
    shortDescription: 'Coastal beach area where dogs can swim and play',
    dogFriendlyLevel: 4,
    rating: 4.2
  }
]

async function main() {
  console.log('🌱 Seeding DogAtlas with comprehensive category system...')
  
  // Create cities
  console.log('\n📍 Creating cities...')
  const cityMap = new Map()
  
  for (const cityData of CITIES) {
    const city = await prisma.city.upsert({
      where: { slug: cityData.slug },
      update: cityData,
      create: cityData
    })
    cityMap.set(cityData.slug, city.id)
    console.log(`✓ ${city.name}`)
  }
  
  // Create places with proper categories
  console.log('\n🏞️ Creating places with categorized system...')
  for (const placeData of SAMPLE_PLACES) {
    const { citySlug, ...data } = placeData
    const cityId = cityMap.get(citySlug)
    
    if (!cityId) {
      console.log(`✗ Skipping ${placeData.name} - city ${citySlug} not found`)
      continue
    }

    const place = await prisma.place.upsert({
      where: { slug: placeData.slug },
      update: { ...data, cityId },
      create: { ...data, cityId, region: 'City Center', country: 'Country' }
    })
    
    const categoryInfo = PLACE_CATEGORIES[placeData.type as keyof typeof PLACE_CATEGORIES]
    console.log(`✓ ${place.name} (${categoryInfo.name})`)
  }
  
  // Show category distribution
  console.log('\n📊 Category distribution:')
  const categories = getAllCategoriesOrdered()
  for (const category of categories) {
    const count = await prisma.place.count({
      where: { type: category.id as any }
    })
    if (count > 0) {
      console.log(`   ${category.icon} ${category.name}: ${count}`)
    }
  }
  
  const cityCount = await prisma.city.count()
  const placeCount = await prisma.place.count()
  
  console.log(`\n🎉 Seeding complete!`)
  console.log(`📍 Cities: ${cityCount}`)
  console.log(`🏞️ Places: ${placeCount}`)
  console.log(`🏷️ Available categories: ${Object.keys(PLACE_CATEGORIES).length}`)
  
  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})