#!/usr/bin/env npx tsx

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database with raw SQL...')
  
  try {
    // Insert cities
    await prisma.$executeRaw`
      INSERT OR REPLACE INTO City (id, slug, name, region, country, lat, lng, active, createdAt, updatedAt)
      VALUES 
        ('berlin-id', 'berlin', 'Berlin', 'Berlin', 'Germany', 52.5200, 13.4050, 1, datetime('now'), datetime('now')),
        ('barcelona-id', 'barcelona', 'Barcelona', 'Catalonia', 'Spain', 41.3851, 2.1734, 1, datetime('now'), datetime('now')),
        ('paris-id', 'paris', 'Paris', 'Île-de-France', 'France', 48.8566, 2.3522, 1, datetime('now'), datetime('now')),
        ('rome-id', 'rome', 'Rome', 'Lazio', 'Italy', 41.9028, 12.4964, 1, datetime('now'), datetime('now'))
    `
    console.log('✓ Cities inserted')
    
    // Insert sample places
    await prisma.$executeRaw`
      INSERT OR REPLACE INTO Place (id, slug, name, type, cityId, region, country, lat, lng, shortDescription, dogFriendlyLevel, rating, createdAt, updatedAt)
      VALUES 
        ('place-1', 'tiergarten-park', 'Tiergarten Park', 'park', 'berlin-id', 'Mitte', 'Germany', 52.5144, 13.3501, 'Large central park perfect for dog walking', 5, 4.5, datetime('now'), datetime('now')),
        ('place-2', 'cafe-einstein', 'Café Einstein', 'cafe', 'berlin-id', 'Mitte', 'Germany', 52.5023, 13.3617, 'Dog-friendly café with outdoor seating', 4, 4.2, datetime('now'), datetime('now')),
        ('place-3', 'grunewald-forest', 'Grunewald Forest', 'trail', 'berlin-id', 'Charlottenburg-Wilmersdorf', 'Germany', 52.4746, 13.2594, 'Large forest with trails for hiking with dogs', 5, 4.7, datetime('now'), datetime('now')),
        ('place-4', 'park-guell', 'Park Güell', 'park', 'barcelona-id', 'Gràcia', 'Spain', 41.4145, 2.1527, 'Famous park with stunning city views', 3, 4.4, datetime('now'), datetime('now')),
        ('place-5', 'barceloneta-beach', 'Barceloneta Beach', 'beach', 'barcelona-id', 'Ciutat Vella', 'Spain', 41.3755, 2.1838, 'Popular beach with dog-friendly areas', 4, 4.1, datetime('now'), datetime('now'))
    `
    console.log('✓ Places inserted')
    
    // Check counts
    const cityCount = await prisma.$queryRaw`SELECT COUNT(*) as count FROM City`
    const placeCount = await prisma.$queryRaw`SELECT COUNT(*) as count FROM Place`
    
    console.log(`\n🎉 Seeding complete!`)
    console.log(`📍 Cities:`, cityCount)
    console.log(`🏞️ Places:`, placeCount)
    
  } catch (error) {
    console.error('Error seeding database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()