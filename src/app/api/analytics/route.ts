import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'

// Analytics event tracking endpoint
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const headersList = await headers()
    
    const {
      eventType,
      eventData,
      userId,
      sessionId,
      page,
      referrer,
      city,
      category,
      placeId,
      searchQuery
    } = body

    // Get client info from headers
    const userAgent = headersList.get('user-agent') || ''
    const ipAddress = getClientIP(req)
    
    // Parse device and browser info
    const deviceInfo = parseUserAgent(userAgent)
    
    // Create analytics event
    const event = await prisma.analyticsEvent.create({
      data: {
        eventType,
        eventData: eventData || {},
        userId,
        sessionId,
        ipAddress,
        userAgent,
        page,
        referrer,
        city,
        category,
        placeId,
        searchQuery,
        deviceType: deviceInfo.device,
        browser: deviceInfo.browser,
        country: 'DE' // Default to Germany, can be enhanced with IP geolocation
      }
    })

    // Update or create session
    await updateSession(sessionId, userId, page, deviceInfo, ipAddress, userAgent)

    return NextResponse.json({ success: true, eventId: event.id })
  } catch (error) {
    console.error('Analytics tracking error:', error)
    return NextResponse.json({ error: 'Failed to track event' }, { status: 500 })
  }
}

// Get analytics data for admin dashboard
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const range = searchParams.get('range') || '7d' // 1d, 7d, 30d, 90d
    const type = searchParams.get('type') || 'overview'
    
    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    
    switch (range) {
      case '1d':
        startDate.setDate(endDate.getDate() - 1)
        break
      case '7d':
        startDate.setDate(endDate.getDate() - 7)
        break
      case '30d':
        startDate.setDate(endDate.getDate() - 30)
        break
      case '90d':
        startDate.setDate(endDate.getDate() - 90)
        break
    }

    let data = {}

    switch (type) {
      case 'overview':
        data = await getOverviewAnalytics(startDate, endDate)
        break
      case 'pages':
        data = await getPageAnalytics(startDate, endDate)
        break
      case 'places':
        data = await getPlaceAnalytics(startDate, endDate)
        break
      case 'categories':
        data = await getCategoryAnalytics(startDate, endDate)
        break
      case 'users':
        data = await getUserAnalytics(startDate, endDate)
        break
      case 'realtime':
        data = await getRealtimeAnalytics()
        break
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Analytics fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}

// Helper functions
function getClientIP(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')
  const real = req.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (real) {
    return real
  }
  
  return 'unknown'
}

function parseUserAgent(userAgent: string) {
  const device = /Mobile|Android|iPhone|iPad/.test(userAgent) ? 'mobile' : 
                 /Tablet|iPad/.test(userAgent) ? 'tablet' : 'desktop'
  
  let browser = 'unknown'
  if (userAgent.includes('Chrome')) browser = 'Chrome'
  else if (userAgent.includes('Firefox')) browser = 'Firefox'
  else if (userAgent.includes('Safari')) browser = 'Safari'
  else if (userAgent.includes('Edge')) browser = 'Edge'
  
  return { device, browser }
}

async function updateSession(sessionId: string, userId: string | undefined, page: string, deviceInfo: any, ipAddress: string, userAgent: string) {
  const existingSession = await prisma.analyticsSession.findUnique({
    where: { sessionId }
  })

  if (existingSession) {
    await prisma.analyticsSession.update({
      where: { sessionId },
      data: {
        lastSeenAt: new Date(),
        pageViews: { increment: 1 },
        exitPage: page,
        duration: Math.floor((new Date().getTime() - existingSession.startedAt.getTime()) / 1000)
      }
    })
  } else {
    try {
      await prisma.analyticsSession.create({
        data: {
          sessionId,
          userId,
          entryPage: page,
          exitPage: page,
          pageViews: 1,
          deviceType: deviceInfo.device,
          browser: deviceInfo.browser,
          ipAddress,
          userAgent,
          country: 'DE'
        }
      })
    } catch (error: any) {
      // If session already exists (race condition), update it instead
      if (error.code === 'P2002') {
        await prisma.analyticsSession.update({
          where: { sessionId },
          data: {
            lastSeenAt: new Date(),
            pageViews: { increment: 1 },
            exitPage: page
          }
        })
      } else {
        throw error
      }
    }
  }
}

async function getOverviewAnalytics(startDate: Date, endDate: Date) {
  const [
    totalPageViews,
    uniqueVisitors,
    totalSessions,
    averageSessionDuration,
    topPages,
    deviceBreakdown,
    dailyStats
  ] = await Promise.all([
    // Total page views
    prisma.analyticsEvent.count({
      where: {
        eventType: 'page_view',
        createdAt: { gte: startDate, lte: endDate }
      }
    }),
    
    // Unique visitors (unique session IDs)
    prisma.analyticsEvent.findMany({
      where: {
        eventType: 'page_view',
        createdAt: { gte: startDate, lte: endDate }
      },
      select: { sessionId: true },
      distinct: ['sessionId']
    }).then((sessions: { sessionId: string }[]) => sessions.length),
    
    // Total sessions
    prisma.analyticsSession.count({
      where: {
        startedAt: { gte: startDate, lte: endDate }
      }
    }),
    
    // Average session duration
    prisma.analyticsSession.aggregate({
      where: {
        startedAt: { gte: startDate, lte: endDate },
        duration: { not: null }
      },
      _avg: { duration: true }
    }),
    
    // Top pages
    prisma.analyticsEvent.groupBy({
      by: ['page'],
      where: {
        eventType: 'page_view',
        createdAt: { gte: startDate, lte: endDate }
      },
      _count: true,
      orderBy: { _count: { page: 'desc' } },
      take: 10
    }),
    
    // Device breakdown
    prisma.analyticsEvent.groupBy({
      by: ['deviceType'],
      where: {
        eventType: 'page_view',
        createdAt: { gte: startDate, lte: endDate }
      },
      _count: true
    }),
    
    // Daily stats for chart
    prisma.$queryRaw`
      SELECT DATE(created_at) as date, COUNT(*) as views
      FROM "AnalyticsEvent"
      WHERE event_type = 'page_view'
        AND created_at >= ${startDate}
        AND created_at <= ${endDate}
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `
  ])

  return {
    totalPageViews,
    uniqueVisitors,
    totalSessions,
    averageSessionDuration: Math.round(averageSessionDuration._avg.duration || 0),
    topPages: topPages.map((p: any) => ({ page: p.page, views: p._count })),
    deviceBreakdown: deviceBreakdown.map((d: any) => ({ 
      device: d.deviceType || 'unknown', 
      count: d._count 
    })),
    dailyStats
  }
}

async function getPageAnalytics(startDate: Date, endDate: Date) {
  const pageStats = await prisma.analyticsEvent.groupBy({
    by: ['page'],
    where: {
      eventType: 'page_view',
      createdAt: { gte: startDate, lte: endDate }
    },
    _count: true,
    orderBy: { _count: { page: 'desc' } }
  })

  return pageStats.map((p: any) => ({ page: p.page, views: p._count }))
}

async function getPlaceAnalytics(startDate: Date, endDate: Date) {
  const placeViews = await prisma.analyticsEvent.groupBy({
    by: ['placeId'],
    where: {
      eventType: 'place_view',
      placeId: { not: null },
      createdAt: { gte: startDate, lte: endDate }
    },
    _count: true,
    orderBy: { _count: { placeId: 'desc' } },
    take: 20
  })

  // Get place details
  const placeIds = placeViews.map((p: any) => p.placeId).filter(Boolean)
  const places = await prisma.place.findMany({
    where: { id: { in: placeIds as string[] } },
    select: { id: true, name: true, category: true }
  })

  return placeViews.map((p: any) => {
    const place = places.find((pl: any) => pl.id === p.placeId)
    return {
      placeId: p.placeId,
      name: place?.name || 'Unknown Place',
      category: place?.category || 'unknown',
      views: p._count
    }
  })
}

async function getCategoryAnalytics(startDate: Date, endDate: Date) {
  const categoryStats = await prisma.analyticsEvent.groupBy({
    by: ['category'],
    where: {
      eventType: { in: ['category_view', 'category_click'] },
      category: { not: null },
      createdAt: { gte: startDate, lte: endDate }
    },
    _count: true,
    orderBy: { _count: { category: 'desc' } }
  })

  return categoryStats.map((c: any) => ({ 
    category: c.category, 
    interactions: c._count 
  }))
}

async function getUserAnalytics(startDate: Date, endDate: Date) {
  const [
    totalUsers,
    newUsers,
    returningUsers
  ] = await Promise.all([
    prisma.user.count(),
    
    prisma.user.count({
      where: {
        createdAt: { gte: startDate, lte: endDate }
      }
    }),
    
    prisma.analyticsEvent.findMany({
      where: {
        userId: { not: null },
        createdAt: { gte: startDate, lte: endDate }
      },
      select: { userId: true },
      distinct: ['userId']
    }).then((users: { userId: string | null }[]) => users.length)
  ])

  return {
    totalUsers,
    newUsers,
    returningUsers
  }
}

async function getRealtimeAnalytics() {
  const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000)
  
  const [
    activeVisitors,
    recentPageViews,
    topPagesNow
  ] = await Promise.all([
    // Active visitors in last 5 minutes
    prisma.analyticsSession.count({
      where: {
        lastSeenAt: { gte: new Date(Date.now() - 5 * 60 * 1000) }
      }
    }),
    
    // Page views in last hour
    prisma.analyticsEvent.count({
      where: {
        eventType: 'page_view',
        createdAt: { gte: new Date(Date.now() - 60 * 60 * 1000) }
      }
    }),
    
    // Top pages in last 24 hours
    prisma.analyticsEvent.groupBy({
      by: ['page'],
      where: {
        eventType: 'page_view',
        createdAt: { gte: last24Hours }
      },
      _count: true,
      orderBy: { _count: { page: 'desc' } },
      take: 5
    })
  ])

  return {
    activeVisitors,
    recentPageViews,
    topPagesNow: topPagesNow.map((p: any) => ({ page: p.page, views: p._count }))
  }
}
