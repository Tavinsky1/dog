#!/usr/bin/env npx tsx

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')
  
  // Create cities
  const cities = [
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
  
  for (const cityData of cities) {
    const city = await prisma.city.upsert({
      where: { slug: cityData.slug },
      update: cityData,
      create: cityData
    })
    console.log(`✓ City: ${city.name}`)
  }
  
  // Create sample places for Berlin
  const berlinCity = await prisma.city.findUnique({ where: { slug: 'berlin' } })
  if (berlinCity) {
    const places = [
      {
        slug: 'tiergarten-park',
        name: 'Tiergarten Park',
        type: 'park' as const,
        cityId: berlinCity.id,
        region: 'Mitte',
        country: 'Germany',
        lat: 52.5144,
        lng: 13.3501,
        shortDescription: 'Large central park perfect for dog walking',
        dogFriendlyLevel: 5,
        rating: 4.5
      },
      {
        slug: 'cafe-einstein',
        name: 'Café Einstein',
        type: 'cafe' as const,
        cityId: berlinCity.id,
        region: 'Mitte',
        country: 'Germany',
        lat: 52.5023,
        lng: 13.3617,
        shortDescription: 'Dog-friendly café with outdoor seating',
        dogFriendlyLevel: 4,
        rating: 4.2
      },
      {
        slug: 'grunewald-forest',
        name: 'Grunewald Forest',
        type: 'trail' as const,
        cityId: berlinCity.id,
        region: 'Charlottenburg-Wilmersdorf',
        country: 'Germany',
        lat: 52.4746,
        lng: 13.2594,
        shortDescription: 'Large forest with trails for hiking with dogs',
        dogFriendlyLevel: 5,
        rating: 4.7
      }
    ]
    
    for (const placeData of places) {
      const place = await prisma.place.upsert({
        where: { slug: placeData.slug },
        update: placeData,
        create: placeData
      })
      console.log(`✓ Place: ${place.name}`)
    }
  }
  
  // Add places for other cities
  const barcelonaCity = await prisma.city.findUnique({ where: { slug: 'barcelona' } })
  if (barcelonaCity) {
    const places = [
      {
        slug: 'park-guell',
        name: 'Park Güell',
        type: 'park' as const,
        cityId: barcelonaCity.id,
        region: 'Gràcia',
        country: 'Spain',
        lat: 41.4145,
        lng: 2.1527,
        shortDescription: 'Famous park with stunning city views',
        dogFriendlyLevel: 3,
        rating: 4.4
      },
      {
        slug: 'barceloneta-beach',
        name: 'Barceloneta Beach',
        type: 'beach' as const,
        cityId: barcelonaCity.id,
        region: 'Ciutat Vella',
        country: 'Spain',
        lat: 41.3755,
        lng: 2.1838,
        shortDescription: 'Popular beach with dog-friendly areas',
        dogFriendlyLevel: 4,
        rating: 4.1
      }
    ]
    
    for (const placeData of places) {
      const place = await prisma.place.upsert({
        where: { slug: placeData.slug },
        update: placeData,
        create: placeData
      })
      console.log(`✓ Place: ${place.name}`)
    }
  }
  
  const cityCount = await prisma.city.count()
  const placeCount = await prisma.place.count()
  
  console.log(`\n🎉 Seeding complete!`)
  console.log(`📍 Cities: ${cityCount}`)
  console.log(`🏞️ Places: ${placeCount}`)
  
  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})