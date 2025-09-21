import { z } from 'zod'
import { csvRowSchema, type CsvValidationResult, type CsvRow } from './csv-schema'
import { v5 as uuidv5 } from 'uuid'

// UUID v5 namespace for deterministic ID generation
const UUID_NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8'

export function validateCsvRows(csvData: string[][]): {
  valid: CsvRow[]
  errors: CsvValidationResult[]
} {
  const valid: CsvRow[] = []
  const errors: CsvValidationResult[] = []

  // Skip header row (index 0)
  for (let i = 1; i < csvData.length; i++) {
    const row = csvData[i]

    if (row.length === 0 || row.every(cell => !cell.trim())) {
      continue // Skip empty rows
    }

    try {
      // Parse row into object
      const rowData = {
        id: row[0]?.trim() || undefined,
        name: row[1]?.trim(),
        type: row[2]?.trim(),
        city: row[3]?.trim(),
        region: row[4]?.trim() || undefined,
        country: row[5]?.trim(),
        latitude: row[6]?.trim(),
        longitude: row[7]?.trim(),
        short_description: row[8]?.trim() || undefined,
        full_description: row[9]?.trim() || undefined,
        image_url: row[10]?.trim() || undefined,
        gallery_urls: row[11]?.trim() || undefined,
        dog_friendly_level: row[12]?.trim() || undefined,
        amenities: row[13]?.trim() || undefined,
        rules: row[14]?.trim() || undefined,
        website_url: row[15]?.trim() || undefined,
        contact_phone: row[16]?.trim() || undefined,
        contact_email: row[17]?.trim() || undefined,
        price_range: row[18]?.trim() || undefined,
        opening_hours: row[19]?.trim() || undefined,
        rating: row[20]?.trim() || undefined,
        tags: row[21]?.trim() || undefined,
      }

      // Validate with Zod
      const validatedRow = csvRowSchema.parse(rowData)

      // Generate deterministic ID if not provided
      if (!validatedRow.id) {
        validatedRow.id = uuidv5(
          `${validatedRow.name}|${validatedRow.city}|${validatedRow.country}|${validatedRow.latitude}|${validatedRow.longitude}`,
          UUID_NAMESPACE
        )
      }

      valid.push(validatedRow)
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.issues.forEach((err: z.ZodIssue) => {
          errors.push({
            row: i + 1, // 1-indexed
            field: err.path.join('.'),
            reason: err.message,
          })
        })
      } else {
        errors.push({
          row: i + 1,
          field: 'unknown',
          reason: 'Validation failed',
        })
      }
    }
  }

  return { valid, errors }
}

export function parseCsvData(csvText: string): string[][] {
  const lines = csvText.split('\n').filter(line => line.trim())
  return lines.map(line => {
    const result = []
    let current = ''
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]

      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          // Escaped quote
          current += '"'
          i++ // Skip next quote
        } else {
          // Toggle quote state
          inQuotes = !inQuotes
        }
      } else if (char === ',' && !inQuotes) {
        // Field separator
        result.push(current)
        current = ''
      } else {
        current += char
      }
    }

    // Add the last field
    result.push(current)

    return result
  })
}