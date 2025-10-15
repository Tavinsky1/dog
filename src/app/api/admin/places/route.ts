import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Check if user is admin
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Fetch all places with their city info
    const places = await prisma.place.findMany({
      select: {
        id: true,
        name: true,
        type: true,
        imageUrl: true,
        city: {
          select: {
            name: true,
            country: true,
          },
        },
      },
      orderBy: [
        { city: { name: 'asc' } },
        { name: 'asc' },
      ],
    });

    return NextResponse.json({ places });

  } catch (error) {
    console.error('Failed to fetch places:', error);
    return NextResponse.json(
      { error: 'Failed to fetch places' },
      { status: 500 }
    );
  }
}
