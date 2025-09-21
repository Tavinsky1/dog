import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { city: string; slug: string } }
) {
  try {
    const place = await prisma.place.findFirst({
      where: { slug: params.slug },
      include: { city: true }
    })

    if (!place) {
      return NextResponse.json(
        { error: 'Place not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(place)
  } catch (error) {
    console.error('Place detail API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}