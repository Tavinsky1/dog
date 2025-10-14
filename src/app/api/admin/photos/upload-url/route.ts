/**
 * API Route: POST /api/admin/photos/upload-url
 * 
 * Manually upload a photo from URL
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { downloadImage, validateImage, isLicenseAllowed, normalizeLicense } from '@/lib/photo-enrichment/image-utils';
import { createCloudflareClient } from '@/lib/photo-enrichment/cloudflare-images';
import { writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await getServerSession();
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { placeId, imageUrl, author, license, sourceUrl } = body;

    if (!placeId || !imageUrl || !author || !license) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate license
    if (!isLicenseAllowed(license)) {
      return NextResponse.json({ error: `License not allowed: ${license}` }, { status: 400 });
    }

    // Download image to temp
    const tempPath = join(process.cwd(), 'temp', `upload_${Date.now()}.jpg`);
    await downloadImage(imageUrl, tempPath);

    // Validate dimensions
    const validation = await validateImage(tempPath);
    if (!validation.valid) {
      unlinkSync(tempPath);
      return NextResponse.json({ error: validation.reason }, { status: 400 });
    }

    // Upload to Cloudflare
    const cloudflare = createCloudflareClient();
    const upload = await cloudflare.uploadImage(tempPath, {
      placeId,
      source: 'manual'
    });

    // Create PlacePhoto record
    // @ts-ignore - Will work after Prisma regeneration
    const photo = await prisma.placePhoto.create({
      data: {
        placeId,
        cdnUrl: upload.cdnUrl,
        width: validation.metadata!.width,
        height: validation.metadata!.height,
        format: validation.metadata!.format,
        author,
        license: normalizeLicense(license),
        sourceUrl,
        source: 'manual',
        status: 'PENDING' as any
      }
    });

    // Clean up
    unlinkSync(tempPath);

    return NextResponse.json({ success: true, photoId: photo.id });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    );
  }
}
