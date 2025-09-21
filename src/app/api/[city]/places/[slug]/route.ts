import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ city: string; slug: string }> }
) {
  try {
    const { city: citySlug, slug: placeSlug } = await params;

    // Check if city exists and is active
    const city = await prisma.city.findUnique({
      where: { slug: citySlug, active: true },
    })

    if (!city) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    // Find the place
    const place = await prisma.place.findFirst({
      where: {
        slug: placeSlug,
        cityId: city.id,
      },
      include: {
        city: {
          select: {
            slug: true,
            name: true,
          },
        },
      },
    })

    if (!place) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(place)
  } catch (error) {
    console.error('Error fetching place:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}