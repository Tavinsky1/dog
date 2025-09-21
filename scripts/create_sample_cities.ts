#!/usr/bin/env npx tsx

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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

async function main() {
  console.log('Creating sample cities...')
  
  for (const city of cities) {
    try {
      const result = await prisma.city.upsert({
        where: { slug: city.slug },
        update: city,
        create: city
      })
      console.log(`✓ Created/updated city: ${result.name}`)
    } catch (error) {
      console.error(`✗ Failed to create city ${city.name}:`, error)
    }
  }
  
  // Create some sample places for Berlin
  const berlinCity = await prisma.city.findUnique({ where: { slug: 'berlin' } })
  if (berlinCity) {
    const samplePlaces = [
      {
        slug: 'tiergarten-park',
        name: 'Tiergarten Park',
        cityId: berlinCity.id,
        type: 'park' as const,
        description: 'Large central park perfect for dog walking',
        address: 'Tiergarten, 10785 Berlin',
        lat: 52.5144,
        lng: 13.3501,
        rating: 4.5
      },
      {
        slug: 'cafe-einstein',
        name: 'Café Einstein',
        cityId: berlinCity.id,
        type: 'cafe' as const,
        description: 'Dog-friendly café with outdoor seating',
        address: 'Kurfürstenstraße 58, 10785 Berlin',
        lat: 52.5023,
        lng: 13.3617,
        rating: 4.2
      }
    ]
    
    for (const place of samplePlaces) {
      try {
        const result = await prisma.place.upsert({
          where: { slug: place.slug },
          update: place,
          create: place
        })
        console.log(`✓ Created/updated place: ${result.name}`)
      } catch (error) {
        console.error(`✗ Failed to create place ${place.name}:`, error)
      }
    }
  }
  
  const cityCount = await prisma.city.count()
  const placeCount = await prisma.place.count()
  console.log(`\nTotal cities in database: ${cityCount}`)
  console.log(`Total places in database: ${placeCount}`)
  
  await prisma.$disconnect()
}

main()