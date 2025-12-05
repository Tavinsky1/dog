
import { PrismaClient } from '@prisma/client';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Browser, Page } from 'puppeteer';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';

puppeteer.use(StealthPlugin());

const prisma = new PrismaClient();

const CONFIG = {
  imageDir: path.join(process.cwd(), 'public', 'images', 'cities'),
  minWidth: 800,
  minHeight: 600,
  maxFileSize: 10 * 1024 * 1024,
  timeout: 30000,
  userAgents: [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  ],
};

if (!fs.existsSync(CONFIG.imageDir)) {
  fs.mkdirSync(CONFIG.imageDir, { recursive: true });
}

function getRandomUserAgent(): string {
  return CONFIG.userAgents[Math.floor(Math.random() * CONFIG.userAgents.length)];
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function validateImageUrl(url: string): Promise<boolean> {
  try {
    const response = await axios.head(url, {
      timeout: 5000,
      headers: { 'User-Agent': getRandomUserAgent() },
    });
    const contentType = response.headers['content-type'] || '';
    return contentType.startsWith('image/');
  } catch (error) {
    return false;
  }
}

async function searchBing(page: Page, query: string): Promise<string | null> {
  try {
    console.log(`  → Searching Bing for: ${query}`);
    await page.goto(`https://www.bing.com/images/search?q=${encodeURIComponent(query)}&first=1`, {
      waitUntil: 'domcontentloaded',
      timeout: CONFIG.timeout,
    });
    await delay(2000);

    const imageUrl = await page.evaluate(() => {
      const selectors = ['img.mimg', 'a.iusc img', '.imgpt img', '.iuscp img'];
      for (const selector of selectors) {
        const imgs = document.querySelectorAll(selector) as NodeListOf<HTMLImageElement>;
        for (const img of imgs) {
          const src = img.src || img.dataset.src;
          if (src && !src.startsWith('data:') && !src.includes('placeholder')) return src;
        }
      }
      return null;
    });

    if (imageUrl && await validateImageUrl(imageUrl)) return imageUrl;
    return null;
  } catch (error) {
    console.log(`  ❌ Bing search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return null;
  }
}

async function downloadAndSaveImage(imageUrl: string, citySlug: string): Promise<string | null> {
  try {
    console.log(`  → Downloading image...`);
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      timeout: CONFIG.timeout,
      headers: { 'User-Agent': getRandomUserAgent() },
    });

    const imageBuffer = Buffer.from(response.data);
    const filename = `${citySlug}.jpg`;
    const filepath = path.join(CONFIG.imageDir, filename);

    await sharp(imageBuffer)
      .resize(1200, 800, { fit: 'cover' })
      .jpeg({ quality: 85, progressive: true })
      .toFile(filepath);

    console.log(`  ✅ Image saved: ${filename}`);
    return `/images/cities/${filename}`;
  } catch (error) {
    console.log(`  ❌ Failed to save image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return null;
  }
}

async function main() {
  console.log('🚀 City Image Scraper - Starting...\n');
  
  // We need to update the hardcoded list in src/app/page.tsx
  // But first let's get the images locally.
  
  const cities: string[] = [];

  // Handle Cordoba separately to ensure Argentina
  const specialCities = [
    { slug: 'cordoba', query: 'cordoba city center argentina landmark beautiful' }
  ];

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setUserAgent(getRandomUserAgent());
  await page.setViewport({ width: 1920, height: 1080 });

  const results: Record<string, string> = {};

  // Process standard cities
  for (const city of cities) {
    console.log(`\nProcessing ${city}...`);
    const query = `${city} city landmark beautiful`;
    const imageUrl = await searchBing(page, query);
    
    if (imageUrl) {
      const localPath = await downloadAndSaveImage(imageUrl, city);
      if (localPath) {
        results[city] = localPath;
      }
    }
    await delay(2000);
  }

  // Process special cities
  for (const item of specialCities) {
    console.log(`\nProcessing ${item.slug} (Special: ${item.query})...`);
    const imageUrl = await searchBing(page, item.query);
    
    if (imageUrl) {
      const localPath = await downloadAndSaveImage(imageUrl, item.slug);
      if (localPath) {
        results[item.slug] = localPath;
      }
    }
    await delay(2000);
  }

  await browser.close();
  
  console.log('\n✅ Scraping complete.');
  console.log('Generated map for src/app/page.tsx:');
  console.log(JSON.stringify(results, null, 2));
}

main().catch(console.error);
