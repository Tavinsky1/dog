// src/app/berlin/categories/page.tsx
import Link from 'next/link';
import { MapPin, Trees, Coffee, Store, Heart, Stethoscope, Scissors, Building, Users } from 'lucide-react';
import { CATEGORY_NAMES, type Category } from '@/lib/import/schemas';
import { prisma } from '@/lib/prisma';
import Hero from '@/components/Hero';

const CATEGORY_ICONS: Record<Category, any> = {
  trail_hike: Trees,
  lake_swim: MapPin,
  cafe_restaurant_bar: Coffee,
  park_offleash_area: Trees,
  pet_store_boutique: Store,
  vet_clinic_hospital: Stethoscope,
  dog_groomer: Scissors,
  dog_hotel_boarding: Building,
  dog_walker_trainer: Users,
};

async function getCategoryCounts() {
  const counts = await prisma.place.groupBy({
    by: ['category'],
    where: {
      city: 'berlin',
      status: 'approved'
    },
    _count: {
      id: true
    }
  });

  return counts.reduce((acc, item) => {
    acc[item.category] = item._count.id;
    return acc;
  }, {} as Record<string, number>);
}

export default async function CategoriesPage() {
  const categoryCounts = await getCategoryCounts();
  const categories = Object.keys(CATEGORY_NAMES) as Category[];

  return (
    <div className="min-h-screen bg-gray-50">
      <Hero
        title="Browse by Category"
        subtitle="Find the perfect dog-friendly places in Berlin by category"
        cta={
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/berlin"
              className="px-6 py-3 bg-white text-brand-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors shadow-lg"
            >
              ← Back to Berlin
            </Link>
          </div>
        }
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const Icon = CATEGORY_ICONS[category];
            const count = categoryCounts[category] || 0;
            
            return (
              <Link
                key={category}
                href={`/berlin/c/${category}`}
                className="group block p-6 bg-white rounded-2xl shadow-soft hover:shadow-lg transition-all duration-200 border border-gray-100"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center group-hover:bg-brand-200 transition-colors">
                      <Icon className="w-6 h-6 text-brand-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-brand-600 transition-colors">
                      {CATEGORY_NAMES[category]}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {count} {count === 1 ? 'place' : 'places'} available
                    </p>
                    {count === 0 && (
                      <span className="inline-block mt-2 text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                        Coming soon
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        
        <div className="mt-16 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Can't find what you're looking for?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Help us grow our database by submitting your favorite dog-friendly places in Berlin. 
            Every submission helps fellow dog owners discover amazing new spots!
          </p>
          <Link
            href="/submit"
            className="inline-flex items-center px-6 py-3 bg-brand-600 text-white rounded-lg font-semibold hover:bg-brand-700 transition-colors"
          >
            Submit a Place
          </Link>
        </div>
      </div>
    </div>
  );
}
