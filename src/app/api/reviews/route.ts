import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { isAuthenticatedSession } from '@/types/auth'

const createReviewSchema = z.object({
  placeId: z.string(),
  rating: z.number().min(1).max(5),
  body: z.string().optional(),
  tags: z.array(z.string()).default([])
})

const querySchema = z.object({
  placeId: z.string().optional(),
  page: z.string().transform(val => parseInt(val) || 1).optional(),
  limit: z.string().transform(val => parseInt(val) || 10).optional()
})

// GET /api/reviews - Get reviews with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = querySchema.parse({
      placeId: searchParams.get('placeId') || undefined,
      page: searchParams.get('page') || undefined,
      limit: searchParams.get('limit') || undefined
    })

    const page = query.page || 1
    const limit = Math.min(query.limit || 10, 50) // Max 50 per page
    const skip = (page - 1) * limit

    const where: any = {
      status: 'published'
    }

    if (query.placeId) {
      where.placeId = query.placeId
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          user: {
            select: {
              name: true
            }
          },
          place: {
            select: {
              name: true,
              slug: true,
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
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.review.count({ where })
    ])

    const pages = Math.ceil(total / limit)

    return NextResponse.json({
      reviews,
      pagination: {
        page,
        pages,
        limit,
        total
      }
    })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/reviews - Create a new review
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!isAuthenticatedSession(session)) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = createReviewSchema.parse(body)

    // Check if user already reviewed this place
    const existingReview = await prisma.review.findFirst({
      where: {
        placeId: validatedData.placeId,
        userId: session.user.id
      }
    })

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this place' },
        { status: 400 }
      )
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        placeId: validatedData.placeId,
        userId: session.user.id,
        rating: validatedData.rating,
        body: validatedData.body,
        tags: validatedData.tags
      },
      include: {
        user: {
          select: {
            name: true
          }
        }
      }
    })

    // Update place rating (simple average for now)
    const allReviews = await prisma.review.findMany({
      where: {
        placeId: validatedData.placeId,
        status: 'published'
      },
      select: {
        rating: true
      }
    })

    const averageRating = allReviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / allReviews.length

    await prisma.place.update({
      where: { id: validatedData.placeId },
      data: { rating: Math.round(averageRating * 10) / 10 } // Round to 1 decimal
    })

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    console.error('Error creating review:', error)

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
