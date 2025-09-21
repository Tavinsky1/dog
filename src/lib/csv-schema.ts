import { z } from 'zod'

// CSV v0.7 Schema
export const csvRowSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['trail', 'park', 'cafe', 'vet', 'grooming', 'activity', 'beach', 'hotel', 'store', 'event']),
  city: z.string().min(1, 'City is required'),
  region: z.string().optional(),
  country: z.string().min(1, 'Country is required'),
  latitude: z.string().transform(val => parseFloat(val)).refine(val => !isNaN(val) && val >= -90 && val <= 90, 'Invalid latitude'),
  longitude: z.string().transform(val => parseFloat(val)).refine(val => !isNaN(val) && val >= -180 && val <= 180, 'Invalid longitude'),
  short_description: z.string().optional(),
  full_description: z.string().optional(),
  image_url: z.string().url().optional().or(z.literal('')),
  gallery_urls: z.string().optional(),
  dog_friendly_level: z.string().transform(val => parseInt(val)).refine(val => val >= 1 && val <= 5, 'Dog friendly level must be 1-5').optional(),
  amenities: z.string().optional(),
  rules: z.string().optional(),
  website_url: z.string().url().optional().or(z.literal('')),
  contact_phone: z.string().optional(),
  contact_email: z.string().email().optional().or(z.literal('')),
  price_range: z.string().optional(),
  opening_hours: z.string().optional(),
  rating: z.string().transform(val => parseFloat(val)).refine(val => val >= 0 && val <= 5, 'Rating must be 0-5').optional(),
  tags: z.string().optional(),
})

// Validation result type
export type CsvValidationResult = {
  row: number
  field: string
  reason: string
}

export type CsvRow = z.infer<typeof csvRowSchema>