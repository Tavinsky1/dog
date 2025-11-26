#!/usr/bin/env npx tsx

/**
 * Restore places from places.seed.json into the database
 * This preserves all the carefully curated data including photos
 */

import { PrismaClient, PlaceType } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

interface SeedPlace {
  id: string
  country: string
  city: string
  name: string
  category: string
  lat: number
  lon: number
  description?: string
  fullDescription?: string
  photos: string[]
  website?: string
  phone?: string
  verified: boolean
  address?: string
}

// Map seed categories to PlaceType enum
function mapCategoryToPlaceType(category: string): PlaceType {
  const mapping: Record<string, PlaceType> = {
    'parks': PlaceType.parks,
    'cafes_restaurants': PlaceType.cafes_restaurants,
    'walks_trails': PlaceType.walks_trails,
    'shops_services': PlaceType.shops_services,
    'accommodation': PlaceType.accommodation,
    'tips_local_info': PlaceType.tips_local_info,
    // Legacy mappings
    'cafes': PlaceType.cafes_restaurants,
    'restaurants': PlaceType.cafes_restaurants,
    'trails': PlaceType.walks_trails,
    'beaches': PlaceType.walks_trails,
    'vets': PlaceType.shops_services,
    'groomers': PlaceType.shops_services,
    'shops': PlaceType.shops_services,
    'hotels': PlaceType.accommodation,
  }
  return mapping[category] || PlaceType.tips_local_info
}

// Map city slug to country name for database
function getCityCountryMapping(): Map<string, string> {
  const countriesPath = path.join(process.cwd(), 'data', 'countries.json')
  const countriesData = JSON.parse(fs.readFileSync(countriesPath, 'utf-8'))
  
  const mapping = new Map<string, string>()
  for (const country of countriesData.countries) {
    for (const city of country.cities) {
      mapping.set(city.slug, country.name)
    }
  }
  return mapping
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function restoreFromSeed() {
  console.log('🔄 Restoring places from seed file...')
  
  const seedPath = path.join(process.cwd(), 'data', 'places.seed.json')
  
  if (!fs.existsSync(seedPath)) {
    console.error('❌ Seed file not found:', seedPath)
    process.exit(1)
  }
  
  const places: SeedPlace[] = JSON.parse(fs.readFileSync(seedPath, 'utf-8'))
  console.log(`📦 Found ${places.length} places in seed file`)
  
  const cityCountryMap = getCityCountryMapping()
  
  // Get existing cities from database
  const existingCities = await prisma.city.findMany({
    select: { slug: true, id: true }
  })
  const citySlugToId = new Map(existingCities.map(c => [c.slug, c.id]))
  
  // Group places by city
  const placesByCity = new Map<string, SeedPlace[]>()
  for (const place of places) {
    if (!placesByCity.has(place.city)) {
      placesByCity.set(place.city, [])
    }
    placesByCity.get(place.city)!.push(place)
  }
  
  console.log(`🌍 Cities in seed: ${[...placesByCity.keys()].join(', ')}`)
  
  let created = 0
  let skipped = 0
  let citiesCreated = 0
  
  for (const [citySlug, cityPlaces] of placesByCity) {
    // Ensure city exists
    let cityId = citySlugToId.get(citySlug)
    
    if (!cityId) {
      // Create the city
      const countryName = cityCountryMap.get(citySlug) || 'Unknown'
      const firstPlace = cityPlaces[0]
      
      console.log(`  📍 Creating city: ${citySlug} (${countryName})`)
      
      const city = await prisma.city.create({
        data: {
          slug: citySlug,
          name: citySlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
          country: countryName,
          lat: firstPlace.lat,
          lng: firstPlace.lon,
          active: true,
        }
      })
      cityId = city.id
      citySlugToId.set(citySlug, cityId)
      citiesCreated++
    }
    
    // Import places for this city
    for (const place of cityPlaces) {
      const placeSlug = slugify(place.name)
      
      // Check if place already exists
      const existing = await prisma.place.findFirst({
        where: {
          OR: [
            { slug: placeSlug },
            { name: place.name, cityId: cityId }
          ]
        }
      })
      
      if (existing) {
        // Update existing place with photo data if missing
        if (!existing.imageUrl && place.photos.length > 0) {
          await prisma.place.update({
            where: { id: existing.id },
            data: {
              imageUrl: place.photos[0],
              gallery: place.photos.length > 1 ? place.photos.slice(1) : undefined,
            }
          })
          console.log(`  🖼️  Updated photos for: ${place.name}`)
        }
        skipped++
        continue
      }
      
      try {
        await prisma.place.create({
          data: {
            slug: placeSlug + '-' + Date.now().toString(36), // Ensure unique
            name: place.name,
            type: mapCategoryToPlaceType(place.category),
            cityId: cityId,
            country: cityCountryMap.get(place.city) || 'Unknown',
            lat: place.lat,
            lng: place.lon,
            shortDescription: place.description || `Dog-friendly ${place.category.replace('_', ' ')} in ${place.city}`,
            fullDescription: place.fullDescription || null,
            imageUrl: place.photos[0] || null,
            gallery: place.photos.length > 1 ? place.photos.slice(1) : undefined,
            websiteUrl: place.website || null,
            phone: place.phone || null,
            source: 'seed_restore',
          }
        })
        created++
        console.log(`  ✅ Created: ${place.name}`)
      } catch (error: any) {
        console.log(`  ⚠️  Failed to create ${place.name}: ${error.message}`)
      }
    }
  }
  
  console.log('\n📊 Summary:')
  console.log(`  Cities created: ${citiesCreated}`)
  console.log(`  Places created: ${created}`)
  console.log(`  Places skipped (already exist): ${skipped}`)
  console.log('✨ Restore complete!')
}

restoreFromSeed()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
