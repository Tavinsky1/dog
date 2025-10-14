/**
 * DATABASE SYNC SCRIPT: Local SQLite → Production PostgreSQL
 * 
 * TARGET DATABASE: Both (reads from local SQLite, writes to production PostgreSQL)
 * SYNC REQUIRED: No (this IS the sync script)
 * 
 * PURPOSE:
 *   Synchronizes imageUrl and gallery data from local SQLite database
 *   to production PostgreSQL database. Use this after running any script
 *   that modifies place images locally (e.g., imageScraperV2.ts).
 * 
 * USAGE:
 *   PROD_DATABASE_URL="postgres://..." npx tsx scripts/sync_images_raw.ts
 * 
 * IMPORTANT NOTES:
 *   - Matches records by name + country (NOT by ID, as UUIDs differ)
 *   - Updates imageUrl and gallery fields only (safe, non-destructive)
 *   - Reports statistics: updated, skipped, failed
 *   - Production PostgreSQL is the source of truth for deployed data
 * 
 * PREREQUISITES:
 *   - Local prisma/dev.db must have correct image data
 *   - PROD_DATABASE_URL environment variable must be set
 *   - pg package must be installed (npm install pg @types/pg)
 * 
 * VERIFICATION:
 *   After sync, run: scripts/check_prod_db.ts to verify production data
 * 
 * See DATABASE_ARCHITECTURE.md for full database management guide.
 */

import { PrismaClient } from '@prisma/client';
import { Client } from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function syncImagesRaw() {
  console.log('🔄 Starting image sync from local SQLite to production PostgreSQL...\n');

  // Read from local SQLite using Prisma
  const localDbPath = path.join(__dirname, '..', 'prisma', 'dev.db');
  const localPrisma = new PrismaClient({
    datasources: {
      db: {
        url: `file:${localDbPath}`,
      },
    },
  });

  // Get production database URL from environment
  const prodDbUrl = process.env.PROD_DATABASE_URL;
  if (!prodDbUrl) {
    throw new Error('PROD_DATABASE_URL environment variable is required');
  }

  try {
    // Read all places from local database
    console.log('📖 Reading from local SQLite database...');
    const localPlaces = await localPrisma.place.findMany({
      select: {
        id: true,
        name: true,
        country: true,
        imageUrl: true,
        gallery: true,
      }
    });

    console.log(`📊 Found ${localPlaces.length} places in local database\n`);

    // Connect to PostgreSQL using pg client
    console.log('🔌 Connecting to production PostgreSQL database...');
    const pgClient = new Client({
      connectionString: prodDbUrl,
      ssl: {
        rejectUnauthorized: false
      }
    });

    await pgClient.connect();
    console.log('✅ Connected to production database\n');

    let updated = 0;
    let failed = 0;
    let skipped = 0;

    for (const place of localPlaces) {
      try {
        // Skip if no imageUrl
        if (!place.imageUrl) {
          skipped++;
          continue;
        }

        // Convert gallery to JSON string for PostgreSQL
        const galleryJson = place.gallery ? JSON.stringify(place.gallery) : null;

        // Update using raw SQL - match by name AND country since IDs differ
        const query = `
          UPDATE "Place" 
          SET "imageUrl" = $1, 
              "gallery" = $2
          WHERE name = $3 AND country = $4
        `;

        const result = await pgClient.query(query, [place.imageUrl, galleryJson, place.name, place.country]);
        
        if (result.rowCount && result.rowCount > 0) {
          updated++;
          if (updated % 10 === 0) {
            console.log(`✅ Updated ${updated}/${localPlaces.length} places...`);
          }
        } else {
          console.log(`⚠️  No match found for: ${place.name} (${place.country})`);
          skipped++;
        }
      } catch (error) {
        console.error(`❌ Failed to update ${place.name}:`, error);
        failed++;
      }
    }

    await pgClient.end();

    console.log('\n📊 Sync Summary:');
    console.log(`   ✅ Updated: ${updated}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log(`   📈 Total: ${localPlaces.length}`);
    console.log('\n🎉 Sync complete!');
  } catch (error) {
    console.error('❌ Error during sync:', error);
    throw error;
  } finally {
    await localPrisma.$disconnect();
  }
}

syncImagesRaw();
