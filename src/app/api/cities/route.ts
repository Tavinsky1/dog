import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get all cities from the database that have places
    const cities = await prisma.city.findMany({
      where: {
        active: true,
      },
      select: {
        slug: true,
        name: true,
        country: true,
        _count: {
          select: {
            places: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    // Only return cities that have at least one place
    const citiesWithPlaces = cities
      .filter(city => city._count.places > 0)
      .map(city => ({
        id: city.slug,
        slug: city.slug,
        name: city.name,
        country: city.country,
      }))

    return NextResponse.json(citiesWithPlaces)
  } catch (error) {
    console.error('Error fetching cities:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}