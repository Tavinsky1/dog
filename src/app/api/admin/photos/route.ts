/**
 * API Route: GET /api/admin/photos
 * 
 * Lists photos with filtering for admin review
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await getServerSession();
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'PENDING';
    const city = searchParams.get('city');
    const country = searchParams.get('country');
    const license = searchParams.get('license');

    const where: any = {
      status: status as any
    };

    if (city || country || license) {
      where.place = {};
      if (city) {
        where.place.city = { name: { contains: city, mode: 'insensitive' } };
      }
      if (country) {
        where.place.country = { contains: country, mode: 'insensitive' };
      }
    }

    if (license) {
      where.license = { contains: license, mode: 'insensitive' };
    }

    // @ts-ignore - Will work after Prisma regeneration
    const photos = await prisma.placePhoto.findMany({
      where,
      include: {
        place: {
          include: {
            city: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    return NextResponse.json({ photos });
  } catch (error) {
    console.error('Error fetching photos:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
