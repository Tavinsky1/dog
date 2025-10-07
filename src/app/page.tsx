import Link from "next/link";
import Hero from "@/components/Hero";
import Stat from "@/components/Stat";
import CitySelector from "@/components/CitySelector";
import { prisma } from "@/lib/prisma";
// import { CATEGORY_GROUPS, getAllGroupsOrdered, getCategoriesByGroup } from "@/lib/categories";

const FEATURE_CARDS = [
  {
    title: "Parks & Nature",
    description: "Discover dog parks, green areas, and off-leash zones where your pup can play.",
    icon: "�️",
    categories: ["parks"]
  },
  {
    title: "Cafés & Restaurants",
    description: "Dog-friendly cafés and restaurants that welcome you and your furry friend.",
    icon: "☕",
    categories: ["cafes_restaurants"]
  },
  {
    title: "Walks & Trails",
    description: "Urban walks, hiking paths, and beaches for your daily adventures.",
    icon: "🚶",
    categories: ["walks_trails"]
  },
  {
    title: "Services & Shops",
    description: "Vets, groomers, pet stores, and all the services you need.",
    icon: "�️",
    categories: ["shops_services"]
  },
];

export default async function Home() {
  const [placesCount, activeCities] = await Promise.all([
    prisma.place.count(),
    prisma.city.findMany({
      where: { active: true },
      orderBy: { name: "asc" },
      select: {
        id: true,
        slug: true,
        name: true,
        country: true,
        _count: {
          select: {
            places: true,
          },
        },
      },
    }),
  ]);

  return (
    <div className="space-y-16">
      <Hero
        title="DogAtlas"
        subtitle="The easiest way to explore dog-friendly trails, cafés, services, and activities in cities around the world."
        cta={
          <>
            <Link href="#cities" className="btn-primary">
              Explore cities
            </Link>
            <CitySelector />
          </>
        }
      />

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {FEATURE_CARDS.map((feature) => (
          <div key={feature.title} className="card-hover p-6 text-left">
            <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{feature.description}</p>
          </div>
        ))}
      </section>

      <section className="rounded-3xl border border-blue-100 bg-white p-8 shadow-sm">
        <div className="text-center">
          <h2 className="heading-lg">DogAtlas at a glance</h2>
          <p className="mt-2 text-slate-600">Curated by people who explore cities with their dogs every day</p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <Stat icon={<span aria-hidden="true">🏙️</span>} label="Active cities" value={activeCities.length.toString()} />
          <Stat icon={<span aria-hidden="true">🏞️</span>} label="Dog-friendly places" value={placesCount.toString()} />
        </div>
      </section>

      <section id="cities" className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="heading-lg">Featured cities</h2>
            <p className="text-sm text-slate-600">Pick a city to see curated dog-friendly places, maps, and itineraries.</p>
          </div>
          <Link href="/submit" className="btn-secondary">
            Suggest a city
          </Link>
        </div>

        {activeCities.length === 0 ? (
          <div className="card p-6 text-center text-sm text-slate-500">
            We are setting up our first cities. Check back soon or suggest your city to kick things off.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {activeCities.map((city) => (
              <Link
                key={city.id}
                href={`/${city.slug}`}
                className="card-hover flex items-start justify-between gap-4 p-6"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">{city.country}</p>
                  <h3 className="mt-1 text-2xl font-display font-bold text-slate-900">{city.name}</h3>
                  <p className="mt-4 text-sm text-slate-600">
                    {city._count.places} dog-friendly spots shared by locals.
                  </p>
                </div>
                <span className="text-xl text-blue-500" aria-hidden="true">
                  →
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
