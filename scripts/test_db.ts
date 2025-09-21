#!/usr/bin/env npx tsx

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testConnection() {
  try {
    console.log('Testing Prisma connection...')
    console.log('Available models:', Object.keys(prisma))
    
    // Test raw query
    const result = await prisma.$queryRaw`SELECT name FROM sqlite_master WHERE type='table';`
    console.log('Tables in database:', result)
    
    await prisma.$disconnect()
  } catch (error) {
    console.error('Database connection error:', error)
  }
}

testConnection()