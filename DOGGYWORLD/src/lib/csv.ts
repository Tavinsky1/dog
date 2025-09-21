import { parse } from 'csv-parse'
import { z } from 'zod'
import { v5 as uuidv5 } from 'uuid'

const NAMESPACE = uuidv5('doggyworld.app/schema/v0.7', uuidv5.DNS)

export const CSV_HEADERS = [
  'id','name','type','city','region','country','latitude','longitude','short_description','full_description','image_url','gallery_urls','dog_friendly_level','amenities','rules','website_url','contact_phone','contact_email','price_range','opening_hours','rating','tags'
] as const

const Row = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  type: z.enum(['trail','park','cafe','vet','grooming','activity','beach','hotel','store','event']),
  city: z.string().min(1),
  region: z.string().optional().nullable(),
  country: z.string().min(1),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  short_description: z.string().min(1),
  full_description: z.string().optional().nullable(),
  image_url: z.string().url().optional().nullable(),
  gallery_urls: z.array(z.string()).optional(),
  dog_friendly_level: z.coerce.number().int().min(1).max(5).optional().nullable(),
  amenities: z.array(z.string()).optional(),
  rules: z.string().optional().nullable(),
  website_url: z.string().url().optional().nullable(),
  contact_phone: z.string().optional().nullable(),
  contact_email: z.string().email().optional().nullable(),
  price_range: z.string().optional().nullable(),
  opening_hours: z.string().optional().nullable(),
  rating: z.coerce.number().min(0).max(5).optional().nullable(),
  tags: z.array(z.string()).optional()
})

export async function* streamCsv(file: Buffer) {
  const parser = parse(file, { bom: true, columns: true, trim: true })
  for await (const rec of parser) yield rec as Record<string, string>
}

export function normalizeRow(rec: Record<string, string>) {
  const row: any = {}; for (const h of CSV_HEADERS) row[h] = rec[h] ?? ''
  if (!row.id) {
    const basis = `${row.name}|${row.city}|${row.country}|${row.latitude}|${row.longitude}`
    row.id = uuidv5(basis, NAMESPACE)
  }
  row.gallery_urls = row.gallery_urls ? row.gallery_urls.split(';').map((s: string)=>s.trim()).filter(Boolean) : []
  row.amenities = row.amenities ? row.amenities.split(',').map((s: string)=>s.trim()).filter(Boolean) : []
  row.tags = row.tags ? row.tags.split(',').map((s: string)=>s.trim()).filter(Boolean) : []
  return Row.parse(row)
}