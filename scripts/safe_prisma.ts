#!/usr/bin/env npx tsx

/**
 * SAFE PRISMA MIGRATION WRAPPER
 * 
 * This script prevents accidental --force-reset on production.
 * It requires explicit confirmation before running destructive operations.
 */

import * as readline from 'readline'
import { execSync } from 'child_process'

const args = process.argv.slice(2)
const command = args.join(' ')

// Check if this is a destructive operation
const isDestructive = 
  command.includes('--force-reset') ||
  command.includes('db push --accept-data-loss') ||
  command.includes('migrate reset') ||
  command.includes('db reset')

// Check if we're in production
const isProduction = 
  process.env.DATABASE_URL?.includes('prisma.io') ||
  process.env.DATABASE_URL?.includes('neon.tech') ||
  process.env.DATABASE_URL?.includes('railway.app') ||
  process.env.DATABASE_URL?.includes('supabase') ||
  process.env.NODE_ENV === 'production'

async function confirmAction(message: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  return new Promise((resolve) => {
    rl.question(`${message} (Type "YES" to confirm): `, (answer) => {
      rl.close()
      resolve(answer === 'YES')
    })
  })
}

async function main() {
  console.log(`\n🔍 Prisma Command: ${command}`)
  console.log(`📊 Database: ${process.env.DATABASE_URL?.substring(0, 50)}...`)
  console.log(`🌍 Environment: ${isProduction ? 'PRODUCTION' : 'Development'}\n`)

  if (isDestructive && isProduction) {
    console.log('⚠️  WARNING: DESTRUCTIVE OPERATION ON PRODUCTION DATABASE!')
    console.log('This will DELETE ALL DATA!')
    console.log('\nAre you ABSOLUTELY SURE you want to continue?')
    console.log('This action CANNOT be undone!\n')

    const confirmed = await confirmAction('⚠️  Type "YES" to DELETE ALL PRODUCTION DATA')
    
    if (!confirmed) {
      console.log('\n✋ Operation cancelled. Your data is safe.')
      process.exit(0)
    }

    // Double confirmation
    console.log('\n⚠️  FINAL CONFIRMATION REQUIRED')
    const doubleConfirmed = await confirmAction('Type "YES" again to confirm data deletion')
    
    if (!doubleConfirmed) {
      console.log('\n✋ Operation cancelled. Your data is safe.')
      process.exit(0)
    }

    // Create emergency backup first
    console.log('\n📦 Creating emergency backup before proceeding...')
    try {
      execSync('npx tsx scripts/backup_database.ts', { stdio: 'inherit' })
      console.log('✅ Emergency backup complete\n')
    } catch (error) {
      console.error('❌ Backup failed! Aborting operation.')
      process.exit(1)
    }
  }

  // Execute the prisma command
  try {
    console.log(`\n🚀 Executing: npx prisma ${command}\n`)
    execSync(`npx prisma ${command}`, { stdio: 'inherit' })
    console.log('\n✅ Operation complete')
  } catch (error) {
    console.error('\n❌ Operation failed:', error)
    process.exit(1)
  }
}

main()
