import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_req: Request, { params }: { params: { city: string, slug: string } }) {
  const item = await prisma.place.findFirst({ where: { slug: params.slug }, include: { city: true } })
  if (!item) return new NextResponse('Not found', { status: 404 })
  return NextResponse.json(item)
}