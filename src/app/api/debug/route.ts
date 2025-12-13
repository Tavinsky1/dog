import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Test basic connection
    const result = await prisma.$queryRaw`SELECT 1 as test`
    
    // Try to get cities count
    const cityCount = await prisma.city.count()
    
    return NextResponse.json({
      status: 'ok',
      database: 'connected',
      cityCount,
      rawQuery: result,
      env: {
        hasDbUrl: !!process.env.DATABASE_URL,
        dbUrlPrefix: process.env.DATABASE_URL?.substring(0, 30) + '...',
      }
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    const stack = error instanceof Error ? error.stack : undefined
    
    return NextResponse.json({
      status: 'error',
      error: message,
      stack: stack?.split('\n').slice(0, 5),
      env: {
        hasDbUrl: !!process.env.DATABASE_URL,
        dbUrlPrefix: process.env.DATABASE_URL?.substring(0, 30) + '...',
      }
    }, { status: 500 })
  }
}
