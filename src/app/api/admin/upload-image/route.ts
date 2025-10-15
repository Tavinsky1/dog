import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: Request) {
  try {
    // Check if user is admin
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin (you can customize this check)
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const formData = await request.formData();
    const placeId = formData.get('placeId') as string;
    const file = formData.get('file') as File;

    if (!placeId || !file) {
      return NextResponse.json({ error: 'Missing placeId or file' }, { status: 400 });
    }

    // Verify place exists
    const place = await prisma.place.findUnique({
      where: { id: placeId },
    });

    if (!place) {
      return NextResponse.json({ error: 'Place not found' }, { status: 404 });
    }

    // Create directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'images', 'places');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generate filename: placeId-placeName-timestamp.extension
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const sanitizedName = place.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 50);
    const filename = `${placeId}-${sanitizedName}-${timestamp}.${extension}`;
    const filepath = join(uploadDir, filename);

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Update database with new image URL
    const imageUrl = `/images/places/${filename}`;
    
    await prisma.place.update({
      where: { id: placeId },
      data: { imageUrl },
    });

    return NextResponse.json({
      success: true,
      imageUrl,
      message: 'Image uploaded successfully',
    });

  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}
