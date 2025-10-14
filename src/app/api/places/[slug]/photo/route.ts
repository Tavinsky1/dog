/**
 * API Route: GET /api/places/[slug]/photo
 * 
 * Returns the primary photo for a place
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const place = await prisma.place.findFirst({
      where: { slug },
      include: {
        // @ts-ignore - Will work after Prisma regeneration
        primaryPhoto: true
      }
    });

    if (!place) {
      return NextResponse.json({ error: 'Place not found' }, { status: 404 });
    }

    // @ts-ignore - Will work after Prisma regeneration
    const photo = place.primaryPhoto;

    if (!photo) {
      return NextResponse.json({ photo: null });
    }

    return NextResponse.json({
      photo: {
        cdnUrl: photo.cdnUrl,
        width: photo.width,
        height: photo.height,
        author: photo.author,
        license: photo.license,
        sourceUrl: photo.sourceUrl
      }
    });
  } catch (error) {
    console.error('Error fetching place photo:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
