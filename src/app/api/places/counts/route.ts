import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const city = url.searchParams.get('city') || 'Berlin';

    const rows = await prisma.place.groupBy({
      by: ['category'],
      where: { city, status: 'published' },
      _count: { _all: true }
    });

    const counts: Record<string, number> = {};
    rows.forEach(row => {
      counts[row.category] = row._count._all;
    });

    return NextResponse.json(counts);
  } catch (error) {
    console.error('Error fetching place counts:', error);
    return NextResponse.json({ error: 'Failed to fetch counts' }, { status: 500 });
  }
}
