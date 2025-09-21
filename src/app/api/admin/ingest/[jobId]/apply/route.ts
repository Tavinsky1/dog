import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { PlaceType, Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { isAuthenticatedSession } from '@/types/auth'

type ValidDataRow = {
  rowNumber?: number
  name: string
  type: PlaceType
  cityId: string
  region?: string | null
  country?: string | null
  latitude: number
  longitude: number
  short_description?: string | null
  full_description?: string | null
  image_url?: string | null
  website_url?: string | null
  phone?: string | null
  opening_hours?: string | null
  price_range?: string | null
  rating?: number | null
  amenities?: string | null
  tags?: string | null
}

function isValidDataRow(row: unknown): row is ValidDataRow {
  if (!row || typeof row !== 'object') {
    return false
  }

  const candidate = row as Record<string, unknown>

  return (
    typeof candidate.name === 'string' &&
    candidate.name.trim().length > 0 &&
    typeof candidate.type === 'string' &&
    candidate.type.trim().length > 0 &&
    Object.values(PlaceType).includes(candidate.type as PlaceType) &&
    typeof candidate.cityId === 'string' &&
    candidate.cityId.trim().length > 0 &&
    typeof candidate.latitude === 'number' &&
    typeof candidate.longitude === 'number'
  )
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params

    // Check authentication
    const session = await getServerSession(authOptions)
    if (!isAuthenticatedSession(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has admin/editor role
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    })

    if (!user || !['ADMIN', 'EDITOR'].includes(user.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Get the ingest job
    const job = await prisma.ingestJob.findUnique({
      where: { id: jobId }
    })

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    if (job.status !== 'validated') {
      return NextResponse.json({ error: 'Job is not ready to apply' }, { status: 400 })
    }

    if (!job.validData || !Array.isArray(job.validData)) {
      return NextResponse.json({ error: 'No valid data to apply' }, { status: 400 })
    }

    // Apply the data
    let appliedCount = 0
    const errors: string[] = []

    for (const rawRow of job.validData) {
      let rowNumber: number | 'unknown' = 'unknown'

      try {
        if (!isValidDataRow(rawRow)) {
          const candidate = rawRow as Record<string, unknown> | null
          const candidateRowNumber = candidate && typeof candidate.rowNumber === 'number'
            ? candidate.rowNumber
            : 'unknown'
          errors.push(`Invalid row data encountered at row ${candidateRowNumber}; skipping entry`)
          continue
        }

        rowNumber = typeof rawRow.rowNumber === 'number' ? rawRow.rowNumber : 'unknown'

        const row = rawRow
        const rowSlug = `${row.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${row.cityId}`
        const amenities = typeof row.amenities === 'string' && row.amenities.trim().length > 0
          ? row.amenities.split(',').map((a: string) => a.trim()).filter(Boolean)
          : null
        const tags = typeof row.tags === 'string' && row.tags.trim().length > 0
          ? row.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
          : null
        const region = typeof row.region === 'string' && row.region.trim().length > 0 ? row.region : undefined
        const country = typeof row.country === 'string' && row.country.trim().length > 0 ? row.country : 'Unknown'
        const shortDescription = typeof row.short_description === 'string' && row.short_description.trim().length > 0
          ? row.short_description
          : ''
        const fullDescription = typeof row.full_description === 'string' && row.full_description.trim().length > 0
          ? row.full_description
          : undefined
        const imageUrl = typeof row.image_url === 'string' && row.image_url.trim().length > 0 ? row.image_url : undefined
        const websiteUrl = typeof row.website_url === 'string' && row.website_url.trim().length > 0 ? row.website_url : undefined
        const phone = typeof row.phone === 'string' && row.phone.trim().length > 0 ? row.phone : undefined
        const openingHours = typeof row.opening_hours === 'string' && row.opening_hours.trim().length > 0
          ? row.opening_hours
          : undefined
        const priceRange = typeof row.price_range === 'string' && row.price_range.trim().length > 0
          ? row.price_range
          : undefined
        const rating = typeof row.rating === 'number' ? row.rating : undefined
        const amenitiesValue = amenities ?? Prisma.JsonNull
        const tagsValue = tags ?? Prisma.JsonNull

        await prisma.place.upsert({
          where: {
            slug: rowSlug
          },
          update: {
            name: row.name,
            type: row.type,
            cityId: row.cityId,
            region,
            country,
            lat: row.latitude,
            lng: row.longitude,
            shortDescription,
            fullDescription,
            imageUrl,
            websiteUrl,
            phone,
            openingHours,
            priceRange,
            rating,
            amenities: amenitiesValue,
            tags: tagsValue
          },
          create: {
            slug: rowSlug,
            name: row.name,
            type: row.type,
            cityId: row.cityId,
            region: region ?? null,
            country,
            lat: row.latitude,
            lng: row.longitude,
            shortDescription,
            fullDescription: fullDescription ?? null,
            imageUrl: imageUrl ?? null,
            websiteUrl: websiteUrl ?? null,
            phone: phone ?? null,
            openingHours: openingHours ?? null,
            priceRange: priceRange ?? null,
            rating: rating ?? null,
            amenities: amenitiesValue,
            tags: tagsValue
          }
        })

        appliedCount++
      } catch (error) {
        const errorMessage = `Failed to apply row ${rowNumber}: ${error instanceof Error ? error.message : 'Unknown error'}`
        errors.push(errorMessage)
        console.error(errorMessage)
      }
    }

    // Update job status
    const updatedJob = await prisma.ingestJob.update({
      where: { id: jobId },
      data: {
        status: errors.length === 0 ? 'completed' : 'completed_with_errors',
        appliedAt: new Date(),
        appliedBy: session.user.id
      }
    })

    return NextResponse.json({
      job: {
        id: updatedJob.id,
        filename: updatedJob.filename,
        status: updatedJob.status,
        appliedAt: updatedJob.appliedAt
      },
      appliedCount,
      errors: errors.length > 0 ? errors : undefined
    })

  } catch (error) {
    console.error('Ingest apply API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
