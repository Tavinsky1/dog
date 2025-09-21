import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

const toggleFavoriteSchema = z.object({
  placeId: z.string()
})

// GET /api/user/favorites - Get user's favorites
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !(session.user as any)?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const favorites = await prisma.favorite.findMany({
      where: {
        userId: (session.user as any).id
      },
      include: {
        place: {
          include: {
            city: {
              select: {
                name: true,
                slug: true
              }
            }
          }
        }
      },
      orderBy: {
        place: {
          name: 'asc'
        }
      }
    })

    return NextResponse.json(favorites)
  } catch (error) {
    console.error('Favorites API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/user/favorites - Add or remove favorite
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !(session.user as any)?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { placeId } = toggleFavoriteSchema.parse(body)

    // Check if place exists
    const place = await prisma.place.findUnique({
      where: { id: placeId }
    })

    if (!place) {
      return NextResponse.json({ error: 'Place not found' }, { status: 404 })
    }

    // Check if favorite already exists
    const existingFavorite = await prisma.favorite.findFirst({
      where: {
        userId: (session.user as any).id,
        placeId: placeId
      }
    })

    if (existingFavorite) {
      // Remove favorite
      await prisma.favorite.delete({
        where: { id: existingFavorite.id }
      })

      return NextResponse.json({
        action: 'removed',
        placeId,
        message: 'Removed from favorites'
      })
    } else {
      // Add favorite
      await prisma.favorite.create({
        data: {
          userId: (session.user as any).id,
          placeId: placeId
        }
      })

      return NextResponse.json({
        action: 'added',
        placeId,
        message: 'Added to favorites'
      })
    }

  } catch (error) {
    console.error('Favorites API error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
