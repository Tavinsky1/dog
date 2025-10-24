import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
  try {
    // Ensure user is admin
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'overview';
    const range = searchParams.get('range') || '7d';

    if (type === 'realtime') {
      // Get real-time active sessions
      const now = new Date();
      const activeSessions = await prisma.session.count({
        where: {
          expires: {
            gt: now
          }
        }
      });

      return NextResponse.json({
        activeSessions,
        timestamp: now.toISOString()
      });
    }

    // Calculate date range
    const daysMap: Record<string, number> = {
      '7d': 7,
      '30d': 30,
      '90d': 90
    };
    const days = daysMap[range] || 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get overview statistics
    const [
      totalUsers,
      totalPlaces,
      totalReviews,
      totalFavorites,
      newUsers,
      newReviews,
      topCities
    ] = await Promise.all([
      // Total users
      prisma.user.count(),
      
      // Total places
      prisma.place.count(),
      
      // Total reviews
      prisma.review.count(),
      
      // Total favorites
      prisma.favorite.count(),
      
      // New users in range
      prisma.user.count({
        where: {
          createdAt: {
            gte: startDate
          }
        }
      }),
      
      // New reviews in range
      prisma.review.count({
        where: {
          createdAt: {
            gte: startDate
          }
        }
      }),
      
      // Top cities by place count
      prisma.city.findMany({
        select: {
          name: true,
          slug: true,
          _count: {
            select: {
              places: true
            }
          }
        },
        orderBy: {
          places: {
            _count: 'desc'
          }
        },
        take: 10
      })
    ]);

    return NextResponse.json({
      overview: {
        totalUsers,
        totalPlaces,
        totalReviews,
        totalFavorites,
        newUsers,
        newReviews
      },
      topCities: topCities.map(city => ({
        name: city.name,
        slug: city.slug,
        placeCount: city._count.places
      })),
      range,
      startDate: startDate.toISOString()
    });

  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
