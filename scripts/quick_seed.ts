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
        type: 'parks' as const,
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
        type: 'cafes_restaurants' as const,
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
        type: 'walks_trails' as const,
        cityId: berlinCity.id,
        region: 'Charlottenburg-Wilmersdorf',
        country: 'Germany',
        lat: 52.4746,
        lng: 13.2594,
        shortDescription: 'Large forest with trails for hiking with dogs',
        dogFriendlyLevel: 5,
        rating: 4.7
      },
      {
        slug: 'volkspark-friedrichshain',
        name: 'Volkspark Friedrichshain',
        type: 'parks' as const,
        cityId: berlinCity.id,
        region: 'Friedrichshain',
        country: 'Germany',
        lat: 52.5280,
        lng: 13.4370,
        shortDescription: 'Beautiful park with off-leash dog area and fountain',
        dogFriendlyLevel: 5,
        rating: 4.6
      },
      {
        slug: 'mauerpark',
        name: 'Mauerpark',
        type: 'parks' as const,
        cityId: berlinCity.id,
        region: 'Prenzlauer Berg',
        country: 'Germany',
        lat: 52.5438,
        lng: 13.4023,
        shortDescription: 'Famous park with flea market and dog-friendly areas',
        dogFriendlyLevel: 4,
        rating: 4.4
      },
      {
        slug: 'dr-fidos-tierklinik',
        name: 'Dr. Fido\'s Tierklinik',
        type: 'shops_services' as const,
        cityId: berlinCity.id,
        region: 'Kreuzberg',
        country: 'Germany',
        lat: 52.4920,
        lng: 13.4100,
        shortDescription: '24-hour emergency veterinary clinic',
        dogFriendlyLevel: 5,
        rating: 4.8
      },
      {
        slug: 'hundepension-berlin',
        name: 'Hundepension Berlin',
        type: 'accommodation' as const,
        cityId: berlinCity.id,
        region: 'Mitte',
        country: 'Germany',
        lat: 52.5200,
        lng: 13.4100,
        shortDescription: 'Premium dog hotel with daycare services',
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
        type: 'parks' as const,
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
        type: 'walks_trails' as const,
        cityId: barcelonaCity.id,
        region: 'Ciutat Vella',
        country: 'Spain',
        lat: 41.3755,
        lng: 2.1838,
        shortDescription: 'Popular beach with dog-friendly areas',
        dogFriendlyLevel: 4,
        rating: 4.1
      },
      {
        slug: 'parc-de-la-ciutadella',
        name: 'Parc de la Ciutadella',
        type: 'parks' as const,
        cityId: barcelonaCity.id,
        region: 'Ciutat Vella',
        country: 'Spain',
        lat: 41.3870,
        lng: 2.1875,
        shortDescription: 'Central park with lake and large green areas',
        dogFriendlyLevel: 4,
        rating: 4.5
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
  
  // Add places for Paris
  const parisCity = await prisma.city.findUnique({ where: { slug: 'paris' } })
  if (parisCity) {
    const places = [
      {
        slug: 'jardin-du-luxembourg',
        name: 'Jardin du Luxembourg',
        type: 'parks' as const,
        cityId: parisCity.id,
        region: 'Paris',
        country: 'France',
        lat: 48.8462,
        lng: 2.3372,
        shortDescription: 'Beautiful park with designated dog areas',
        dogFriendlyLevel: 3,
        rating: 4.5
      },
      {
        slug: 'bois-de-boulogne',
        name: 'Bois de Boulogne',
        type: 'walks_trails' as const,
        cityId: parisCity.id,
        region: 'Paris',
        country: 'France',
        lat: 48.8624,
        lng: 2.2495,
        shortDescription: 'Large forest with extensive off-leash areas',
        dogFriendlyLevel: 5,
        rating: 4.7
      },
      {
        slug: 'le-comptoir-general',
        name: 'Le Comptoir Général',
        type: 'cafes_restaurants' as const,
        cityId: parisCity.id,
        region: 'Paris',
        country: 'France',
        lat: 48.8693,
        lng: 2.3652,
        shortDescription: 'Dog-friendly bar and café with garden',
        dogFriendlyLevel: 4,
        rating: 4.3
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
  
  // Add places for Rome
  const romeCity = await prisma.city.findUnique({ where: { slug: 'rome' } })
  if (romeCity) {
    const places = [
      {
        slug: 'villa-borghese',
        name: 'Villa Borghese',
        type: 'parks' as const,
        cityId: romeCity.id,
        region: 'Lazio',
        country: 'Italy',
        lat: 41.9142,
        lng: 12.4922,
        shortDescription: 'Large park in the heart of Rome',
        dogFriendlyLevel: 4,
        rating: 4.6
      },
      {
        slug: 'parco-degli-acquedotti',
        name: 'Parco degli Acquedotti',
        type: 'walks_trails' as const,
        cityId: romeCity.id,
        region: 'Lazio',
        country: 'Italy',
        lat: 41.8536,
        lng: 12.5625,
        shortDescription: 'Amazing trails among ancient Roman aqueducts',
        dogFriendlyLevel: 5,
        rating: 4.8
      },
      {
        slug: 'caffe-greco',
        name: 'Antico Caffè Greco',
        type: 'cafes_restaurants' as const,
        cityId: romeCity.id,
        region: 'Lazio',
        country: 'Italy',
        lat: 41.9057,
        lng: 12.4798,
        shortDescription: 'Historic café with dog-friendly outdoor seating',
        dogFriendlyLevel: 3,
        rating: 4.2
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