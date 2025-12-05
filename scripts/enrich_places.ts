
import { PrismaClient } from '@prisma/client';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Page } from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';

puppeteer.use(StealthPlugin());

const prisma = new PrismaClient();

const CONFIG = {
  timeout: 30000,
  userAgents: [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  ],
};

function getRandomUserAgent(): string {
  return CONFIG.userAgents[Math.floor(Math.random() * CONFIG.userAgents.length)];
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function extractRealUrlFromBing(bingUrl: string): Promise<string> {
  // Bing URLs are often redirects like: https://www.bing.com/ck/a?!&&p=...&u=a1...
  // We need to extract the real URL from the 'u' parameter
  try {
    const url = new URL(bingUrl);
    const uParam = url.searchParams.get('u');
    if (uParam) {
      // Decode the URL (it might be double-encoded)
      return decodeURIComponent(decodeURIComponent(uParam));
    }
  } catch (error) {
    console.log(`  ⚠️ Could not decode Bing URL: ${bingUrl}`);
  }
  return bingUrl; // Return original if we can't decode
}

async function searchBingForWebsite(page: Page, query: string): Promise<{ url: string, snippet: string } | null> {
  try {
    console.log(`  → Searching: ${query}`);
    await page.goto(`https://www.bing.com/search?q=${encodeURIComponent(query)}`, {
      waitUntil: 'domcontentloaded',
      timeout: CONFIG.timeout,
    });
    await delay(1000);

    const result = await page.evaluate(() => {
      const resultNode = document.querySelector('#b_results > li.b_algo');
      if (!resultNode) return null;

      const link = resultNode.querySelector('h2 a') as HTMLAnchorElement;
      const descNode = resultNode.querySelector('.b_caption p') || resultNode.querySelector('.b_snippet');

      if (link && link.href) {
        return {
          url: link.href,
          snippet: descNode ? descNode.textContent || '' : ''
        };
      }
      return null;
    });

    if (result) {
      // Extract real URL from Bing redirect
      result.url = await extractRealUrlFromBing(result.url);
    }

    return result;
  } catch (error) {
    console.log(`  ❌ Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return null;
  }
}

async function generateRichDescription(page: Page, placeName: string, cityName: string, websiteUrl: string): Promise<string> {
  try {
    console.log(`  → Visiting website: ${websiteUrl}`);
    await page.goto(websiteUrl, {
      waitUntil: 'domcontentloaded',
      timeout: CONFIG.timeout,
    });
    await delay(2000);

    const content = await page.evaluate((placeName, cityName) => {
      // Extract meaningful content from the page
      const selectors = [
        'meta[name="description"]',
        '[class*="description"]',
        '[class*="about"]',
        'main p',
        '.content p',
        'article p'
      ];

      let description = '';

      // Try meta description first
      const metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement;
      if (metaDesc && metaDesc.content) {
        description = metaDesc.content.trim();
      }

      // If meta description is too short, try to extract from page content
      if (description.length < 100) {
        const paragraphs = Array.from(document.querySelectorAll('p')).filter(p => {
          const text = p.textContent?.trim() || '';
          return text.length > 50 && text.length < 500 && !text.includes('cookie') && !text.includes('privacy');
        });

        if (paragraphs.length > 0) {
          description = paragraphs.slice(0, 2).map(p => p.textContent?.trim()).join(' ').substring(0, 800);
        }
      }

      // If still no good description, create a template based on place type
      if (description.length < 50) {
        const placeType = placeName.toLowerCase().includes('park') ? 'park' :
                          placeName.toLowerCase().includes('trail') ? 'trail' :
                          placeName.toLowerCase().includes('forest') ? 'forest' :
                          placeName.toLowerCase().includes('garden') ? 'garden' : 'place';

        description = `${placeName} is a beautiful ${placeType} located in ${cityName}. This ${placeType} offers a wonderful environment for dogs and their owners to enjoy outdoor activities together.`;
      }

      return description;
    }, placeName, cityName);

    // Format the description nicely
    if (content && content.length > 0) {
      // Clean up the text
      let cleanContent = content
        .replace(/\s+/g, ' ')
        .replace(/\n+/g, ' ')
        .trim();

      // Create a rich description with proper formatting
      const richDescription = `${placeName} in ${cityName} is a wonderful destination for dog lovers. ${cleanContent}`;

      return richDescription.length > 1000 ? richDescription.substring(0, 1000) + '...' : richDescription;
    }

  } catch (error) {
    console.log(`  ❌ Failed to visit website: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return '';
}

async function main() {
  console.log('🚀 Enhanced Place Enrichment - Starting...\n');

  // Get places that need enrichment (missing website or short description)
  const places = await prisma.place.findMany({
    where: {
      OR: [
        { websiteUrl: null },
        { fullDescription: null },
        { fullDescription: '' },
        { fullDescription: { contains: '**' } } // Re-process places with markdown artifacts
      ],
      city: {
        active: true
      }
    },
    include: {
      city: true
    },
    take: 500 // Process in smaller batches for better quality
  });

  console.log(`Found ${places.length} places to enrich.`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setUserAgent(getRandomUserAgent());
  await page.setViewport({ width: 1920, height: 1080 });

  let processed = 0;
  let updated = 0;

  for (const place of places) {
    console.log(`\nProcessing ${++processed}/${places.length}: ${place.name} (${place.city.name})`);

    let websiteUrl = place.websiteUrl;
    let description = place.fullDescription;

    // 1. Find website if missing
    if (!websiteUrl) {
      const query = `${place.name} ${place.city.name} official website`;
      const result = await searchBingForWebsite(page, query);

      if (result && result.url) {
        websiteUrl = result.url;
        console.log(`  ✅ Found URL: ${websiteUrl}`);

        // Use search snippet as fallback description
        if (!description && result.snippet) {
          description = result.snippet;
        }
      } else {
        console.log(`  ⚠️ No URL found.`);
      }
    }

    // 2. Generate rich description if needed
    if (!description || description.includes('**') || description.length < 100) {
      if (websiteUrl) {
        const richDesc = await generateRichDescription(page, place.name, place.city.name, websiteUrl);
        if (richDesc && richDesc.length > description.length) {
          description = richDesc;
          console.log(`  ✅ Generated rich description (${description.length} chars)`);
        }
      }

      // Fallback: Create a basic but nice description
      if (!description || description.length < 50) {
        const placeType = place.name.toLowerCase().includes('park') ? 'park' :
                          place.name.toLowerCase().includes('trail') ? 'trail' :
                          place.name.toLowerCase().includes('forest') ? 'forest' :
                          place.name.toLowerCase().includes('garden') ? 'garden' : 'outdoor destination';

        description = `${place.name} is a beautiful ${placeType} in ${place.city.name}, perfect for dogs and their owners to enjoy quality time together in a natural setting.`;
        console.log(`  ✅ Created fallback description`);
      }
    }

    // 3. Update database
    if (websiteUrl !== place.websiteUrl || description !== place.fullDescription) {
      await prisma.place.update({
        where: { id: place.id },
        data: {
          websiteUrl: websiteUrl || place.websiteUrl,
          fullDescription: description || place.fullDescription
        }
      });
      updated++;
      console.log(`  ✅ Updated database`);
    } else {
      console.log(`  ℹ️ No updates needed`);
    }

    await delay(3000 + Math.random() * 2000); // Longer delay for website visits
  }

  await browser.close();
  console.log(`\n✅ Enrichment complete. Processed: ${processed}, Updated: ${updated}`);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
