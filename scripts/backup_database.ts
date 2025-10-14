#!/usr/bin/env npx tsx

/**
 * AUTOMATIC DAILY DATABASE BACKUP SCRIPT
 * 
 * This script exports the entire database to CSV and JSON formats
 * with timestamps to prevent data loss.
 * 
 * Run daily via cron job:
 * 0 2 * * * cd /path/to/project && npm run backup
 */

import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'
import { stringify } from 'csv-stringify/sync'

const prisma = new PrismaClient()

async function backup() {
  const timestamp = new Date().toISOString().split('T')[0]
  const backupDir = path.join(process.cwd(), 'backups', timestamp)

  // Create backup directory
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true })
  }

  console.log(`🔄 Starting backup to: ${backupDir}`)

  try {
    // Backup Cities
    const cities = await prisma.city.findMany()
    const citiesCSV = stringify(cities, { header: true })
    fs.writeFileSync(path.join(backupDir, 'cities.csv'), citiesCSV)
    fs.writeFileSync(path.join(backupDir, 'cities.json'), JSON.stringify(cities, null, 2))
    console.log(`✓ Backed up ${cities.length} cities`)

    // Backup Places
    const places = await prisma.place.findMany()
    const placesCSV = stringify(places, { header: true })
    fs.writeFileSync(path.join(backupDir, 'places.csv'), placesCSV)
    fs.writeFileSync(path.join(backupDir, 'places.json'), JSON.stringify(places, null, 2))
    console.log(`✓ Backed up ${places.length} places`)

    // Backup Reviews
    const reviews = await prisma.review.findMany()
    if (reviews.length > 0) {
      const reviewsCSV = stringify(reviews, { header: true })
      fs.writeFileSync(path.join(backupDir, 'reviews.csv'), reviewsCSV)
      fs.writeFileSync(path.join(backupDir, 'reviews.json'), JSON.stringify(reviews, null, 2))
      console.log(`✓ Backed up ${reviews.length} reviews`)
    }

    // Backup Users (without sensitive data)
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    })
    if (users.length > 0) {
      fs.writeFileSync(path.join(backupDir, 'users.json'), JSON.stringify(users, null, 2))
      console.log(`✓ Backed up ${users.length} users`)
    }

    // Backup Photos
    const photos = await prisma.photo.findMany()
    if (photos.length > 0) {
      fs.writeFileSync(path.join(backupDir, 'photos.json'), JSON.stringify(photos, null, 2))
      console.log(`✓ Backed up ${photos.length} photos`)
    }

    // Backup PlacePhotos
    const placePhotos = await prisma.placePhoto.findMany()
    if (placePhotos.length > 0) {
      fs.writeFileSync(path.join(backupDir, 'place_photos.json'), JSON.stringify(placePhotos, null, 2))
      console.log(`✓ Backed up ${placePhotos.length} place photos`)
    }

    // Create backup manifest
    const manifest = {
      timestamp: new Date().toISOString(),
      counts: {
        cities: cities.length,
        places: places.length,
        reviews: reviews.length,
        users: users.length,
        photos: photos.length,
        placePhotos: placePhotos.length
      }
    }
    fs.writeFileSync(path.join(backupDir, 'manifest.json'), JSON.stringify(manifest, null, 2))

    console.log(`\n✅ Backup complete!`)
    console.log(`📁 Location: ${backupDir}`)
    console.log(`📊 Total records: ${cities.length + places.length + reviews.length + users.length + photos.length + placePhotos.length}`)

    // Clean up old backups (keep last 30 days)
    cleanOldBackups()

  } catch (error) {
    console.error('❌ Backup failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

function cleanOldBackups() {
  const backupsDir = path.join(process.cwd(), 'backups')
  if (!fs.existsSync(backupsDir)) return

  const dirs = fs.readdirSync(backupsDir)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  let removed = 0
  for (const dir of dirs) {
    const dirPath = path.join(backupsDir, dir)
    const stat = fs.statSync(dirPath)
    
    if (stat.isDirectory() && stat.mtime < thirtyDaysAgo) {
      fs.rmSync(dirPath, { recursive: true })
      removed++
    }
  }

  if (removed > 0) {
    console.log(`🗑️  Cleaned up ${removed} old backups`)
  }
}

backup()
