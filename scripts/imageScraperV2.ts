/**
 * IMAGE SCRAPER V2 - Advanced Multi-Strategy Image Collection
 * 
 * TARGET DATABASE: Local SQLite (prisma/dev.db)
 * SYNC REQUIRED: YES - After running this script, you MUST sync to production!
 * 
 * PURPOSE:
 *   Scrapes real place images using 5 fallback strategies:
 *   1. Direct website scraping
 *   2. DuckDuckGo image search
 *   3. Bing image search
 *   4. Google image search
 *   5. Keep existing image
 *   
 *   Collects up to 5 images per place for gallery feature.
 * 
 * USAGE:
 *   npx tsx scripts/imageScraperV2.ts [city]     # Scrape specific city
 *   npx tsx scripts/imageScraperV2.ts            # Scrape all places
 * 
 * AFTER SCRAPING:
 *   1. Verify local images: ls -lh public/images/places/
 *   2. Sync to production: PROD_DATABASE_URL="..." npx tsx scripts/sync_images_raw.ts
 *   3. Verify production: PROD_DATABASE_URL="..." npx tsx scripts/check_prod_db.ts
 *   4. Redeploy: git push (Vercel will pick up new images)
 * 
 * IMPORTANT:
 *   This script only updates LOCAL SQLite database!
 *   Images are saved to public/images/places/ and committed to git.
 *   Database records MUST be synced separately to production PostgreSQL.
 * 
 * See DATABASE_ARCHITECTURE.md for complete workflow.
 */

import { PrismaClient } from '@prisma/client';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Browser, Page } from 'puppeteer';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';

// Add stealth plugin to bypass anti-bot measures
puppeteer.use(StealthPlugin());

const prisma = new PrismaClient();

// Configuration
const CONFIG = {
  imageDir: path.join(process.cwd(), 'public', 'images', 'places'),
  minWidth: 100,  // VERY LOW - accept any image as long as it's correct
  minHeight: 100, // VERY LOW - correct image > perfect size
  maxFileSize: 10 * 1024 * 1024, // 10MB
  timeout: 45000, // Increased to 45 seconds for slower sites
  batchSize: 5,
  maxGalleryImages: 5, // Collect up to 5 images per place for gallery
  userAgents: [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  ],
};

// Ensure image directory exists
if (!fs.existsSync(CONFIG.imageDir)) {
  fs.mkdirSync(CONFIG.imageDir, { recursive: true });
}

interface ScrapingStats {
  total: number;
  success: number;
  failed: number;
  skipped: number;
  strategies: {
    directWebsite: number;
    duckduckgo: number;
    bing: number;
    google: number;
    existingImage: number;
  };
}

const stats: ScrapingStats = {
  total: 0,
  success: 0,
  failed: 0,
  skipped: 0,
  strategies: {
    directWebsite: 0,
    duckduckgo: 0,
    bing: 0,
    google: 0,
    existingImage: 0,
  },
};

// Utility: Random user agent
function getRandomUserAgent(): string {
  return CONFIG.userAgents[Math.floor(Math.random() * CONFIG.userAgents.length)];
}

// Utility: Human-like delay
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Utility: Validate image via HEAD request
async function validateImageUrl(url: string): Promise<boolean> {
  try {
    const response = await axios.head(url, {
      timeout: 5000,
      maxRedirects: 3,
      headers: {
        'User-Agent': getRandomUserAgent(),
      },
    });

    const contentType = response.headers['content-type'] || '';
    const contentLength = parseInt(response.headers['content-length'] || '0', 10);

    // Check if it's an image and not too large
    if (!contentType.startsWith('image/')) return false;
    if (contentLength > CONFIG.maxFileSize) return false;
    // REMOVED minimum size check - accept any image size!

    return true;
  } catch (error) {
    return false;
  }
}

// Strategy 1: Scrape MULTIPLE images from place website for gallery
async function scrapeFromWebsite(page: Page, websiteUrl: string, placeName: string): Promise<string[]> {
  try {
    console.log(`  → Trying direct website scraping: ${websiteUrl}`);
    
    await page.goto(websiteUrl, { 
      waitUntil: 'networkidle2', 
      timeout: CONFIG.timeout 
    });

    await delay(1000 + Math.random() * 2000); // Human-like delay

    const imageUrls: string[] = [];

    // Strategy 1a: Check meta tags (og:image, twitter:image)
    const metaImage = await page.evaluate(() => {
      const ogImage = document.querySelector('meta[property="og:image"]');
      const twitterImage = document.querySelector('meta[name="twitter:image"]');
      return ogImage?.getAttribute('content') || twitterImage?.getAttribute('content') || null;
    });

    if (metaImage) {
      const isValid = await validateImageUrl(metaImage);
      if (isValid) {
        console.log(`  ✅ Found valid image in meta tags`);
        imageUrls.push(metaImage);
      }
    }

    // Strategy 1b: Collect ALL suitable images from page (for gallery)
    const allImages = await page.evaluate((minWidth, minHeight, maxImages) => {
      const images = Array.from(document.querySelectorAll('img'));
      const validImages: { src: string; area: number }[] = [];

      for (const img of images) {
        const width = img.naturalWidth || img.width;
        const height = img.naturalHeight || img.height;
        const src = img.src;
        
        // Skip if too small, or if it's a data URL, or common unwanted patterns
        if (width < minWidth || height < minHeight) continue;
        if (!src || src.startsWith('data:')) continue;
        if (src.includes('logo') || src.includes('icon') || src.includes('avatar')) continue;
        
        const area = width * height;
        validImages.push({ src, area });
      }

      // Sort by size (largest first) and return top images
      return validImages
        .sort((a, b) => b.area - a.area)
        .slice(0, maxImages)
        .map(img => img.src);
    }, CONFIG.minWidth, CONFIG.minHeight, CONFIG.maxGalleryImages);

    // Validate and add all found images
    for (const imgUrl of allImages) {
      if (imageUrls.length >= CONFIG.maxGalleryImages) break;
      if (imageUrls.includes(imgUrl)) continue; // Skip duplicates
      
      const isValid = await validateImageUrl(imgUrl);
      if (isValid) {
        imageUrls.push(imgUrl);
      }
    }

    if (imageUrls.length > 0) {
      console.log(`  ✅ Found ${imageUrls.length} valid images from website`);
      return imageUrls;
    }

    return [];
  } catch (error) {
    console.log(`  ❌ Website scraping failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return [];
  }
}

// Strategy 2: Search DuckDuckGo Images
async function searchDuckDuckGo(page: Page, placeName: string, city: string, country: string): Promise<string | null> {
  try {
    console.log(`  → Trying DuckDuckGo image search`);
    
    const searchQuery = encodeURIComponent(`${placeName} ${city} ${country}`);
    await page.goto(`https://duckduckgo.com/?q=${searchQuery}&iax=images&ia=images`, {
      waitUntil: 'domcontentloaded',
      timeout: CONFIG.timeout,
    });

    await delay(3000 + Math.random() * 2000); // Longer wait for images to load

    const imageUrl = await page.evaluate(() => {
      // Try multiple selectors
      const selectors = [
        'img.tile--img__img',
        'img[data-id]',
        'img.c-tk__img',
        '.tile--img img',
        '.c-result__image img'
      ];
      
      for (const selector of selectors) {
        const img = document.querySelector(selector) as HTMLImageElement;
        if (img?.src && !img.src.startsWith('data:')) {
          return img.src;
        }
      }
      return null;
    });

    if (imageUrl && await validateImageUrl(imageUrl)) {
      console.log(`  ✅ Found valid image on DuckDuckGo`);
      return imageUrl;
    }

    return null;
  } catch (error) {
    console.log(`  ❌ DuckDuckGo search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return null;
  }
}

// Strategy 3: Search Bing Images
async function searchBing(page: Page, placeName: string, city: string, country: string): Promise<string | null> {
  try {
    console.log(`  → Trying Bing image search`);
    
    const searchQuery = encodeURIComponent(`${placeName} ${city} ${country}`);
    await page.goto(`https://www.bing.com/images/search?q=${searchQuery}&first=1`, {
      waitUntil: 'domcontentloaded',
      timeout: CONFIG.timeout,
    });

    await delay(3000 + Math.random() * 2000);

    const imageUrl = await page.evaluate(() => {
      // Try multiple selectors for Bing
      const selectors = [
        'img.mimg',
        'a.iusc img',
        '.imgpt img',
        '.iuscp img',
        'img[data-src]'
      ];
      
      for (const selector of selectors) {
        const imgs = document.querySelectorAll(selector) as NodeListOf<HTMLImageElement>;
        for (const img of imgs) {
          const src = img.src || img.dataset.src;
          if (src && !src.startsWith('data:') && !src.includes('placeholder')) {
            return src;
          }
        }
      }
      return null;
    });

    if (imageUrl && await validateImageUrl(imageUrl)) {
      console.log(`  ✅ Found valid image on Bing`);
      return imageUrl;
    }

    return null;
  } catch (error) {
    console.log(`  ❌ Bing search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return null;
  }
}

// Strategy 4: Search Google Images (last resort)
async function searchGoogle(page: Page, placeName: string, city: string, country: string): Promise<string | null> {
  try {
    console.log(`  → Trying Google image search`);
    
    const searchQuery = encodeURIComponent(`${placeName} ${city} ${country}`);
    await page.goto(`https://www.google.com/search?q=${searchQuery}&tbm=isch&udm=2`, {
      waitUntil: 'domcontentloaded',
      timeout: CONFIG.timeout,
    });

    await delay(4000 + Math.random() * 2000); // Longer wait for Google

    const imageUrl = await page.evaluate(() => {
      // Try multiple methods to extract images
      const selectors = [
        'img[jsname]',
        'div[data-id] img',
        '.rg_i',
        'img[data-src]',
        'img.rg_i'
      ];
      
      for (const selector of selectors) {
        const imgs = document.querySelectorAll(selector) as NodeListOf<HTMLImageElement>;
        for (const img of imgs) {
          const src = img.src || img.dataset.src;
          if (src && !src.startsWith('data:') && src.startsWith('http')) {
            return src;
          }
        }
      }
      return null;
    });

    if (imageUrl && await validateImageUrl(imageUrl)) {
      console.log(`  ✅ Found valid image on Google`);
      return imageUrl;
    }

    return null;
  } catch (error) {
    console.log(`  ❌ Google search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return null;
  }
}

// Download and save image
async function downloadAndSaveImage(
  imageUrl: string,
  placeId: string,
  placeName: string
): Promise<string | null> {
  try {
    console.log(`  → Downloading image...`);

    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      timeout: CONFIG.timeout,
      headers: {
        'User-Agent': getRandomUserAgent(),
      },
      maxRedirects: 5,
    });

    // Process with Sharp
    const imageBuffer = Buffer.from(response.data);
    const image = sharp(imageBuffer);
    const metadata = await image.metadata();

    // Validate dimensions
    if (!metadata.width || !metadata.height) {
      console.log(`  ❌ Could not determine image dimensions`);
      return null;
    }

    // ACCEPT ANY SIZE - correct image is more important than perfect size
    if (metadata.width < CONFIG.minWidth || metadata.height < CONFIG.minHeight) {
      console.log(`  ℹ️  Small image (${metadata.width}x${metadata.height}) but accepting it`);
    }

    // Generate filename
    const sanitizedName = placeName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 50);
    const filename = `${placeId}-${sanitizedName}.jpg`;
    const filepath = path.join(CONFIG.imageDir, filename);

    // Resize if too large and convert to progressive JPEG
    await image
      .resize(1200, 1200, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({
        quality: 85,
        progressive: true,
      })
      .toFile(filepath);

    console.log(`  ✅ Image saved: ${filename}`);
    return `/images/places/${filename}`;
  } catch (error) {
    console.log(`  ❌ Failed to download/save image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return null;
  }
}

// Strategy 5: Use existing Google Places image as absolute fallback
async function useExistingGoogleImage(currentImageUrl: string | null): Promise<string | null> {
  if (!currentImageUrl || !currentImageUrl.includes('places.googleapis.com')) {
    return null;
  }

  try {
    console.log(`  → Using existing Google Places image as fallback`);
    
    const isValid = await validateImageUrl(currentImageUrl);
    if (isValid) {
      console.log(`  ✅ Existing Google Places image is valid`);
      return currentImageUrl;
    }
    return null;
  } catch (error) {
    return null;
  }
}

// Main processing function for a single place
async function processPlace(
  browser: Browser,
  place: { id: string; name: string; websiteUrl: string | null; cityId: string; imageUrl: string | null }
): Promise<boolean> {
  const page = await browser.newPage();
  
  try {
    // Set random user agent
    await page.setUserAgent(getRandomUserAgent());

    // Set viewport
    await page.setViewport({ width: 1920, height: 1080 });

    // Get city and country info
    const city = await prisma.city.findUnique({
      where: { id: place.cityId },
      select: { name: true, country: true },
    });

    if (!city) {
      console.log(`  ❌ City not found for place ${place.name}`);
      return false;
    }

    const currentImage = place.imageUrl || 'none';
    console.log(`\n🔍 Processing: ${place.name} (${city.name}, ${city.country})`);
    console.log(`  📸 Current image: ${currentImage}`);

    let imageUrls: string[] = [];
    let strategy: keyof typeof stats.strategies | null = null;

    // Strategy 1: Direct website scraping (gets MULTIPLE images for gallery)
    if (place.websiteUrl) {
      imageUrls = await scrapeFromWebsite(page, place.websiteUrl, place.name);
      if (imageUrls.length > 0) strategy = 'directWebsite';
    }

    // Strategy 2-5: If no images from website, use search engines (single image)
    if (imageUrls.length === 0) {
      // Strategy 2: DuckDuckGo
      const ddgImage = await searchDuckDuckGo(page, place.name, city.name, city.country);
      if (ddgImage) {
        imageUrls.push(ddgImage);
        strategy = 'duckduckgo';
      }
    }

    if (imageUrls.length === 0) {
      // Strategy 3: Bing
      const bingImage = await searchBing(page, place.name, city.name, city.country);
      if (bingImage) {
        imageUrls.push(bingImage);
        strategy = 'bing';
      }
    }

    if (imageUrls.length === 0) {
      // Strategy 4: Google
      const googleImage = await searchGoogle(page, place.name, city.name, city.country);
      if (googleImage) {
        imageUrls.push(googleImage);
        strategy = 'google';
      }
    }

    if (imageUrls.length === 0) {
      // Strategy 5: Use existing Google Places image (absolute fallback)
      const existingImage = await useExistingGoogleImage(place.imageUrl);
      if (existingImage) {
        imageUrls.push(existingImage);
        strategy = 'existingImage';
      }
    }

    // If we found images, download and save them
    if (imageUrls.length > 0 && strategy) {
      const savedPaths: string[] = [];
      
      for (let i = 0; i < imageUrls.length; i++) {
        const suffix = i === 0 ? '' : `-${i + 1}`;
        const savedPath = await downloadAndSaveImage(imageUrls[i], place.id, place.name + suffix);
        if (savedPath) {
          savedPaths.push(savedPath);
        }
      }

      if (savedPaths.length > 0) {
        // Update database with primary image and gallery
        const galleryJson = savedPaths.length > 1 ? savedPaths.slice(1) : [];
        
        await prisma.place.update({
          where: { id: place.id },
          data: { 
            imageUrl: savedPaths[0],  // Primary image
            gallery: galleryJson,      // Additional images for gallery
          },
        });

        stats.strategies[strategy]++;
        console.log(`✅ SUCCESS: ${place.name} (${strategy}) - ${savedPaths.length} image(s)`);
        return true;
      }
    }

    console.log(`❌ FAILED: ${place.name} - No suitable image found`);
    return false;
  } catch (error) {
    console.log(`❌ ERROR processing ${place.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return false;
  } finally {
    await page.close();
  }
}

// Process places in batches
async function processBatch(browser: Browser, places: any[], batchSize: number): Promise<void> {
  for (let i = 0; i < places.length; i += batchSize) {
    const batch = places.slice(i, i + batchSize);
    console.log(`\n📦 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(places.length / batchSize)}`);
    
    const results = await Promise.all(
      batch.map(place => processPlace(browser, place))
    );

    stats.success += results.filter(r => r).length;
    stats.failed += results.filter(r => !r).length;

    // Progress update
    console.log(`\n📊 Progress: ${stats.success}/${stats.total} successful (${((stats.success / stats.total) * 100).toFixed(1)}%)`);

    // Delay between batches
    if (i + batchSize < places.length) {
      console.log(`⏳ Waiting 5 seconds before next batch...`);
      await delay(5000);
    }
  }
}

// Main execution
async function main() {
  console.log('🚀 Dog Atlas Image Scraper V2 - Starting...\n');

  // Get target city from command line
  const targetCity = process.argv[2];

  // Build query - FORCE RE-SCRAPE ALL IMAGES
  const whereClause: any = {};

  if (targetCity) {
    // SQLite doesn't support mode option, using toLowerCase comparison
    const cities = await prisma.city.findMany();
    const city = cities.find(c => c.name.toLowerCase() === targetCity.toLowerCase());

    if (!city) {
      console.log(`❌ City "${targetCity}" not found`);
      process.exit(1);
    }

    whereClause.cityId = city.id;
    console.log(`🎯 Target: ${city.name}, ${city.country}\n`);
  } else {
    console.log(`🌍 Target: All cities\n`);
  }

  // Fetch places without images
  const places = await prisma.place.findMany({
    where: whereClause,
    select: {
      id: true,
      name: true,
      websiteUrl: true,
      cityId: true,
      imageUrl: true,
    },
  });

  stats.total = places.length;

  console.log(`📋 Found ${places.length} places needing images\n`);

  if (places.length === 0) {
    console.log('✨ All places already have images!');
    await prisma.$disconnect();
    return;
  }

  // Launch browser
  console.log('🌐 Launching stealth browser...\n');
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--window-size=1920,1080',
      '--ignore-certificate-errors',
      '--ignore-certificate-errors-spki-list',
    ],
  });

  try {
    await processBatch(browser, places, CONFIG.batchSize);

    // Final statistics
    console.log('\n' + '='.repeat(60));
    console.log('📊 FINAL STATISTICS');
    console.log('='.repeat(60));
    console.log(`Total places processed: ${stats.total}`);
    console.log(`✅ Successful: ${stats.success} (${((stats.success / stats.total) * 100).toFixed(1)}%)`);
    console.log(`❌ Failed: ${stats.failed} (${((stats.failed / stats.total) * 100).toFixed(1)}%)`);
    console.log(`\nStrategy breakdown:`);
    console.log(`  - Direct website: ${stats.strategies.directWebsite}`);
    console.log(`  - DuckDuckGo: ${stats.strategies.duckduckgo}`);
    console.log(`  - Bing: ${stats.strategies.bing}`);
    console.log(`  - Google: ${stats.strategies.google}`);
    console.log(`  - Existing Google Places image: ${stats.strategies.existingImage}`);
    console.log('='.repeat(60) + '\n');

    // CRITICAL: Remind to sync to production
    if (stats.success > 0) {
      console.log('⚠️  IMPORTANT: SYNC TO PRODUCTION REQUIRED!');
      console.log('='.repeat(60));
      console.log('This script updated LOCAL SQLite database only.');
      console.log('To make images visible on production site:');
      console.log('');
      console.log('1. Run sync script:');
      console.log('   PROD_DATABASE_URL="postgres://..." npx tsx scripts/sync_images_raw.ts');
      console.log('');
      console.log('2. Verify production:');
      console.log('   PROD_DATABASE_URL="postgres://..." npx tsx scripts/check_prod_db.ts');
      console.log('');
      console.log('3. Redeploy (if needed):');
      console.log('   git commit --allow-empty -m "Update after image sync" && git push');
      console.log('');
      console.log('See DATABASE_ARCHITECTURE.md for details.');
      console.log('='.repeat(60) + '\n');
    }
  } finally {
    await browser.close();
    await prisma.$disconnect();
  }
}

// Run the scraper
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
