import { PrismaClient } from '@prisma/client';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Page } from 'puppeteer';

puppeteer.use(StealthPlugin());

const prisma = new PrismaClient();

async function extractRealUrlFromBing(bingUrl: string): Promise<string> {
  try {
    const url = new URL(bingUrl);
    const uParam = url.searchParams.get('u');
    if (uParam) {
      return decodeURIComponent(decodeURIComponent(uParam));
    }
  } catch (error) {}
  return bingUrl;
}

async function generateRichDescription(page: Page, placeName: string, cityName: string, websiteUrl: string): Promise<string> {
  try {
    console.log('  → Visiting website:', websiteUrl);
    await page.goto(websiteUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise(resolve => setTimeout(resolve, 2000));

    const content = await page.evaluate(() => {
      const metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement;
      if (metaDesc && metaDesc.content) {
        return metaDesc.content.trim();
      }

      const paragraphs = Array.from(document.querySelectorAll('p')).filter(p => {
        const text = p.textContent?.trim() || '';
        return text.length > 50 && text.length < 500;
      });

      if (paragraphs.length > 0) {
        return paragraphs.slice(0, 2).map(p => p.textContent?.trim()).join(' ').substring(0, 800);
      }

      return '';
    });

    if (content && content.length > 0) {
      const richDescription = `${placeName} in ${cityName} is a wonderful destination for dog lovers. ${content}`;
      return richDescription.length > 1000 ? richDescription.substring(0, 1000) + '...' : richDescription;
    }
  } catch (error) {
    console.log('  ❌ Failed to visit website:', (error as Error).message);
  }
  return '';
}

async function main() {
  try {
    // Get places with markdown artifacts
    const places = await prisma.place.findMany({
      where: {
        fullDescription: { contains: '**' },
        city: { active: true }
      },
      include: { city: true },
      take: 50
    });

    console.log(`Found ${places.length} places with markdown artifacts`);

    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1920, height: 1080 });

    let updated = 0;

    for (const place of places) {
      console.log(`Processing: ${place.name} (${place.city.name})`);

      let description = place.fullDescription || '';
      let websiteUrl = place.websiteUrl;

      // Extract real URL if it's a Bing redirect
      if (websiteUrl && websiteUrl.includes('bing.com')) {
        websiteUrl = await extractRealUrlFromBing(websiteUrl);
        console.log('  → Extracted real URL:', websiteUrl);
      }

      // Generate new rich description
      if (websiteUrl && !websiteUrl.includes('bing.com')) {
        const richDesc = await generateRichDescription(page, place.name, place.city.name, websiteUrl);
        if (richDesc && richDesc.length > description.length) {
          description = richDesc;
          console.log(`  ✅ Generated rich description (${description.length} chars)`);
        }
      }

      // Fallback: Clean description by removing markdown
      if (description.includes('**')) {
        description = description.replace(/\*\*[^*]+\*\*/g, '').replace(/\n+/g, ' ').trim();
        console.log('  ✅ Cleaned markdown from description');
      }

      // Update database
      await prisma.place.update({
        where: { id: place.id },
        data: {
          websiteUrl: websiteUrl,
          fullDescription: description
        }
      });

      updated++;
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    await browser.close();
    console.log(`Updated ${updated} places`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();