#!/usr/bin/env npx tsx

import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

interface PlaceData {
  city: string
  name: string
  category: string
  slug: string
  description?: string
  address?: string
  district?: string
  neighborhood?: string
  lat?: number
  lng?: number
  website?: string
  phone?: string
  priceLevel?: number
  status: string
  features: Record<string, any>
  hours?: Array<{
    day: string
    open: string
    close: string
  }>
  activity?: {
    type: string
    attrs: Record<string, any>
  }
  rating?: number
  ratingCount?: number
  photos: Array<{
    url: string
    width?: number
    height?: number
    source?: string
  }>
  external_ids: {
    google_place_id?: string
    osm_id?: string
    facebook_url?: string
    instagram_url?: string
  }
}

async function importPlaces() {
  const placesFilePath = path.join(process.cwd(), 'manus/Prompt for Deep Research on Places and Reviews/places.jsonl')
  
  if (!fs.existsSync(placesFilePath)) {
    console.error(`Places file not found at: ${placesFilePath}`)
    process.exit(1)
  }

  const content = fs.readFileSync(placesFilePath, 'utf-8')
  const lines = content.trim().split('\n').filter(line => line.trim())

  console.log(`Found ${lines.length} places to import`)

  let imported = 0
  let updated = 0
  let skipped = 0

  for (const line of lines) {
    try {
      const placeData: PlaceData = JSON.parse(line)
      
      // Prepare external URLs for JSON storage
      const externalUrls = {
        facebook_url: placeData.external_ids.facebook_url,
        instagram_url: placeData.external_ids.instagram_url
      }

      // Clean up null values
      const cleanExternalUrls = Object.fromEntries(
        Object.entries(externalUrls).filter(([, value]) => value !== null && value !== undefined)
      )

      // Upsert the place
      const place = await prisma.place.upsert({
        where: {
          city_slug: {
            city: placeData.city,
            slug: placeData.slug
          }
        },
        update: {
          name: placeData.name,
          category: placeData.category,
          description: placeData.description || null,
          address: placeData.address || null,
          district: placeData.district || null,
          neighborhood: placeData.neighborhood || null,
          lat: placeData.lat || null,
          lng: placeData.lng || null,
          website: placeData.website || null,
          phone: placeData.phone || null,
          priceLevel: placeData.priceLevel || null,
          rating: placeData.rating || 0,
          ratingCount: placeData.ratingCount || 0,
          status: placeData.status,
          googlePlaceId: placeData.external_ids.google_place_id || null,
          osmId: placeData.external_ids.osm_id || null,
          externalUrls: Object.keys(cleanExternalUrls).length > 0 ? cleanExternalUrls : null,
          updatedAt: new Date()
        },
        create: {
          city: placeData.city,
          name: placeData.name,
          slug: placeData.slug,
          category: placeData.category,
          description: placeData.description || null,
          address: placeData.address || null,
          district: placeData.district || null,
          neighborhood: placeData.neighborhood || null,
          lat: placeData.lat || null,
          lng: placeData.lng || null,
          website: placeData.website || null,
          phone: placeData.phone || null,
          priceLevel: placeData.priceLevel || null,
          rating: placeData.rating || 0,
          ratingCount: placeData.ratingCount || 0,
          status: placeData.status,
          googlePlaceId: placeData.external_ids.google_place_id || null,
          osmId: placeData.external_ids.osm_id || null,
          externalUrls: Object.keys(cleanExternalUrls).length > 0 ? cleanExternalUrls : null
        }
      })

      // Check if this was an update or create
      const wasUpdate = await prisma.place.findFirst({
        where: {
          id: place.id,
          updatedAt: { lt: new Date(Date.now() - 1000) } // Created more than 1 second ago
        }
      })

      if (wasUpdate) {
        updated++
      } else {
        imported++
      }

      // Handle features
      if (placeData.features && Object.keys(placeData.features).length > 0) {
        // Remove existing features for this place
        await prisma.placeFeature.deleteMany({
          where: { placeId: place.id }
        })

        // Add new features
        const featureData = Object.entries(placeData.features)
          .filter(([, value]) => value !== null && value !== undefined)
          .map(([key, value]) => ({
            placeId: place.id,
            key,
            value: String(value)
          }))

        if (featureData.length > 0) {
          await prisma.placeFeature.createMany({
            data: featureData
          })
        }
      }

      // Handle hours
      if (placeData.hours && placeData.hours.length > 0) {
        // Remove existing hours for this place
        await prisma.placeHour.deleteMany({
          where: { placeId: place.id }
        })

        // Add new hours
        const hoursData = placeData.hours.map(hour => ({
          placeId: place.id,
          day: hour.day,
          open: hour.open,
          close: hour.close
        }))

        await prisma.placeHour.createMany({
          data: hoursData
        })
      }

      // Handle activity
      if (placeData.activity) {
        // Remove existing activity for this place
        await prisma.activity.deleteMany({
          where: { placeId: place.id }
        })

        // Add new activity
        await prisma.activity.create({
          data: {
            placeId: place.id,
            type: placeData.activity.type,
            attrs: placeData.activity.attrs
          }
        })
      }

      // Handle photos
      if (placeData.photos && placeData.photos.length > 0) {
        // Remove existing photos for this place (only system-imported ones)
        await prisma.photo.deleteMany({
          where: { 
            placeId: place.id,
            userId: null // Only delete system photos, not user-uploaded ones
          }
        })

        // Add new photos
        const photoData = placeData.photos.map(photo => ({
          placeId: place.id,
          url: photo.url,
          width: photo.width || null,
          height: photo.height || null,
          source: photo.source || null
        }))

        await prisma.photo.createMany({
          data: photoData
        })
      }

      console.log(`✓ Processed: ${placeData.name} (${placeData.city})`)

    } catch (error) {
      console.error(`Error processing place: ${error}`)
      console.error(`Line: ${line}`)
      skipped++
    }
  }

  console.log('\n=== Import Summary ===')
  console.log(`Imported: ${imported} new places`)
  console.log(`Updated: ${updated} existing places`)
  console.log(`Skipped: ${skipped} places (errors)`)
  console.log(`Total processed: ${imported + updated + skipped}`)
}

async function main() {
  try {
    await importPlaces()
  } catch (error) {
    console.error('Import failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  main()
}
