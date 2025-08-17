import Image from "next/image";
import Link from "next/link";
import Hero from "@/components/Hero";
import CategoryCard from "@/components/CategoryCard";
import Stat from "@/components/Stat";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CATEGORIES = [
  { 
    key: "cafe_restaurant_bar", 
    title: "Cafes & Restaurants", 
    image: "https://images.unsplash.com/photo-1453614512568-c4024d13c247" 
  },
  { 
    key: "park_offleash_area", 
    title: "Parks & Dog Runs", 
    image: "https://images.unsplash.com/photo-1508672019048-805c876b67e2" 
  },
  { 
    key: "lake_swim", 
    title: "Lakes & Swim Spots", 
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb" 
  },
  { 
    key: "trail_hike", 
    title: "Forest Trails", 
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470" 
  },
];

export default async function Home() {
  const placesCount = await prisma.place.count({ where: { status: "published" } });
  const berlinCount = await prisma.place.count({ where: { status: "published", city: "Berlin" } });

  return (
    <div className="space-y-8">
      <Hero
        title="Find dog-friendly places"
        subtitle="Discover parks, cafés, trails and venues that welcome you and your dog. Start with Berlin and help build the global DogAtlas."
        cta={
          <div className="flex flex-wrap gap-2">
            <Link href="/berlin" className="inline-flex items-center px-4 py-2 rounded-md bg-brand-500 text-white hover:bg-brand-600">
              Explore Berlin
            </Link>
            <Link href="/submit" className="inline-flex items-center px-4 py-2 rounded-md border hover:bg-white">
              Add a place
            </Link>
          </div>
        }
      />

      {/* Stats strip */}
      <div className="grid md:grid-cols-3 gap-3">
        <Stat icon={"🐾"} label="Places worldwide" value={`${placesCount.toLocaleString()}+`} />
        <Stat icon={"🏙️"} label="Berlin listings" value={`${berlinCount}`} />
        <Stat icon={"⭐"} label="Community reviews" value="Growing daily" />
      </div>

      {/* City highlight */}
      <section className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 rounded-2xl overflow-hidden border bg-white">
          <Image
            src="https://images.unsplash.com/photo-1526481280698-8fcc13fd6042"
            alt="Berlin"
            width={800} height={600} className="h-44 w-full object-cover"
          />
          <div className="p-4">
            <div className="text-xs uppercase tracking-wide text-ink-300">City spotlight</div>
            <h2 className="text-xl font-bold mt-1">Berlin</h2>
            <p className="text-sm text-ink-300">Germany&apos;s dog-friendly capital</p>
            <Link href="/berlin" className="inline-block mt-3 text-brand-600 underline">Browse Berlin</Link>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="grid sm:grid-cols-2 gap-4">
            {CATEGORIES.map((c) => (
              <CategoryCard
                key={c.key}
                href={`/berlin/c/${c.key}`}
                title={c.title}
                subtitle="Curated by locals"
                imageUrl={c.image}
              />
            ))}
          </div>
          <div className="mt-3 text-sm text-ink-300">More categories in Berlin → <Link className="underline" href="/berlin">see all</Link></div>
        </div>
      </section>

      {/* Coming soon strip */}
      <section className="rounded-2xl p-6 border bg-white flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-wide text-ink-300">More cities</div>
          <div className="text-lg font-semibold">Global rollout coming next</div>
          <div className="text-sm text-ink-300">Vote for your city and help us seed the best places.</div>
        </div>
        <Link href="/signup" className="px-4 py-2 rounded-md border hover:bg-gray-50">Get notified</Link>
      </section>
    </div>
  );
}
      
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        <Link href="/berlin" className="group border rounded-2xl p-6 hover:shadow-soft transition-shadow bg-white">
          <div className="text-2xl mb-3">🏙️</div>
          <div className="font-semibold text-lg group-hover:text-brand-600">Berlin</div>
          <div className="text-sm text-ink-300">Germany's dog-friendly capital</div>
          <div className="text-xs text-brand-600 mt-2">2+ places</div>
        </Link>
        
        <div className="border rounded-2xl p-6 bg-gray-50 opacity-50">
          <div className="text-2xl mb-3">🌍</div>
          <div className="font-semibold text-lg">More cities</div>
          <div className="text-sm text-ink-300">Coming soon</div>
        </div>
        
        <div className="border rounded-2xl p-6 bg-gray-50 opacity-50">
          <div className="text-2xl mb-3">📱</div>
          <div className="font-semibold text-lg">Mobile app</div>
          <div className="text-sm text-ink-300">In development</div>
        </div>
      </div>
    </div>
  );
}
