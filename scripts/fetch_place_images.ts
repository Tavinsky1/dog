#!/usr/bin/env npx tsx

/**
 * Fetch real images for places from their websites
 * Usage: npx tsx scripts/fetch_place_images.ts [--limit 10] [--download]
 */

import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import * as cheerio from 'cheerio';
import pLimit from 'p-limit';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const argv = {
  limit: parseInt(process.argv.find(a => a.startsWith('--limit='))?.split('=')[1] || '0'),
  download: process.argv.includes('--download'),
  downloadDir: 'public/images/places',
  concurrency: 3,
  timeoutMs: 10000,
};

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function fetchHTML(url: string): Promise<string | null> {
  try {
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml',
    };
    const res = await axios.get(url, { 
      headers, 
      timeout: argv.timeoutMs, 
      maxRedirects: 3,
      validateStatus: s => s >= 200 && s < 400 
    });
    return res.data;
  } catch (error: any) {
    console.error(`Failed to fetch ${url}:`, error?.message || error);
    return null;
  }
}

function extractImageFromHTML(html: string, baseUrl: string): string | null {
  const $ = cheerio.load(html);
  
  // Priority order for image selection
  const candidates = [
    $('meta[property="og:image"]').attr('content'),
    $('meta[name="og:image"]').attr('content'),
    $('meta[name="twitter:image"]').attr('content'),
    $('meta[property="twitter:image"]').attr('content'),
    $('link[rel="image_src"]').attr('href'),
  ].filter(Boolean) as string[];
  
  const imageUrl = candidates[0];
  if (!imageUrl) return null;
  
  // Make URL absolute
  try {
    return new URL(imageUrl, baseUrl).toString();
  } catch {
    return imageUrl;
  }
}

async function downloadImage(url: string, filename: string): Promise<string | null> {
  try {
    const dir = path.join(process.cwd(), argv.downloadDir);
    await fs.promises.mkdir(dir, { recursive: true });
    
    const ext = path.extname(new URL(url).pathname) || '.jpg';
    const safeName = filename.replace(/[^a-z0-9\-_.]/gi, '_');
    const filePath = path.join(dir, `${safeName}${ext.split('?')[0]}`);
    
    const res = await axios.get(url, { 
      responseType: 'arraybuffer', 
      timeout: argv.timeoutMs,
      maxRedirects: 3 
    });
    
    await fs.promises.writeFile(filePath, res.data);
    
    // Return web path
    return filePath.replace(/^public[\/\\]?/, '/');
  } catch (error: any) {
    console.error(`Failed to download image:`, error?.message || error);
    return null;
  }
}

async function fetchImageForPlace(place: { id: string; name: string; slug: string; websiteUrl: string | null }): Promise<string | null> {
  if (!place.websiteUrl) {
    console.log(`  ⚠️  No website for ${place.name}`);
    return null;
  }
  
  console.log(`  🔍 Fetching ${place.name}...`);
  
  const html = await fetchHTML(place.websiteUrl);
  if (!html) return null;
  
  const imageUrl = extractImageFromHTML(html, place.websiteUrl);
  if (!imageUrl) {
    console.log(`  ⚠️  No OG image found for ${place.name}`);
    return null;
  }
  
  if (argv.download) {
    const localPath = await downloadImage(imageUrl, place.slug);
    if (localPath) {
      console.log(`  ✅ Downloaded: ${localPath}`);
      return localPath;
    }
  }
  
  console.log(`  ✅ Found image: ${imageUrl.substring(0, 60)}...`);
  return imageUrl;
}

async function main() {
  console.log('🐕 Fetching images for places...\n');
  
  // Get places without images that have websites
  const places = await prisma.place.findMany({
    where: {
      OR: [
        { imageUrl: null },
        { imageUrl: '' }
      ],
      websiteUrl: { not: null }
    },
    select: {
      id: true,
      name: true,
      slug: true,
      websiteUrl: true,
    },
    take: argv.limit || undefined,
  });
  
  console.log(`Found ${places.length} places to process\n`);
  
  if (places.length === 0) {
    console.log('No places need images!');
    return;
  }
  
  const limit = pLimit(argv.concurrency);
  let processed = 0;
  let updated = 0;
  let failed = 0;
  
  const jobs = places.map((place, index) => limit(async () => {
    try {
      const imageUrl = await fetchImageForPlace(place);
      
      if (imageUrl) {
        await prisma.place.update({
          where: { id: place.id },
          data: { 
            imageUrl,
            updatedAt: new Date()
          }
        });
        updated++;
      } else {
        failed++;
      }
      
      processed++;
      console.log(`\n[${processed}/${places.length}] Processed\n`);
      
      // Be polite to servers
      await sleep(500);
    } catch (error: any) {
      console.error(`Error processing ${place.name}:`, error?.message || error);
      failed++;
      processed++;
    }
  }));
  
  await Promise.all(jobs);
  
  console.log('\n✅ Done!');
  console.log(`📊 Summary:`);
  console.log(`   Total processed: ${processed}`);
  console.log(`   Successfully updated: ${updated}`);
  console.log(`   Failed: ${failed}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
