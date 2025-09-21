import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import PlaceCard from '@/components/PlaceCard';
import CityMap from '@/components/Map';
import Filters from '@/components/Filters';

export async function generateMetadata({ params }: { params: { city: string } }): Promise<Metadata> {
  const city = await prisma.city.findUnique({ where: { slug: params.city, active: true } });
  if (!city) {
    return { title: 'City Not Found' };
  }
  return {
    title: `${city.name} - DOGGYWORLD`,
    description: `Find dog-friendly places, parks, and trails in ${city.name}, ${city.country}.`,
    openGraph: {
      title: `${city.name} - DOGGYWORLD`,
      description: `Explore dog-friendly spots in ${city.name}.`,
    },
  };
}

export default async function CityPage({
  params,
  searchParams,
}: {
  params: { city: string };
  searchParams: { q?: string; type?: string; amenities?: string; tags?: string; minLevel?: string; price?: string };
}) {
  const city = await prisma.city.findFirst({
    where: { slug: params.city, active: true },
    include: { places: true },
  });
  if (!city) {
    return notFound();
  }

  const where: any = { cityId: city.id };
  if (searchParams.type) {
    where.type = searchParams.type;
  }
  if (searchParams.q) {
    where.OR = [
      { name: { contains: searchParams.q, mode: 'insensitive' } },
      { shortDescription: { contains: searchParams.q, mode: 'insensitive' } },
      { fullDescription: { contains: searchParams.q, mode: 'insensitive' } }
    ];
  }
  if (searchParams.amenities) {
    const amenitiesArray = searchParams.amenities.split(',').map(s => s.trim());
    where.amenities = { contains: amenitiesArray.join(','), mode: 'insensitive' };
  }

  const items = await prisma.place.findMany({
    where,
    include: { city: true },
    orderBy: { name: 'asc' },
    take: 50,
  });

  return (
    <main className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">{city.name}</h1>
      <Filters />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-1">
          <CityMap items={items.map(p => ({ id: p.id, name: p.name, type: p.type, lat: p.lat, lng: p.lng }))} />
        </div>
        <div className="md:col-span-1 space-y-4">
          {items.length > 0 ? (
            items.map((p) => <PlaceCard key={p.id} place={p} />)
          ) : (
            <p className="text-gray-500">No places found with these filters.</p>
          )}
        </div>
      </div>
    </main>
  );
}