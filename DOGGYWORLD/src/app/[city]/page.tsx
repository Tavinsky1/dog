import { prisma } from '@/lib/prisma'
import Map from '@/components/Map'

export default async function CityPage({
  params,
  searchParams
}: {
  params: { city: string }
  searchParams: any
}) {
  const city = await prisma.city.findFirst({
    where: { slug: params.city, active: true }
  })

  if (!city) {
    return <main className="container mx-auto p-6">City not found</main>
  }

  const where: any = { cityId: city.id }

  if (searchParams.type) where.type = searchParams.type
  if (searchParams.q) {
    where.OR = [
      { name: { contains: searchParams.q, mode: 'insensitive' } },
      { shortDescription: { contains: searchParams.q, mode: 'insensitive' } }
    ]
  }

  const places = await prisma.place.findMany({
    where,
    include: { city: true },
    orderBy: { name: 'asc' },
    take: 50
  })

  return (
    <main className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">{city.name}</h1>

      <Map places={places.map((p: any) => ({
        id: p.id,
        name: p.name,
        type: p.type,
        lat: p.lat,
        lng: p.lng
      }))} />

      <div className="grid md:grid-cols-2 gap-4">
        {places.map((place: any) => (
          <a
            key={place.id}
            href={`/${params.city}/p/${place.slug}`}
            className="rounded-xl border p-4 hover:shadow"
          >
            <div className="text-base font-semibold">{place.name}</div>
            <div className="text-xs uppercase text-gray-500">{place.type}</div>
            <div className="text-sm mt-1">{place.shortDescription}</div>
          </a>
        ))}
      </div>
    </main>
  )
}