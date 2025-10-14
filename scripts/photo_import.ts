#!/usr/bin/env ts-node
/**
 * Photo Import Script
 * 
 * Downloads, validates, uploads to Cloudflare Images, and creates PlacePhoto records
 * from OSM, Wikidata, and Openverse candidates.
 * 
 * Usage:
 *   npm run photo-import -- --wikimedia wikimedia_candidates.csv --openverse openverse_candidates.csv
 * 
 * Environment variables required:
 *   DATABASE_URL - PostgreSQL connection string
 *   CLOUDFLARE_ACCOUNT_ID - Cloudflare account ID
 *   CLOUDFLARE_API_TOKEN - Cloudflare API token
 *   CLOUDFLARE_DELIVERY_URL - Cloudflare delivery URL (optional)
 */

import { readFileSync, existsSync, mkdirSync, unlinkSync } from 'fs';
import { join } from 'path';
import { parse } from 'csv-parse/sync';
import { PrismaClient } from '@prisma/client';
import {
  downloadImage,
  validateImage,
  isLicenseAllowed,
  normalizeLicense
} from '../lib/photo-enrichment/image-utils';
import { createCloudflareClient } from '../lib/photo-enrichment/cloudflare-images';

const prisma = new PrismaClient();

// Photo status enum (matches Prisma schema)
enum PhotoStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

interface WikimediaCandidate {
  slug: string;
  commons_file: string;
  author: string;
  license: string;
  source_url: string;
}

interface OpenverseCandidate {
  slug: string;
  openverse_id: string;
  title: string;
  url: string;
  thumbnail_url: string;
  author: string;
  license: string;
  source_url: string;
  score: number;
}

interface ImportResult {
  slug: string;
  success: boolean;
  photoId?: string;
  error?: string;
}

/**
 * Build Wikimedia Commons direct download URL
 */
function buildCommonsDownloadUrl(filename: string, width = 2000): string {
  const cleanName = filename.replace(/^File:/, '').replace(/ /g, '_');
  const md5 = require('crypto').createHash('md5').update(cleanName).digest('hex');
  const a = md5[0];
  const b = md5.substring(0, 2);
  
  return `https://upload.wikimedia.org/wikipedia/commons/thumb/${a}/${b}/${encodeURIComponent(cleanName)}/${width}px-${encodeURIComponent(cleanName)}`;
}

/**
 * Import a photo from Wikimedia Commons
 */
async function importWikimediaPhoto(
  candidate: WikimediaCandidate,
  tempDir: string
): Promise<ImportResult> {
  try {
    // Find place by slug
    const place = await prisma.place.findFirst({
      where: { slug: candidate.slug }
    });

    if (!place) {
      return {
        slug: candidate.slug,
        success: false,
        error: 'Place not found'
      };
    }

    // Validate license
    if (!isLicenseAllowed(candidate.license)) {
      return {
        slug: candidate.slug,
        success: false,
        error: `License not allowed: ${candidate.license}`
      };
    }

    // Download image
    const tempPath = join(tempDir, `${candidate.slug}_commons.jpg`);
    const downloadUrl = buildCommonsDownloadUrl(candidate.commons_file);
    
    console.log(`Downloading: ${downloadUrl}`);
    await downloadImage(downloadUrl, tempPath);

    // Validate image
    const validation = await validateImage(tempPath);
    if (!validation.valid) {
      unlinkSync(tempPath);
      return {
        slug: candidate.slug,
        success: false,
        error: validation.reason
      };
    }

    // Upload to Cloudflare
    const cloudflare = createCloudflareClient();
    const upload = await cloudflare.uploadImage(tempPath, {
      slug: candidate.slug,
      source: 'wikimedia-commons'
    });

    // Create PlacePhoto record
    const photo = await prisma.placePhoto.create({
      data: {
        placeId: place.id,
        cdnUrl: upload.cdnUrl,
        width: validation.metadata!.width,
        height: validation.metadata!.height,
        format: validation.metadata!.format,
        author: candidate.author,
        license: normalizeLicense(candidate.license),
        sourceUrl: candidate.source_url,
        source: 'wikidata',
        status: PhotoStatus.PENDING
      }
    });

    // Clean up temp file
    unlinkSync(tempPath);

    console.log(`✓ Imported photo for ${candidate.slug} (ID: ${photo.id})`);

    return {
      slug: candidate.slug,
      success: true,
      photoId: photo.id
    };
  } catch (error) {
    return {
      slug: candidate.slug,
      success: false,
      error: String(error)
    };
  }
}

/**
 * Import a photo from Openverse
 */
async function importOpenversePhoto(
  candidate: OpenverseCandidate,
  tempDir: string
): Promise<ImportResult> {
  try {
    // Find place by slug
    const place = await prisma.place.findFirst({
      where: { slug: candidate.slug }
    });

    if (!place) {
      return {
        slug: candidate.slug,
        success: false,
        error: 'Place not found'
      };
    }

    // Validate license
    if (!isLicenseAllowed(candidate.license)) {
      return {
        slug: candidate.slug,
        success: false,
        error: `License not allowed: ${candidate.license}`
      };
    }

    // Download image
    const tempPath = join(tempDir, `${candidate.slug}_openverse.jpg`);
    
    console.log(`Downloading: ${candidate.url}`);
    await downloadImage(candidate.url, tempPath);

    // Validate image
    const validation = await validateImage(tempPath);
    if (!validation.valid) {
      unlinkSync(tempPath);
      return {
        slug: candidate.slug,
        success: false,
        error: validation.reason
      };
    }

    // Upload to Cloudflare
    const cloudflare = createCloudflareClient();
    const upload = await cloudflare.uploadImage(tempPath, {
      slug: candidate.slug,
      source: 'openverse',
      openverse_id: candidate.openverse_id
    });

    // Create PlacePhoto record
    const photo = await prisma.placePhoto.create({
      data: {
        placeId: place.id,
        cdnUrl: upload.cdnUrl,
        width: validation.metadata!.width,
        height: validation.metadata!.height,
        format: validation.metadata!.format,
        author: candidate.author,
        license: normalizeLicense(candidate.license),
        sourceUrl: candidate.source_url,
        source: 'openverse',
        status: PhotoStatus.PENDING
      }
    });

    // Clean up temp file
    unlinkSync(tempPath);

    console.log(`✓ Imported photo for ${candidate.slug} (ID: ${photo.id})`);

    return {
      slug: candidate.slug,
      success: true,
      photoId: photo.id
    };
  } catch (error) {
    return {
      slug: candidate.slug,
      success: false,
      error: String(error)
    };
  }
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  const wikimediaPath = args[args.indexOf('--wikimedia') + 1];
  const openversePath = args[args.indexOf('--openverse') + 1];
  const dryRun = args.includes('--dry-run');

  if (!wikimediaPath && !openversePath) {
    console.error('Usage: npm run photo-import -- [--wikimedia <csv>] [--openverse <csv>] [--dry-run]');
    console.error('\nAt least one of --wikimedia or --openverse must be provided');
    process.exit(1);
  }

  // Create temp directory
  const tempDir = join(process.cwd(), 'temp', 'photo-import');
  if (!existsSync(tempDir)) {
    mkdirSync(tempDir, { recursive: true });
  }

  const results: ImportResult[] = [];

  // Process Wikimedia candidates
  if (wikimediaPath && existsSync(wikimediaPath)) {
    console.log('\n=== Processing Wikimedia Commons candidates ===');
    const csv = readFileSync(wikimediaPath, 'utf-8');
    const candidates: WikimediaCandidate[] = parse(csv, {
      columns: true,
      skip_empty_lines: true
    });

    console.log(`Found ${candidates.length} Wikimedia candidates`);

    if (dryRun) {
      console.log('DRY RUN - No changes will be made');
    }

    for (const candidate of candidates) {
      if (dryRun) {
        console.log(`[DRY RUN] Would import: ${candidate.slug} from ${candidate.commons_file}`);
        continue;
      }

      const result = await importWikimediaPhoto(candidate, tempDir);
      results.push(result);

      if (!result.success) {
        console.error(`✗ Failed to import ${result.slug}: ${result.error}`);
      }

      // Rate limit to avoid overwhelming services
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  // Process Openverse candidates
  if (openversePath && existsSync(openversePath)) {
    console.log('\n=== Processing Openverse candidates ===');
    const csv = readFileSync(openversePath, 'utf-8');
    const candidates: OpenverseCandidate[] = parse(csv, {
      columns: true,
      skip_empty_lines: true,
      cast: (value, context) => {
        if (context.column === 'score') {
          return parseFloat(value);
        }
        return value;
      }
    });

    console.log(`Found ${candidates.length} Openverse candidates`);

    if (dryRun) {
      console.log('DRY RUN - No changes will be made');
    }

    for (const candidate of candidates) {
      if (dryRun) {
        console.log(`[DRY RUN] Would import: ${candidate.slug} from ${candidate.url}`);
        continue;
      }

      const result = await importOpenversePhoto(candidate, tempDir);
      results.push(result);

      if (!result.success) {
        console.error(`✗ Failed to import ${result.slug}: ${result.error}`);
      }

      // Rate limit
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  // Summary
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log('\n=== Import Summary ===');
  console.log(`Total processed: ${results.length}`);
  console.log(`Successful: ${successful}`);
  console.log(`Failed: ${failed}`);

  if (failed > 0) {
    console.log('\nFailed imports:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.slug}: ${r.error}`);
    });
  }

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error('Error:', error);
  prisma.$disconnect();
  process.exit(1);
});
