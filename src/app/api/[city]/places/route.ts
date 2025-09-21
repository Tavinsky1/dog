import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const querySchema = z.object({
  type: z.string().optional(),
  q: z.string().optional(),
  minLevel: z.string().transform(val => val ? parseInt(val) : undefined).optional(),
  tags: z.string().optional(),
  amenities: z.string().optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ city: string }> }
) {
  try {
    const { city: citySlug } = await params

    // Check if city exists and is active
    const city = await prisma.city.findUnique({
      where: { slug: citySlug, active: true },
    })

    if (!city) {
      return NextResponse.json(
        { items: [], total: 0 },
        { status: 404 }
      )
    }

    const { searchParams } = new URL(request.url)
    const query = querySchema.parse({
      type: searchParams.get('type') || undefined,
      q: searchParams.get('q') || undefined,
      minLevel: searchParams.get('minLevel') || undefined,
      tags: searchParams.get('tags') || undefined,
      amenities: searchParams.get('amenities') || undefined,
    })

    // Build where clause
    const where: any = {
      cityId: city.id,
    }

    if (query.type) {
      where.type = query.type
    }

    if (query.minLevel) {
      where.dogFriendlyLevel = {
        gte: query.minLevel,
      }
    }

    if (query.q) {
      where.OR = [
        { name: { contains: query.q, mode: 'insensitive' } },
        { shortDescription: { contains: query.q, mode: 'insensitive' } },
      ]
    }

    if (query.tags) {
      const tags = query.tags.split(',').map(tag => tag.trim())
      where.tags = {
        hasSome: tags,
      }
    }

    if (query.amenities) {
      const amenities = query.amenities.split(',').map(amenity => amenity.trim())
      where.amenities = {
        hasSome: amenities,
      }
    }

    const [places, total] = await Promise.all([
      prisma.place.findMany({
        where,
        select: {
          id: true,
          slug: true,
          name: true,
          type: true,
          lat: true,
          lng: true,
          shortDescription: true,
          imageUrl: true,
          dogFriendlyLevel: true,
          tags: true,
        },
        take: 50, // MVP limit
        orderBy: { name: 'asc' },
      }),
      prisma.place.count({ where }),
    ])

    return NextResponse.json({
      items: places,
      total,
    })
  } catch (error) {
    console.error('Error fetching places:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}