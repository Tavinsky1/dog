#!/usr/bin/env npx tsx

import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'
import { parse } from 'csv-parse/sync'

const prisma = new PrismaClient()

interface CSVPlace {
  id: string
  name: string
  type: string
  city: string
  region: string
  country: string
  latitude: string
  longitude: string
  short_description: string
  full_description: string
  image_url: string
  gallery_urls: string
  dog_friendly_level: string
  amenities: string
  rules: string
  website_url: string
  contact_phone: string
  contact_email: string
  price_range: string
  opening_hours: string
  rating: string
  tags: string
}

async function restoreFromCSV() {
  const csvPath = path.join(process.cwd(), 'data/dog_atlas_master_v0_7.csv')
  
  if (!fs.existsSync(csvPath)) {
    console.error(`CSV file not found at: ${csvPath}`)
    process.exit(1)
  }

  console.log(`Reading CSV from: ${csvPath}`)
  const fileContent = fs.readFileSync(csvPath, 'utf-8')
  
  const records: CSVPlace[] = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  })

  console.log(`Found ${records.length} places to restore`)

  // First, ensure cities exist
  const cities = [...new Set(records.map(r => r.city).filter(Boolean))]
  console.log(`\nCreating ${cities.length} cities...`)
  
  for (const cityName of cities) {
    try {
      const citySlug = cityName.toLowerCase().replace(/\s+/g, '-')
      const sampleRecord = records.find(r => r.city === cityName)
      const lat = parseFloat(sampleRecord?.latitude || '0') || 0
      const lng = parseFloat(sampleRecord?.longitude || '0') || 0
      
      await prisma.city.upsert({
        where: { slug: citySlug },
        create: {
          name: cityName,
          slug: citySlug,
          country: sampleRecord?.country || 'Unknown',
          lat: lat,
          lng: lng
        },
        update: {
          name: cityName,
          lat: lat,
          lng: lng
        }
      })
      console.log(`✓ City: ${cityName}`)
    } catch (error) {
      console.error(`✗ Failed to create city ${cityName}:`, error)
    }
  }

  // Now import places
  let imported = 0
  let failed = 0

  console.log(`\nImporting places...`)
  
  for (const record of records) {
    try {
      // Skip if no city
      if (!record.city) {
        console.log(`⚠ Skipping ${record.name}: no city`)
        failed++
        continue
      }

      // Find the city
      const citySlug = record.city.toLowerCase().replace(/\s+/g, '-')
      const city = await prisma.city.findUnique({
        where: { slug: citySlug }
      })

      if (!city) {
        console.error(`✗ City not found: ${record.city}`)
        failed++
        continue
      }

      // Create slug from name + city to ensure uniqueness
      const slug = (record.name + '-' + record.city)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')

      // Map type to PlaceType enum
      const typeMap: Record<string, string> = {
        'park': 'parks',
        'cafe': 'cafes_restaurants',
        'restaurant': 'cafes_restaurants',
        'hotel': 'accommodation',
        'vet': 'shops_services',
        'grooming': 'shops_services',
        'shop': 'shops_services',
        'trail': 'walks_trails',
        'beach': 'walks_trails'
      }

      let placeType: any = 'tips_local_info'
      for (const [key, value] of Object.entries(typeMap)) {
        if (record.type?.toLowerCase().includes(key)) {
          placeType = value
          break
        }
      }

      const lat = parseFloat(record.latitude) || 0
      const lng = parseFloat(record.longitude) || 0

      await prisma.place.upsert({
        where: {
          slug: slug
        },
        create: {
          cityId: city.id,
          name: record.name,
          slug: slug,
          type: placeType,
          region: record.region || null,
          country: record.country || city.country,
          lat: lat,
          lng: lng,
          shortDescription: record.short_description || record.name,
          fullDescription: record.full_description || null,
          imageUrl: record.image_url || null,
          websiteUrl: record.website_url || null,
          phone: record.contact_phone || null,
          rating: parseFloat(record.rating) || null
        },
        update: {
          name: record.name,
          type: placeType,
          shortDescription: record.short_description || record.name,
          fullDescription: record.full_description || null,
          imageUrl: record.image_url || null,
          lat: lat,
          lng: lng,
          websiteUrl: record.website_url || null,
          phone: record.contact_phone || null,
          rating: parseFloat(record.rating) || null
        }
      })

      imported++
      console.log(`✓ ${imported}/${records.length}: ${record.name} (${record.city})`)

    } catch (error) {
      failed++
      console.error(`✗ Failed to import ${record.name}:`, error)
    }
  }

  console.log(`\n=== Restoration Complete ===`)
  console.log(`✓ Imported: ${imported} places`)
  console.log(`✗ Failed: ${failed} places`)
  console.log(`Total: ${records.length}`)

  // Verify
  const placeCount = await prisma.place.count()
  const cityCount = await prisma.city.count()
  console.log(`\nDatabase now has:`)
  console.log(`- ${cityCount} cities`)
  console.log(`- ${placeCount} places`)
}

async function main() {
  try {
    await restoreFromCSV()
  } catch (error) {
    console.error("Restoration failed:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
