// scripts/find_and_fix_missing_photos.ts
import 'dotenv/config';
import { PrismaClient, Place } from '@prisma/client';
import puppeteer from 'puppeteer';
import pLimit from 'p-limit';
import sharp from 'sharp';
import fetch from 'node-fetch';

const prisma = new PrismaClient();
const limit = pLimit(2);

const MIN_WIDTH = 600;
const MIN_HEIGHT = 400;

async function searchForImage(placeName: string, city: string): Promise<string | null> {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    try {
        const query = `${placeName} ${city}`;
        await page.goto(`https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch`, { waitUntil: 'networkidle2' });

        const imageUrl = await page.evaluate(() => {
            const firstImage = document.querySelector('img[jsname="Q4LuWd"]');
            return firstImage ? firstImage.getAttribute('src') : null;
        });

        return imageUrl;
    } catch (error) {
        console.error(`Error searching for image for ${placeName}:`, error);
        return null;
    } finally {
        await browser.close();
    }
}

async function probeAndSaveImage(place: Place, imageUrl: string, dryRun: boolean) {
    try {
        const response = await fetch(imageUrl);
        if (!response.ok) return false;

        const buffer = await response.buffer();
        const metadata = await sharp(buffer).metadata();

        if ((metadata.width ?? 0) >= MIN_WIDTH && (metadata.height ?? 0) >= MIN_HEIGHT) {
            if (!dryRun) {
                await prisma.place.update({
                    where: { id: place.id },
                    data: { imageUrl: imageUrl },
                });
            }
            console.log(`✅ Found and saved image for ${place.name}: ${imageUrl}`);
            return true;
        }
        return false;
    } catch (e) {
        console.error(`Error probing image ${imageUrl} for ${place.name}:`, e);
        return false;
    }
}


async function main() {
    const dryRun = process.argv.includes('--dry');
    console.log(`Starting photo fix script... ${dryRun ? '(Dry Run)' : ''}`);

    const placesWithoutImages = await prisma.place.findMany({
        where: {
            imageUrl: null,
        },
        include: {
            city: true,
        },
    });

    console.log(`Found ${placesWithoutImages.length} places without images.`);

    const promises = placesWithoutImages.map(place => limit(async () => {
        console.log(`🔍 Searching for image for ${place.name} in ${place.city.name}...`);
        const imageUrl = await searchForImage(place.name, place.city.name);

        if (imageUrl) {
            await probeAndSaveImage(place, imageUrl, dryRun);
        } else {
            console.log(`❌ No image found for ${place.name}`);
        }
    }));

    await Promise.all(promises);

    console.log('Photo fix script complete.');
    await prisma.$disconnect();
}

main().catch(e => {
    console.error(e);
    process.exit(1);
});
