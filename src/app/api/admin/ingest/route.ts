import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { parse } from 'csv-parse/sync'
import { isAuthenticatedSession } from '@/types/auth'

// CSV Schema for validation
const csvRowSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum([
    'park_offleash_area', 'park_onleash_area', 'trail_hiking', 'trail_walking',
    'beach_dog_friendly', 'lake_dog_friendly', 'cafe_dog_friendly',
    'restaurant_dog_friendly', 'brewery_dog_friendly', 'vet_clinic',
    'vet_emergency', 'grooming_salon', 'grooming_mobile', 'pet_store',
    'doggy_daycare', 'dog_training', 'hotel_pet_friendly', 'hostel_pet_friendly',
    'apartment_pet_friendly', 'dog_park_event', 'dog_training_class',
    'dog_meetup', 'pet_expo', 'dog_spa', 'pet_photography', 'dog_taxi',
    'pet_cemetery'
  ], 'Invalid place type'),
  city: z.string().min(1, 'City is required'),
  latitude: z.string().transform(val => {
    const num = parseFloat(val)
    if (isNaN(num) || num < -90 || num > 90) {
      throw new Error('Invalid latitude')
    }
    return num
  }),
  longitude: z.string().transform(val => {
    const num = parseFloat(val)
    if (isNaN(num) || num < -180 || num > 180) {
      throw new Error('Invalid longitude')
    }
    return num
  }),
  short_description: z.string().optional(),
  full_description: z.string().optional(),
  image_url: z.string().url().optional().or(z.literal('')),
  website_url: z.string().url().optional().or(z.literal('')),
  phone: z.string().optional(),
  region: z.string().optional(),
  country: z.string().optional(),
  opening_hours: z.string().optional(),
  price_range: z.string().optional(),
  rating: z.string().transform(val => val ? parseFloat(val) : undefined).optional(),
  amenities: z.string().optional(),
  tags: z.string().optional()
})

type ValidatedCsvRow = {
  name: string
  type: string
  city: string
  latitude: number
  longitude: number
  short_description?: string
  full_description?: string
  image_url?: string
  website_url?: string
  phone?: string
  region?: string
  country?: string
  opening_hours?: string
  price_range?: string
  rating?: number
  amenities?: string
  tags?: string
  cityId: string
  rowNumber: number
}

interface ValidationResult {
  isValid: boolean
  errors: Array<{ row: number; field: string; message: string }>
  warnings: Array<{ row: number; field: string; message: string }>
  summary: {
    totalRows: number
    validRows: number
    invalidRows: number
  }
  validData?: ValidatedCsvRow[]
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!isAuthenticatedSession(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has admin/editor role
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    })

    if (!user || !['ADMIN', 'EDITOR'].includes(user.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Parse multipart form data
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!file.name.toLowerCase().endsWith('.csv')) {
      return NextResponse.json({ error: 'File must be a CSV' }, { status: 400 })
    }

    // Read file content
    const buffer = await file.arrayBuffer()
    const csvContent = new TextDecoder('utf-8').decode(buffer)

    // Parse CSV
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    })

    if (records.length === 0) {
      return NextResponse.json({ error: 'CSV file is empty' }, { status: 400 })
    }

    // Validate each row
    const validationResult: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      summary: {
        totalRows: records.length,
        validRows: 0,
        invalidRows: 0
      },
      validData: []
    }

    for (let i = 0; i < records.length; i++) {
      const row = records[i]
      const rowNumber = i + 2 // +2 because of 0-indexing and header row

      try {
        const validatedRow = csvRowSchema.parse(row)

        // Check if city exists or can be created
        let city = await prisma.city.findFirst({
          where: {
            OR: [
              { slug: validatedRow.city.toLowerCase().replace(/\s+/g, '-') },
              { name: { equals: validatedRow.city } }
            ]
          }
        })

        if (!city) {
          // Try to create city with basic info
          try {
            city = await prisma.city.create({
              data: {
                name: validatedRow.city,
                slug: validatedRow.city.toLowerCase().replace(/\s+/g, '-'),
                country: validatedRow.country || 'Unknown',
                lat: validatedRow.latitude,
                lng: validatedRow.longitude
              }
            })
            validationResult.warnings.push({
              row: rowNumber,
              field: 'city',
              message: `City "${validatedRow.city}" was created`
            })
          } catch {
            validationResult.errors.push({
              row: rowNumber,
              field: 'city',
              message: `Could not create city "${validatedRow.city}"`
            })
            validationResult.isValid = false
            validationResult.summary.invalidRows++
            continue
          }
        }

        // Check for duplicate places
        const existingPlace = await prisma.place.findFirst({
          where: {
            name: { equals: validatedRow.name },
            cityId: city.id
          }
        })

        if (existingPlace) {
          validationResult.warnings.push({
            row: rowNumber,
            field: 'name',
            message: `Place "${validatedRow.name}" already exists and will be updated`
          })
        }

        validationResult.validData!.push({
          ...validatedRow,
          cityId: city.id,
          rowNumber
        })

        validationResult.summary.validRows++

      } catch (error) {
        if (error instanceof z.ZodError) {
          error.issues.forEach((err: z.ZodIssue) => {
            validationResult.errors.push({
              row: rowNumber,
              field: err.path.join('.'),
              message: err.message
            })
          })
        } else {
          validationResult.errors.push({
            row: rowNumber,
            field: 'general',
            message: error instanceof Error ? error.message : 'Unknown error'
          })
        }
        validationResult.isValid = false
        validationResult.summary.invalidRows++
      }
    }

    // Create ingest job record
    const job = await prisma.ingestJob.create({
      data: {
        filename: file.name,
        status: validationResult.isValid ? 'validated' : 'failed',
        totalRows: validationResult.summary.totalRows,
        validRows: validationResult.summary.validRows,
        invalidRows: validationResult.summary.invalidRows,
        validationErrors: validationResult.errors,
        validationWarnings: validationResult.warnings,
        validData: validationResult.validData,
        createdBy: session.user.id
      }
    })

    return NextResponse.json({
      job: {
        id: job.id,
        filename: job.filename,
        status: job.status,
        createdAt: job.createdAt
      },
      validationResult
    })

  } catch (error) {
    console.error('Ingest validation API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
