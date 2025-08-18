import Image from "next/image";
import Link from "next/link";
import Hero from "@/components/Hero";
import CategoryCard from "@/components/CategoryCard";
import Stat from "@/components/Stat";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Category data - using dog-focused images with better proportions
const CAFE_IMG = "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500&h=300&fit=crop&crop=center";
const PARK_IMG = "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500&h=300&fit=crop&crop=center";
const LAKE_IMG = "https://images.unsplash.com/photo-1544568100-847a948585b9?w=500&h=300&fit=crop&crop=center";
const TRAIL_IMG = "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&h=300&fit=crop&crop=center";

const CATEGORIES = [
  { 
    key: "cafe_restaurant_bar", 
    title: "Paws & Patios", 
    description: "Dog-friendly cafés, restaurants & bars with outdoor seating",
    image: CAFE_IMG 
  },
  { 
    key: "park_offleash_area", 
    title: "Parks & Play", 
    description: "Off-leash areas, dog parks & recreational spaces",
    image: PARK_IMG 
  },
  { 
    key: "lake_swim", 
    title: "Splash & Swim", 
    description: "Lakes, beaches & swimming spots for water-loving dogs",
    image: LAKE_IMG 
  },
  { 
    key: "trail_hike", 
    title: "Trails & Treks", 
    description: "Hiking trails, forest paths & scenic walking routes",
    image: TRAIL_IMG 
  },
];

export default async function Home() {
  const placesCount = await prisma.place.count({ where: { status: "published" } });
  const berlinCount = await prisma.place.count({ where: { status: "published", city: "Berlin" } });

  return (
    <div className="space-y-8">
      <Hero 
        title="Find Amazing Dog-Friendly Places"
        subtitle="Discover the best spots in your city where you and your furry friend are both welcome"
      />
      
      {/* Categories Grid */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Explore Categories</h2>
          <p className="text-gray-600">Find the perfect spots for you and your furry friend</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((category) => (
            <CategoryCard
              key={category.key}
              title={category.title}
              subtitle={category.description}
              imageUrl={category.image}
              href={`/berlin?category=${category.key}`}
              category={category.key}
            />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-amber-200">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">DogAtlas by the Numbers</h2>
          <p className="text-gray-600">Growing community of dog lovers</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <Stat 
            value={placesCount.toString()} 
            label="Dog-Friendly Places" 
            icon="🏞️" 
          />
          <Stat 
            value={berlinCount.toString()} 
            label="Berlin Locations" 
            icon="🐕" 
          />
        </div>
      </section>
    </div>
  );
}


