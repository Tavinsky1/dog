import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request, { params }: { params: { city: string } }) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') || undefined
  const q = searchParams.get('q') || undefined
  const minLevel = Number(searchParams.get('minLevel') ?? 0)
  const city = await prisma.city.findFirst({ where: { slug: params.city, active: true } })
  if (!city) return NextResponse.json({ items: [], total: 0 })
  const where: any = { cityId: city.id }
  if (type) where.type = type
  if (q) where.OR = [
    { name: { contains: q, mode: 'insensitive' } },
    { shortDescription: { contains: q, mode: 'insensitive' } },
  ]
  if (!Number.isNaN(minLevel) && minLevel > 0) where.dogFriendlyLevel = { gte: minLevel }
  const [items, total] = await Promise.all([
    prisma.place.findMany({
      where, orderBy: { name: 'asc' }, take: 50,
      select: { id: true, slug: true, name: true, type: true, lat: true, lng: true, shortDescription: true, imageUrl: true, dogFriendlyLevel: true, tags: true, cityId: true }
    }),
    prisma.place.count({ where })
  ])
  return NextResponse.json({ items, total })
}