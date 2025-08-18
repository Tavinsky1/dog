#!/usr/bin/env npx tsx

import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

interface ReviewData {
  google_place_id?: string
  fallback_key?: {
    name: string
    address: string
  }
  source: string
  url?: string
  language?: string
  published_at?: string
  rating: number
  excerpt?: string
  summary?: string
  tags: string[]
  author?: string
  helpful_count?: number
}

async function findPlaceByGoogleId(googlePlaceId: string) {
  return await prisma.place.findUnique({
    where: { googlePlaceId }
  })
}

async function findPlaceByFallbackKey(fallbackKey: { name: string; address: string }) {
  // Try to find by exact name and address match
  return await prisma.place.findFirst({
    where: {
      name: { contains: fallbackKey.name, mode: 'insensitive' },
      address: { contains: fallbackKey.address, mode: 'insensitive' }
    }
  })
}

async function importReviews() {
  const reviewsFilePath = path.join(process.cwd(), 'manus/Prompt for Deep Research on Places and Reviews/reviews.jsonl')
  
  if (!fs.existsSync(reviewsFilePath)) {
    console.error(`Reviews file not found at: ${reviewsFilePath}`)
    process.exit(1)
  }

  const content = fs.readFileSync(reviewsFilePath, 'utf-8').trim()
  
  if (!content) {
    console.log('Reviews file is empty - no reviews to import')
    return
  }

  const lines = content.split('\n').filter(line => line.trim())

  console.log(`Found ${lines.length} reviews to import`)

  let imported = 0
  let skipped = 0
  let notMatched = 0

  for (const line of lines) {
    try {
      const reviewData: ReviewData = JSON.parse(line)
      
      // Find the corresponding place
      let place = null
      
      if (reviewData.google_place_id) {
        place = await findPlaceByGoogleId(reviewData.google_place_id)
      }
      
      if (!place && reviewData.fallback_key) {
        place = await findPlaceByFallbackKey(reviewData.fallback_key)
      }
      
      if (!place) {
        console.log(`⚠ Could not find place for review: ${reviewData.google_place_id || JSON.stringify(reviewData.fallback_key)}`)
        notMatched++
        continue
      }

      // Create the review
      const review = await prisma.review.create({
        data: {
          placeId: place.id,
          rating: reviewData.rating,
          body: reviewData.excerpt || reviewData.summary || null,
          tags: reviewData.tags || [],
          source: reviewData.source,
          url: reviewData.url || null,
          language: reviewData.language || null,
          author: reviewData.author || null,
          helpfulCount: reviewData.helpful_count || 0,
          publishedAt: reviewData.published_at ? new Date(reviewData.published_at) : null,
          metadata: {
            summary: reviewData.summary,
            excerpt: reviewData.excerpt,
            original_source: reviewData.source
          },
          status: 'published' // Auto-approve imported reviews
        }
      })

      // Update place rating if this is the first review or recalculate
      const placeReviews = await prisma.review.findMany({
        where: { placeId: place.id, status: 'published' },
        select: { rating: true }
      })

      const totalRating = placeReviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0)
      const avgRating = totalRating / placeReviews.length
      
      await prisma.place.update({
        where: { id: place.id },
        data: {
          rating: Math.round(avgRating * 10) / 10, // Round to 1 decimal
          ratingCount: placeReviews.length
        }
      })

      console.log(`✓ Imported review for: ${place.name} (${reviewData.rating}⭐)`)
      imported++

    } catch (error) {
      console.error(`Error processing review: ${error}`)
      console.error(`Line: ${line}`)
      skipped++
    }
  }

  console.log('\n=== Import Summary ===')
  console.log(`Imported: ${imported} reviews`)
  console.log(`Not matched: ${notMatched} reviews (place not found)`)
  console.log(`Skipped: ${skipped} reviews (errors)`)
  console.log(`Total processed: ${imported + notMatched + skipped}`)
}

async function main() {
  try {
    await importReviews()
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
