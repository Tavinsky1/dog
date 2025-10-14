import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { createCloudflareClient } from '@/lib/photo-enrichment/cloudflare-images';
import { probeImage, validateImage, isLicenseAllowed } from '@/lib/photo-enrichment/image-utils';

const prisma = new PrismaClient();

/**
 * POST /api/admin/photos/upload-file
 * Upload a photo file directly for a place
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const placeId = formData.get('placeId') as string;
    const author = formData.get('author') as string;
    const license = formData.get('license') as string;
    const sourceUrl = formData.get('sourceUrl') as string;

    // Validate required fields
    if (!file || !placeId || !author || !license) {
      return NextResponse.json(
        { error: 'Missing required fields: file, placeId, author, license' },
        { status: 400 }
      );
    }

    // Validate license
    if (!isLicenseAllowed(license)) {
      return NextResponse.json(
        { error: `License "${license}" is not allowed. Must be CC0, CC-BY, CC-BY-SA, or Public Domain` },
        { status: 400 }
      );
    }

    // Verify place exists
    const place = await prisma.place.findUnique({
      where: { id: placeId },
    });

    if (!place) {
      return NextResponse.json(
        { error: 'Place not found' },
        { status: 404 }
      );
    }

    // Save file temporarily
    const tempDir = join(process.cwd(), 'temp', 'photo-upload');
    if (!existsSync(tempDir)) {
      await mkdir(tempDir, { recursive: true });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const tempPath = join(tempDir, `${Date.now()}-${file.name}`);
    await writeFile(tempPath, buffer);

    try {
      // Probe image dimensions
      const imageInfo = await probeImage(tempPath);
      if (!imageInfo) {
        return NextResponse.json(
          { error: 'Failed to read image dimensions' },
          { status: 400 }
        );
      }

      // Validate dimensions
      const validation = validateImage(imageInfo);
      if (!validation.valid) {
        return NextResponse.json(
          { error: validation.error },
          { status: 400 }
        );
      }

      // Upload to Cloudflare Images
      const cloudflare = createCloudflareClient();
      const uploadResult = await cloudflare.uploadImage(tempPath, {
        requireSignedURLs: false,
        metadata: {
          placeId,
          source: 'manual_upload',
          author,
          license,
        },
      });

      if (!uploadResult.success) {
        return NextResponse.json(
          { error: 'Failed to upload to Cloudflare Images' },
          { status: 500 }
        );
      }

      // Get CDN URL
      const cdnBaseUrl = process.env.CLOUDFLARE_DELIVERY_URL;
      if (!cdnBaseUrl) {
        return NextResponse.json(
          { error: 'CLOUDFLARE_DELIVERY_URL not configured' },
          { status: 500 }
        );
      }

      const cdnUrl = `${cdnBaseUrl}/${uploadResult.result.id}`;

      // Create PlacePhoto record
      const photo = await prisma.placePhoto.create({
        data: {
          placeId,
          cdnUrl,
          width: imageInfo.width,
          height: imageInfo.height,
          format: imageInfo.format,
          author,
          license,
          sourceUrl: sourceUrl || null,
          source: 'manual_upload',
          status: 'PENDING',
        },
      });

      // If this is the first photo, set as primary
      if (!place.primaryPhotoId) {
        await prisma.place.update({
          where: { id: placeId },
          data: { primaryPhotoId: photo.id },
        });
      }

      return NextResponse.json({
        success: true,
        photo: {
          id: photo.id,
          cdnUrl: photo.cdnUrl,
          width: photo.width,
          height: photo.height,
          format: photo.format,
          status: photo.status,
        },
      });
    } finally {
      // Clean up temp file
      const fs = await import('fs/promises');
      try {
        await fs.unlink(tempPath);
      } catch (err) {
        console.error('Failed to delete temp file:', err);
      }
    }
  } catch (error) {
    console.error('Photo upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload photo', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
