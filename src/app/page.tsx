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
    icon: "🏞️",
    image: "https://images.unsplash.com/photo-1568393691622-c7ba131d63b4?auto=format&fit=crop&w=800&q=80",
    categories: ["parks"]
  },
  {
    title: "Cafés & Restaurants",
    description: "Dog-friendly cafés and restaurants that welcome you and your furry friend.",
    icon: "☕",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80",
    categories: ["cafes_restaurants"]
  },
  {
    title: "Walks & Trails",
    description: "Urban walks, hiking paths, and beaches for your daily adventures.",
    icon: "🚶",
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=800&q=80",
    categories: ["walks_trails"]
  },
  {
    title: "Services & Shops",
    description: "Vets, groomers, pet stores, and all the services you need.",
    icon: "🛍️",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80",
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
            <Link 
              href="#cities" 
              className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-blue-900 bg-white rounded-full hover:bg-amber-50 hover:scale-105 transition-all shadow-lg hover:shadow-xl"
            >
              Explore Cities
              <span className="ml-2">→</span>
            </Link>
            <div className="hidden sm:block">
              <CitySelector />
            </div>
          </>
        }
      />

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {FEATURE_CARDS.map((feature) => (
          <div key={feature.title} className="group relative overflow-hidden rounded-2xl border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            {/* Image Background */}
            <div className="relative h-48 overflow-hidden">
              <img 
                src={feature.image} 
                alt={feature.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              {/* Icon Badge */}
              <div className="absolute top-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-lg">
                <span className="text-2xl">{feature.icon}</span>
              </div>
            </div>
            
            {/* Content */}
            <div className="bg-white p-6">
              <h3 className="text-lg font-bold text-slate-900">{feature.title}</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">{feature.description}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="space-y-8">
        {/* Section Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100/50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-blue-700 backdrop-blur-sm mb-4">
            <span>🌍</span>
            Community Driven
          </div>
          <h2 className="text-4xl font-display font-extrabold text-slate-900 sm:text-5xl">DogAtlas at a glance</h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">Curated by people who explore cities with their dogs every day</p>
        </div>
        
        {/* Stats Cards with Background Images */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {/* Active Cities Card */}
          <div className="group relative overflow-hidden rounded-2xl border-2 border-blue-200 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:border-blue-400">
            {/* Background Image */}
            <img 
              src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=800&q=80" 
              alt="City Skylines"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            
            {/* Content */}
            <div className="relative z-10 p-8 text-center flex flex-col items-center justify-center h-full min-h-[200px]">
              <div className="text-sm font-bold uppercase tracking-wider text-white mb-3" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
                Active cities
              </div>
              <div className="text-6xl font-extrabold font-display text-white mb-3" style={{ textShadow: '0 4px 12px rgba(0,0,0,0.8)' }}>
                {activeCities.length}
              </div>
              <div className="text-sm text-white" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>and growing</div>
            </div>
          </div>
          
          {/* Dog-Friendly Places Card */}
          <div className="group relative overflow-hidden rounded-2xl border-2 border-amber-200 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:border-amber-400">
            {/* Background Image */}
            <img 
              src="https://images.unsplash.com/photo-1444212477490-ca407925329e?auto=format&fit=crop&w=800&q=80" 
              alt="Dog in Park"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            
            {/* Content */}
            <div className="relative z-10 p-8 text-center flex flex-col items-center justify-center h-full min-h-[200px]">
              <div className="text-sm font-bold uppercase tracking-wider text-white mb-3" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
                Dog-friendly places
              </div>
              <div className="text-6xl font-extrabold font-display text-white mb-3" style={{ textShadow: '0 4px 12px rgba(0,0,0,0.8)' }}>
                {placesCount}
              </div>
              <div className="text-sm text-white" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>curated spots</div>
            </div>
          </div>
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
            {activeCities.map((city) => {
              // Map city landmarks
              const cityImages: Record<string, string> = {
                'rome': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80', // Colosseum
                'paris': 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=800&q=80', // Eiffel Tower
                'berlin': 'https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=800&q=80', // TV Tower
                'barcelona': 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=800&q=80', // Sagrada Familia
              };
              
              return (
                <Link
                  key={city.id}
                  href={`/${city.slug}`}
                  className="group relative overflow-hidden rounded-3xl border border-slate-200 shadow-md transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                >
                  {/* Background Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={cityImages[city.slug] || 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80'}
                      alt={`${city.name} landmark`}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    
                    {/* Content Overlay */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                      <p className="text-xs font-semibold uppercase tracking-wide text-amber-300">{city.country}</p>
                      <h3 className="mt-2 text-3xl font-display font-bold text-white">{city.name}</h3>
                      <p className="mt-3 text-sm text-white/90">
                        {city._count.places} dog-friendly spots shared by locals
                      </p>
                      
                      {/* Arrow Button */}
                      <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-white">
                        <span>Explore</span>
                        <span className="text-lg transition-transform group-hover:translate-x-1">→</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
