import { prisma } from '@/lib/prisma'

export default async function PlacePage({
  params
}: {
  params: { city: string; slug: string }
}) {
  const place = await prisma.place.findFirst({
    where: { slug: params.slug },
    include: { city: true }
  })

  if (!place) {
    return <main className="container mx-auto p-6">Not found</main>
  }

  return (
    <main className="container mx-auto p-6 space-y-4">
      <h1 className="text-3xl font-bold">{place.name}</h1>
      <p className="text-sm text-gray-600">{place.city.name}, {place.country}</p>
      <p>{place.fullDescription || place.shortDescription}</p>
      <div className="text-sm">
        <b>Rules:</b> {place.rules || '—'} · <b>Amenities:</b> {place.amenities.join(', ') || '—'}
      </div>
      <div className="text-sm">
        <b>Hours:</b> {place.openingHours || '—'} · <b>Contacts:</b> {place.websiteUrl || '—'}
      </div>
    </main>
  )
}