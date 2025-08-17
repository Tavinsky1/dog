"use client";

import CategoryCard from "@/components/CategoryCard";
import Hero from "@/components/Hero";
import { useEffect, useState } from "react";

const categories = [
  { 
    key: "cafe_restaurant_bar", 
    title: "Cafes & Restaurants", 
    description: "Dog-friendly dining spots with outdoor seating",
    image: "https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=400&h=240&fit=crop&crop=center" 
  },
  { 
    key: "park_offleash_area", 
    title: "Parks & Dog Runs", 
    description: "Off-leash areas and recreational spaces",
    image: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=400&h=240&fit=crop&crop=center" 
  },
  { 
    key: "lake_swim", 
    title: "Lakes & Swim Spots", 
    description: "Water activities and swimming areas",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=240&fit=crop&crop=center" 
  },
  { 
    key: "trail_hike", 
    title: "Forest Trails", 
    description: "Hiking paths and nature walks",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=240&fit=crop&crop=center" 
  },
  { 
    key: "pet_store_boutique", 
    title: "Pet Stores", 
    description: "Pet supplies and boutique shops",
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=240&fit=crop&crop=center" 
  },
  { 
    key: "vet_clinic_hospital", 
    title: "Veterinary Services", 
    description: "Clinics, hospitals and emergency care",
    image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=400&h=240&fit=crop&crop=center" 
  },
  { 
    key: "dog_groomer", 
    title: "Dog Groomers", 
    description: "Professional grooming and spa services",
    image: "https://images.unsplash.com/photo-1544717684-7ad52a7bf8e1?w=400&h=240&fit=crop&crop=center" 
  },
  { 
    key: "dog_hotel_boarding", 
    title: "Dog Hotels", 
    description: "Boarding, daycare and accommodation",
    image: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=240&fit=crop&crop=center" 
  },
  { 
    key: "dog_walker_trainer", 
    title: "Trainers & Walkers", 
    description: "Professional training and walking services",
    image: "https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?w=400&h=240&fit=crop&crop=center" 
  },
];

export default function BerlinLanding() {
  const [counts, setCounts] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    async function fetchCounts() {
      try {
        const response = await fetch('/api/places/counts?city=Berlin');
        const data = await response.json();
        const countMap = new Map<string, number>();
        Object.entries(data).forEach(([key, value]) => {
          if (typeof value === 'number') {
            countMap.set(key, value);
          }
        });
        setCounts(countMap);
      } catch (error) {
        console.error('Failed to fetch counts:', error);
      }
    }
    fetchCounts();
  }, []);

  return (
    <div className="space-y-8">
      <Hero
        title="Dog-friendly Berlin"
        subtitle="Discover the best places for you and your dog in Germany's capital. From cozy cafés to sprawling parks."
        cta={
          <div className="flex gap-3">
            <a href="/berlin/map" className="px-4 py-2 bg-brand-500 text-white rounded-md hover:bg-brand-600">
              View on Map
            </a>
            <a href="/submit" className="px-4 py-2 border rounded-md hover:bg-gray-50">
              Add a place
            </a>
          </div>
        }
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <CategoryCard
            key={category.key}
            href={`/berlin/c/${category.key}`}
            title={category.title}
            subtitle={category.description}
            imageUrl={category.image}
            count={counts.get(category.key)}
          />
        ))}
      </div>
    </div>
  );
}
