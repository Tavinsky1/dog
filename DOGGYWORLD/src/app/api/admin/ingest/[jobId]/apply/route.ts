import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { normalizeRow, streamCsv } from '@/lib/csv'

export async function POST(
  request: Request,
  { params }: { params: { jobId: string } }
) {
  try {
    const session = await auth()
    const userRole = (session?.user as any)?.role

    if (userRole !== 'editor' && userRole !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    const operations: any[] = []

    for await (const record of streamCsv(buffer)) {
      const row = normalizeRow(record)

      operations.push(
        prisma.place.upsert({
          where: { id: row.id! },
          update: {
            name: row.name,
            type: row.type as any,
            region: row.region || undefined,
            country: row.country,
            lat: row.latitude,
            lng: row.longitude,
            shortDescription: row.short_description,
            fullDescription: row.full_description || undefined,
            imageUrl: row.image_url || undefined,
            gallery: row.gallery_urls || [],
            dogFriendlyLevel: row.dog_friendly_level || undefined,
            amenities: row.amenities || [],
            rules: row.rules || undefined,
            websiteUrl: row.website_url || undefined,
            phone: row.contact_phone || undefined,
            email: row.contact_email || undefined,
            priceRange: row.price_range || undefined,
            openingHours: row.opening_hours || undefined,
            rating: row.rating || undefined,
            tags: row.tags || []
          },
          create: {
            id: row.id!,
            slug: row.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            name: row.name,
            type: row.type as any,
            city: {
              connectOrCreate: {
                where: { slug: row.city.toLowerCase() },
                create: {
                  slug: row.city.toLowerCase(),
                  name: row.city,
                  country: row.country,
                  lat: row.latitude,
                  lng: row.longitude
                }
              }
            },
            region: row.region || undefined,
            country: row.country,
            lat: row.latitude,
            lng: row.longitude,
            shortDescription: row.short_description,
            fullDescription: row.full_description || undefined,
            imageUrl: row.image_url || undefined,
            gallery: row.gallery_urls || [],
            dogFriendlyLevel: row.dog_friendly_level || undefined,
            amenities: row.amenities || [],
            rules: row.rules || undefined,
            websiteUrl: row.website_url || undefined,
            phone: row.contact_phone || undefined,
            email: row.contact_email || undefined,
            priceRange: row.price_range || undefined,
            openingHours: row.opening_hours || undefined,
            rating: row.rating || undefined,
            tags: row.tags || []
          }
        })
      )
    }

    await prisma.$transaction(operations)

    return NextResponse.json({
      ok: true,
      upserts: operations.length
    })
  } catch (error) {
    console.error('Ingest apply API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}