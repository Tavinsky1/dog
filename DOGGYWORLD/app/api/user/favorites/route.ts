import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth(); if (!session?.user?.email) return new NextResponse('Unauthorized', { status: 401 })
  const me = await prisma.user.findUnique({ where: { email: session.user.email! } })
  const favs = await prisma.favorite.findMany({ where: { userId: me!.id }, include: { place: true } })
  return NextResponse.json(favs)
}

export async function POST(req: Request) {
  const session = await auth(); if (!session?.user?.email) return new NextResponse('Unauthorized', { status: 401 })
  const me = await prisma.user.findUnique({ where: { email: session.user.email! } })
  const { placeId } = await req.json()
  const existing = await prisma.favorite.findFirst({ where: { userId: me!.id, placeId } })
  if (existing) { await prisma.favorite.delete({ where: { id: existing.id } }); return NextResponse.json({ ok: true, removed: true }) }
  await prisma.favorite.create({ data: { userId: me!.id, placeId } })
  return NextResponse.json({ ok: true })
}