// scripts/import_photos_with_puppeteer.ts
import 'dotenv/config';
import { PrismaClient, Place } from '@prisma/client';
import puppeteer, { Browser, Page } from 'puppeteer';
import pLimit from 'p-limit';
import sharp from 'sharp';
import fetch from 'node-fetch';

const prisma = new PrismaClient();
const limit = pLimit(2); // Puppeteer is resource-intensive

const MIN_WIDTH = 600;
const MIN_HEIGHT = 400;

type Candidate = {
  url: string;
  source: 'website' | 'instagram' | 'facebook';
  attribution: string;
};

async function probeImage(url: string): Promise<{ ok: boolean; width?: number; height?: number; contentType?: string }> {
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36' },
    });
    if (!response.ok) return { ok: false };
    
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.startsWith('image/')) return { ok: false };

    const buffer = await response.buffer();
    const metadata = await sharp(buffer).metadata();

    if ((metadata.width ?? 0) >= MIN_WIDTH && (metadata.height ?? 0) >= MIN_HEIGHT) {
      return { ok: true, width: metadata.width, height: metadata.height, contentType };
    }
    return { ok: false };
  } catch (e) {
    console.error(`Error probing image ${url}:`, e);
    return { ok: false };
  }
}

async function getImagesFromPage(page: Page, url: string, placeName: string): Promise<Candidate[]> {
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

  // Wait for images to load
  await page.waitForSelector('img', { timeout: 10000 }).catch(() => console.log(`No images found on ${url}`));

  const candidates = await page.evaluate((placeName, origin) => {
    const images = Array.from(document.querySelectorAll('img'));
    return images
      .map(img => ({
        url: img.src,
        width: img.naturalWidth,
        height: img.naturalHeight,
      }))
      .filter(img => img.width > 500 && img.height > 300) // Pre-filter in browser
      .sort((a, b) => (b.width * b.height) - (a.width * a.height))
      .map(img => ({
        url: img.url,
        source: 'website',
        attribution: `© ${placeName} – ${origin}`,
      }));
  }, placeName, new URL(url).origin);

  return candidates as Candidate[];
}

async function processPlace(place: Place, browser: Browser, dryRun = false) {
  if (place.imageUrl) {
    return { skipped: true, reason: 'already-has-image' };
  }

  let page: Page | null = null;
  try {
    if (!place.websiteUrl) {
      return { skipped: true, reason: 'no-website-url' };
    }

    page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36');

    const candidates = await getImagesFromPage(page, place.websiteUrl, place.name);

    if (candidates.length === 0) {
      return { skipped: true, reason: 'no-suitable-images-found' };
    }

    for (const candidate of candidates) {
      const probe = await probeImage(candidate.url);
      if (probe.ok) {
        if (!dryRun) {
          const existingPlace = await prisma.place.findUnique({ where: { id: place.id } });
          const existingGallery = (existingPlace?.gallery as string[]) || [];
          const newGallery = [...new Set([candidate.url, ...existingGallery])];

          await prisma.place.update({
            where: { id: place.id },
            data: { 
              imageUrl: candidate.url,
              gallery: newGallery,
             },
          });
        }
        return { ok: true, url: candidate.url, dryRun };
      }
    }

    return { skipped: true, reason: 'none-validated' };
  } finally {
    if (page) await page.close();
  }
}

async function main() {
  const dryRun = process.argv.includes('--dry');
  const citySlug = process.argv.includes('--city') ? process.argv[process.argv.indexOf('--city') + 1] : null;
  const limitNum = process.argv.includes('--limit') ? parseInt(process.argv[process.argv.indexOf('--limit') + 1], 10) : undefined;

  const browser = await puppeteer.launch({ headless: true });

  const places = await prisma.place.findMany({
    where: citySlug ? { city: { slug: citySlug } } : {},
    take: limitNum,
    orderBy: { name: 'asc' },
  });

  console.log(`Found ${places.length} places. Starting Puppeteer import...`);

  const promises = places.map(place => limit(async () => {
    try {
      const result = await processPlace(place, browser, dryRun);
      if (result.ok) {
        console.log(`✅ [${citySlug || 'all'}] ${place.name} -> ${result.url}`);
      } else {
        console.log(`⏭️ [${citySlug || 'all'}] ${place.name} - Skipped: ${result.reason}`);
      }
    } catch (e) {
      console.error(`❌ Error processing ${place.name}:`, e);
    }
  }));

  await Promise.all(promises);

  await browser.close();
  await prisma.$disconnect();
  console.log('Import complete.');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
