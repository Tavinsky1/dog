import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { city: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || undefined
    const q = searchParams.get('q') || undefined
    const minLevel = searchParams.get('minLevel')
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100)

    const city = await prisma.city.findFirst({
      where: { slug: params.city, active: true }
    })

    if (!city) {
      return NextResponse.json(
        { error: 'City not found' },
        { status: 404 }
      )
    }

    const where: any = { cityId: city.id }

    if (type) {
      where.type = type
    }

    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { shortDescription: { contains: q, mode: 'insensitive' } },
      ]
    }

    if (minLevel && !isNaN(Number(minLevel))) {
      where.dogFriendlyLevel = { gte: Number(minLevel) }
    }

    const [items, total] = await Promise.all([
      prisma.place.findMany({
        where,
        orderBy: { name: 'asc' },
        take: limit,
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
          cityId: true,
        }
      }),
      prisma.place.count({ where })
    ])

    return NextResponse.json({ items, total })
  } catch (error) {
    console.error('Places API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}