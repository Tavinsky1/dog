/**
 * API Route: POST /api/admin/photos/[id]/review
 * 
 * Approves or rejects a photo
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication and admin role
    const session = await getServerSession();
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { approved, notes } = body;

    const status = approved ? 'APPROVED' : 'REJECTED';
    const userId = (session.user as any).id;

    // @ts-ignore - Will work after Prisma regeneration
    const photo = await prisma.placePhoto.update({
      where: { id },
      data: {
        status: status as any,
        notes,
        reviewedBy: userId,
        reviewedAt: new Date()
      },
      include: {
        place: true
      }
    });

    // Note: primaryPhotoId field removed from schema
    // If needed in future, add it back to Place model in schema.prisma

    return NextResponse.json({ success: true, photo });
  } catch (error) {
    console.error('Error reviewing photo:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
