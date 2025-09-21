import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const cities = await prisma.city.findMany({
    where: { active: true },
    orderBy: { name: 'asc' },
    select: {
      id: true,
      slug: true,
      name: true,
      country: true,
      bbox: true,
      _count: {
        select: { places: true },
      },
    },
  });
  return NextResponse.json(cities);
}