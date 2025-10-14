#!/usr/bin/env node

/**
 * Generate Redirects
 * 
 * Scans src/app for legacy top-level city page folders and generates
 * redirects.generated.js based on legacyCityMap.json
 * 
 * Usage: node scripts/generate-redirects.js
 * 
 * Output: redirects.generated.js (loaded by next.config.js)
 */

const fs = require('fs').promises;
const path = require('path');

const APP_DIR = path.join(process.cwd(), 'src', 'app');
const OUT_FILE = path.join(process.cwd(), 'redirects.generated.cjs');
const LEGACY_MAP_FILE = path.join(process.cwd(), 'legacyCityMap.json');

// Folders to exclude from city detection
const EXCLUDED_FOLDERS = [
  'api', '_components', 'countries', 'assets', 'public', 'styles',
  'admin', 'mod', 'login', 'signup', 'signin', 'places', 'favorites',
  'leaderboard', 'submit', 'privacy', 'tos'
];

/**
 * Check if a folder name looks like a legacy city slug
 */
function isLikelyCityFolder(name) {
  // Simple slugs: letters, numbers, hyphens only
  // Exclude known non-city folders
  return /^[a-z0-9-]+$/.test(name) && !EXCLUDED_FOLDERS.includes(name);
}

/**
 * Check if a file exists
 */
async function fileExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

/**
 * Main generator function
 */
async function main() {
  console.log('📍 Generating redirects for legacy city routes...\n');
  console.log(`   Scanning: ${APP_DIR}`);
  console.log(`   Mapping:  ${LEGACY_MAP_FILE}`);
  console.log(`   Output:   ${OUT_FILE}\n`);

  // Read app directory
  const entries = await fs.readdir(APP_DIR, { withFileTypes: true }).catch(err => {
    console.error('❌ Error reading app directory:', err.message);
    process.exit(1);
  });

  // Load legacy city mapping
  let legacyMap = {};
  if (await fileExists(LEGACY_MAP_FILE)) {
    try {
      const mapContent = await fs.readFile(LEGACY_MAP_FILE, 'utf8');
      legacyMap = JSON.parse(mapContent);
      console.log(`✅ Loaded ${Object.keys(legacyMap).length} mappings from legacyCityMap.json`);
    } catch (e) {
      console.warn('⚠️  legacyCityMap.json exists but is invalid JSON:', e.message);
      console.warn('   Using empty map. Please fix the JSON file.\n');
      legacyMap = {};
    }
  } else {
    console.warn('⚠️  No legacyCityMap.json found. Create one to supply country mappings.');
    console.warn('   Example: { "berlin": { "country": "germany", "city": "berlin" } }\n');
  }

  const redirects = [];
  const foundCities = [];

  // Scan for legacy city folders
  for (const ent of entries) {
    if (!ent.isDirectory()) continue;
    const name = ent.name;

    if (!isLikelyCityFolder(name)) continue;

    // Check if this folder has a page file
    const candidateFiles = [
      path.join(APP_DIR, name, 'page.tsx'),
      path.join(APP_DIR, name, 'page.jsx'),
      path.join(APP_DIR, name, 'page.js'),
      path.join(APP_DIR, name, 'page.ts'),
    ];

    const hasPage = (await Promise.all(candidateFiles.map(p => fileExists(p)))).some(Boolean);
    if (!hasPage) continue;

    foundCities.push(name);

    // Get mapping from legacyCityMap.json
    const mapping = legacyMap[name] || { country: 'unknown', city: name };
    
    if (!legacyMap[name]) {
      console.warn(`⚠️  No legacyCityMap entry for '${name}'. Using placeholder: /countries/unknown/${name}`);
    }

    redirects.push({
      source: `/${name}`,
      destination: `/countries/${mapping.country}/${mapping.city}`,
      permanent: true,
    });
  }

  console.log(`\n📁 Found ${foundCities.length} legacy city folder(s): ${foundCities.join(', ')}`);

  // Also include explicit entries from legacyCityMap that might not have folders
  let additionalCount = 0;
  for (const [slug, mapping] of Object.entries(legacyMap)) {
    if (!redirects.some(r => r.source === `/${slug}`)) {
      redirects.push({
        source: `/${slug}`,
        destination: `/countries/${mapping.country}/${mapping.city}`,
        permanent: true,
      });
      additionalCount++;
    }
  }

  if (additionalCount > 0) {
    console.log(`📝 Added ${additionalCount} explicit mapping(s) from legacyCityMap.json`);
  }

  // Write redirects file
  const fileContents = `// GENERATED FILE — DO NOT EDIT BY HAND
// Run: node scripts/generate-redirects.js
// Generated: ${new Date().toISOString()}

module.exports = ${JSON.stringify(redirects, null, 2)};
`;

  await fs.writeFile(OUT_FILE, fileContents, 'utf8');
  
  console.log(`\n✅ Wrote ${OUT_FILE}`);
  console.log(`   Total redirects: ${redirects.length}`);
  
  if (redirects.length > 0) {
    console.log('\n📋 Sample redirects:');
    redirects.slice(0, 5).forEach(r => {
      console.log(`   ${r.source} → ${r.destination}`);
    });
    if (redirects.length > 5) {
      console.log(`   ... and ${redirects.length - 5} more`);
    }
  }

  console.log('\n🎉 Done! Restart your Next.js dev server to apply redirects.\n');
}

// Run
main().catch(err => {
  console.error('\n❌ Unhandled error:', err);
  process.exit(1);
});
