#!/usr/bin/env npx tsx

import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

async function runImport() {
  console.log('🚀 Starting DogAtlas data import...\n')

  try {
    // Import places first
    console.log('📍 Importing places...')
    await execAsync('npx tsx scripts/import_places.ts')
    console.log('✅ Places import completed\n')

    // Import reviews
    console.log('⭐ Importing reviews...')
    await execAsync('npx tsx scripts/import_reviews.ts')
    console.log('✅ Reviews import completed\n')

    console.log('🎉 All data import completed successfully!')

  } catch (error) {
    console.error('❌ Import failed:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  runImport()
}
