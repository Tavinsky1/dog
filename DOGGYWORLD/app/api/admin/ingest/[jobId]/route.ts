import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { normalizeRow, streamCsv } from '@/lib/csv'

export async function POST(req: Request, { params }: { params: { jobId: string } }){
  const session = await auth()
  if ((session?.user as any)?.role !== 'editor' && (session?.user as any)?.role !== 'admin')
    return new NextResponse('Forbidden', { status: 403 })

  const form = await req.formData()
  const file = form.get('file') as File
  const buf = Buffer.from(await file.arrayBuffer())

  const tx:any[] = []
  for await (const rec of await streamCsv(buf)){
    const row = normalizeRow(rec)
    // Find or create city
    let city = await prisma.city.findFirst({
      where: { name: row.city, country: row.country }
    })
    if (!city) {
      const citySlug = row.city.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      city = await prisma.city.create({
        data: {
          name: row.city,
          slug: citySlug,
          country: row.country,
          region: row.region || undefined,
          lat: row.latitude,
          lng: row.longitude
        }
      })
    }
    // Generate slug for place
    const placeSlug = row.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    tx.push(prisma.place.upsert({
      where: { id: row.id! },
      update: {
        name: row.name, type: row.type as any, region: row.region || undefined, country: row.country,
        lat: row.latitude, lng: row.longitude, shortDescription: row.short_description,
        fullDescription: row.full_description || undefined, imageUrl: row.image_url || undefined,
        gallery: row.gallery_urls || [], dogFriendlyLevel: row.dog_friendly_level || undefined,
        amenities: row.amenities || [], rules: row.rules || undefined, websiteUrl: row.website_url || undefined,
        phone: row.contact_phone || undefined, email: row.contact_email || undefined,
        priceRange: row.price_range || undefined, openingHours: row.opening_hours || undefined,
        rating: row.rating || undefined, tags: row.tags || []
      },
      create: {
        id: row.id!, slug: placeSlug, name: row.name, type: row.type as any, cityId: city.id,
        region: row.region || undefined, country: row.country,
        lat: row.latitude, lng: row.longitude, shortDescription: row.short_description,
        fullDescription: row.full_description || undefined, imageUrl: row.image_url || undefined,
        gallery: row.gallery_urls || [], dogFriendlyLevel: row.dog_friendly_level || undefined,
        amenities: row.amenities || [], rules: row.rules || undefined, websiteUrl: row.website_url || undefined,
        phone: row.contact_phone || undefined, email: row.contact_email || undefined,
        priceRange: row.price_range || undefined, openingHours: row.opening_hours || undefined,
        rating: row.rating || undefined, tags: row.tags || []
      }
    }))
  }
  await prisma.$transaction(tx)
  return NextResponse.json({ ok: true, count: tx.length })
}