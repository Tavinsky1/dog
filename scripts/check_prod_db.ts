/**
 * PRODUCTION DATABASE VERIFICATION SCRIPT
 * 
 * TARGET DATABASE: Production PostgreSQL (db.prisma.io)
 * SYNC REQUIRED: No (read-only verification)
 * 
 * PURPOSE:
 *   Validates production database state after sync operations.
 *   Checks for: total places, images, placeholders, galleries, and sample data.
 * 
 * USAGE:
 *   PROD_DATABASE_URL="postgres://..." npx tsx scripts/check_prod_db.ts
 * 
 * CHECKS PERFORMED:
 *   - Total number of places
 *   - Number of places with imageUrl
 *   - Number of placeholder images (should be 0)
 *   - Number of places with galleries
 *   - Sample of 5 places with their image URLs
 * 
 * USE AFTER:
 *   - Running sync_images_raw.ts
 *   - Any production database modification
 *   - Debugging image display issues
 * 
 * See DATABASE_ARCHITECTURE.md for database management guide.
 */

import { Client } from 'pg';

async function checkProdDatabase() {
  const prodDbUrl = process.env.PROD_DATABASE_URL;
  if (!prodDbUrl) {
    throw new Error('PROD_DATABASE_URL environment variable is required');
  }

  console.log('🔌 Connecting to production PostgreSQL database...\n');
  
  const pgClient = new Client({
    connectionString: prodDbUrl,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await pgClient.connect();
    console.log('✅ Connected successfully!\n');

    // Check total places
    const countResult = await pgClient.query('SELECT COUNT(*) as total FROM "Place"');
    console.log(`📊 Total places: ${countResult.rows[0].total}`);

    // Check places with images
    const withImagesResult = await pgClient.query(
      'SELECT COUNT(*) as count FROM "Place" WHERE "imageUrl" IS NOT NULL AND "imageUrl" != \'\''
    );
    console.log(`🖼️  Places with imageUrl: ${withImagesResult.rows[0].count}`);

    // Check for placeholders
    const placeholderResult = await pgClient.query(
      `SELECT COUNT(*) as count FROM "Place" WHERE "imageUrl" LIKE '%placeholder%' OR "imageUrl" LIKE '%bing%'`
    );
    console.log(`🚫 Places with placeholders: ${placeholderResult.rows[0].count}`);

    // Sample 5 places
    console.log('\n📋 Sample of 5 places:\n');
    const sampleResult = await pgClient.query(
      'SELECT id, name, country, "imageUrl" FROM "Place" LIMIT 5'
    );
    
    sampleResult.rows.forEach((row, i) => {
      console.log(`${i + 1}. ${row.name} (${row.country})`);
      console.log(`   Image: ${row.imageUrl || 'NULL'}\n`);
    });

    // Check for galleries
    const galleryResult = await pgClient.query(
      'SELECT COUNT(*) as count FROM "Place" WHERE gallery IS NOT NULL'
    );
    console.log(`🎨 Places with galleries: ${galleryResult.rows[0].count}`);

    await pgClient.end();
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

checkProdDatabase();
