export const PLACE_CATEGORIES = {
  // Recreation & Exercise
  park_offleash_area: {
    id: 'park_offleash_area',
    name: 'Off-Leash Parks',
    description: 'Fenced areas where dogs can run free and socialize',
    icon: '🏞️',
    color: '#10B981', // emerald-500
    group: 'recreation',
    order: 1,
    keywords: ['off-leash', 'dog park', 'fenced', 'free run', 'socialization']
  },
  park_onleash_area: {
    id: 'park_onleash_area',
    name: 'On-Leash Parks',
    description: 'Public parks and green spaces where dogs must be leashed',
    icon: '🌳',
    color: '#059669', // emerald-600
    group: 'recreation',
    order: 2,
    keywords: ['on-leash', 'park', 'green space', 'walk', 'nature']
  },
  trail_hiking: {
    id: 'trail_hiking',
    name: 'Hiking Trails',
    description: 'Mountain and forest trails for adventurous dogs',
    icon: '🥾',
    color: '#7C3AED', // violet-600
    group: 'recreation',
    order: 3,
    keywords: ['hiking', 'mountain', 'forest', 'adventure', 'nature trail']
  },
  trail_walking: {
    id: 'trail_walking',
    name: 'Walking Trails',
    description: 'Easy walking paths and urban trails',
    icon: '🚶',
    color: '#8B5CF6', // violet-500
    group: 'recreation',
    order: 4,
    keywords: ['walking', 'easy trail', 'urban', 'path', 'stroll']
  },
  beach_dog_friendly: {
    id: 'beach_dog_friendly',
    name: 'Dog Beaches',
    description: 'Beaches where dogs can swim and play in the sand',
    icon: '🏖️',
    color: '#0EA5E9', // sky-500
    group: 'recreation',
    order: 5,
    keywords: ['beach', 'swimming', 'sand', 'water', 'ocean']
  },
  lake_dog_friendly: {
    id: 'lake_dog_friendly',
    name: 'Dog-Friendly Lakes',
    description: 'Lakes and ponds for swimming and water activities',
    icon: '🏞️',
    color: '#06B6D4', // cyan-500
    group: 'recreation',
    order: 6,
    keywords: ['lake', 'pond', 'swimming', 'water', 'fresh water']
  },

  // Food & Drink
  cafe_dog_friendly: {
    id: 'cafe_dog_friendly',
    name: 'Dog-Friendly Cafés',
    description: 'Coffee shops and cafés that welcome dogs',
    icon: '☕',
    color: '#D97706', // amber-600
    group: 'food_drink',
    order: 7,
    keywords: ['café', 'coffee', 'outdoor seating', 'pet-friendly', 'treats']
  },
  restaurant_dog_friendly: {
    id: 'restaurant_dog_friendly',
    name: 'Dog-Friendly Restaurants',
    description: 'Restaurants with outdoor seating that welcome dogs',
    icon: '🍽️',
    color: '#DC2626', // red-600
    group: 'food_drink',
    order: 8,
    keywords: ['restaurant', 'dining', 'outdoor', 'patio', 'pet menu']
  },
  brewery_dog_friendly: {
    id: 'brewery_dog_friendly',
    name: 'Dog-Friendly Breweries',
    description: 'Breweries and beer gardens that welcome dogs',
    icon: '🍺',
    color: '#F59E0B', // amber-500
    group: 'food_drink',
    order: 9,
    keywords: ['brewery', 'beer garden', 'craft beer', 'outdoor', 'social']
  },

  // Services
  vet_clinic: {
    id: 'vet_clinic',
    name: 'Veterinary Clinics',
    description: 'General veterinary clinics for routine care',
    icon: '🏥',
    color: '#EF4444', // red-500
    group: 'services',
    order: 10,
    keywords: ['veterinarian', 'vet', 'clinic', 'medical', 'health']
  },
  vet_emergency: {
    id: 'vet_emergency',
    name: 'Emergency Vets',
    description: '24/7 emergency veterinary services',
    icon: '🚑',
    color: '#DC2626', // red-600
    group: 'services',
    order: 11,
    keywords: ['emergency', 'urgent care', '24/7', 'critical', 'trauma']
  },
  grooming_salon: {
    id: 'grooming_salon',
    name: 'Grooming Salons',
    description: 'Professional dog grooming and spa services',
    icon: '✂️',
    color: '#EC4899', // pink-500
    group: 'services',
    order: 12,
    keywords: ['grooming', 'spa', 'haircut', 'nail trim', 'bath']
  },
  grooming_mobile: {
    id: 'grooming_mobile',
    name: 'Mobile Grooming',
    description: 'Mobile grooming services that come to you',
    icon: '🚐',
    color: '#F472B6', // pink-400
    group: 'services',
    order: 13,
    keywords: ['mobile', 'at-home', 'convenience', 'van', 'doorstep']
  },
  pet_store: {
    id: 'pet_store',
    name: 'Pet Stores',
    description: 'Stores selling pet supplies, food, and accessories',
    icon: '🛍️',
    color: '#8B5CF6', // violet-500
    group: 'services',
    order: 14,
    keywords: ['pet store', 'supplies', 'food', 'toys', 'accessories']
  },
  doggy_daycare: {
    id: 'doggy_daycare',
    name: 'Doggy Daycare',
    description: 'Daycare centers for dog socialization and care',
    icon: '🏫',
    color: '#06B6D4', // cyan-500
    group: 'services',
    order: 15,
    keywords: ['daycare', 'socialization', 'play', 'care', 'boarding']
  },
  dog_training: {
    id: 'dog_training',
    name: 'Dog Training',
    description: 'Professional dog training and behavior services',
    icon: '🎓',
    color: '#3B82F6', // blue-500
    group: 'services',
    order: 16,
    keywords: ['training', 'obedience', 'behavior', 'puppy school', 'lessons']
  },

  // Accommodation
  hotel_pet_friendly: {
    id: 'hotel_pet_friendly',
    name: 'Pet-Friendly Hotels',
    description: 'Hotels that welcome dogs and their families',
    icon: '🏨',
    color: '#7C3AED', // violet-600
    group: 'accommodation',
    order: 17,
    keywords: ['hotel', 'accommodation', 'pet-friendly', 'travel', 'stay']
  },
  hostel_pet_friendly: {
    id: 'hostel_pet_friendly',
    name: 'Pet-Friendly Hostels',
    description: 'Budget-friendly hostels that accept dogs',
    icon: '🏠',
    color: '#8B5CF6', // violet-500
    group: 'accommodation',
    order: 18,
    keywords: ['hostel', 'budget', 'backpacker', 'shared', 'affordable']
  },
  apartment_pet_friendly: {
    id: 'apartment_pet_friendly',
    name: 'Pet-Friendly Rentals',
    description: 'Short-term rentals and apartments that welcome pets',
    icon: '🏡',
    color: '#A855F7', // purple-500
    group: 'accommodation',
    order: 19,
    keywords: ['apartment', 'rental', 'airbnb', 'vacation rental', 'short-term']
  },

  // Activities & Events
  dog_park_event: {
    id: 'dog_park_event',
    name: 'Dog Park Events',
    description: 'Special events and gatherings at dog parks',
    icon: '🎉',
    color: '#F59E0B', // amber-500
    group: 'activities',
    order: 20,
    keywords: ['event', 'gathering', 'meetup', 'social', 'community']
  },
  dog_training_class: {
    id: 'dog_training_class',
    name: 'Training Classes',
    description: 'Group training classes and workshops',
    icon: '📚',
    color: '#3B82F6', // blue-500
    group: 'activities',
    order: 21,
    keywords: ['class', 'group training', 'workshop', 'education', 'skills']
  },
  dog_meetup: {
    id: 'dog_meetup',
    name: 'Dog Meetups',
    description: 'Social meetups for dogs and their owners',
    icon: '👥',
    color: '#10B981', // emerald-500
    group: 'activities',
    order: 22,
    keywords: ['meetup', 'social', 'playdate', 'friends', 'community']
  },
  pet_expo: {
    id: 'pet_expo',
    name: 'Pet Expos',
    description: 'Pet shows, expos, and industry events',
    icon: '🏆',
    color: '#F59E0B', // amber-500
    group: 'activities',
    order: 23,
    keywords: ['expo', 'show', 'exhibition', 'competition', 'industry']
  },

  // Specialty
  dog_spa: {
    id: 'dog_spa',
    name: 'Dog Spas',
    description: 'Luxury spa treatments and wellness for dogs',
    icon: '🧖‍♀️',
    color: '#EC4899', // pink-500
    group: 'specialty',
    order: 24,
    keywords: ['spa', 'luxury', 'wellness', 'massage', 'aromatherapy']
  },
  pet_photography: {
    id: 'pet_photography',
    name: 'Pet Photography',
    description: 'Professional photography services for pets',
    icon: '📸',
    color: '#8B5CF6', // violet-500
    group: 'specialty',
    order: 25,
    keywords: ['photography', 'portraits', 'professional', 'memories', 'photos']
  },
  dog_taxi: {
    id: 'dog_taxi',
    name: 'Dog Taxi Services',
    description: 'Transportation services specifically for dogs',
    icon: '🚗',
    color: '#F59E0B', // amber-500
    group: 'specialty',
    order: 26,
    keywords: ['transportation', 'taxi', 'ride', 'travel', 'pickup']
  },
  pet_cemetery: {
    id: 'pet_cemetery',
    name: 'Pet Cemeteries',
    description: 'Memorial and burial services for beloved pets',
    icon: '🌹',
    color: '#6B7280', // gray-500
    group: 'specialty',
    order: 27,
    keywords: ['cemetery', 'memorial', 'burial', 'cremation', 'remembrance']
  }
} as const

export const CATEGORY_GROUPS = {
  recreation: {
    id: 'recreation',
    name: 'Recreation & Exercise',
    description: 'Parks, trails, and outdoor activities',
    icon: '🏃‍♂️',
    color: '#10B981',
    order: 1
  },
  food_drink: {
    id: 'food_drink',
    name: 'Food & Drink',
    description: 'Cafés, restaurants, and dining experiences',
    icon: '🍽️',
    color: '#F59E0B',
    order: 2
  },
  services: {
    id: 'services',
    name: 'Services',
    description: 'Veterinary, grooming, and pet care services',
    icon: '🏥',
    color: '#EF4444',
    order: 3
  },
  accommodation: {
    id: 'accommodation',
    name: 'Accommodation',
    description: 'Pet-friendly places to stay',
    icon: '🏨',
    color: '#8B5CF6',
    order: 4
  },
  activities: {
    id: 'activities',
    name: 'Activities & Events',
    description: 'Classes, meetups, and special events',
    icon: '🎉',
    color: '#3B82F6',
    order: 5
  },
  specialty: {
    id: 'specialty',
    name: 'Specialty Services',
    description: 'Unique and specialized pet services',
    icon: '✨',
    color: '#EC4899',
    order: 6
  }
} as const

export type PlaceCategory = keyof typeof PLACE_CATEGORIES
export type CategoryGroup = keyof typeof CATEGORY_GROUPS

// Helper functions
export function getCategoryInfo(category: PlaceCategory) {
  return PLACE_CATEGORIES[category]
}

export function getGroupInfo(group: CategoryGroup) {
  return CATEGORY_GROUPS[group]
}

export function getCategoriesByGroup(group: CategoryGroup) {
  return Object.values(PLACE_CATEGORIES)
    .filter(cat => cat.group === group)
    .sort((a, b) => a.order - b.order)
}

export function getAllCategoriesOrdered() {
  return Object.values(PLACE_CATEGORIES)
    .sort((a, b) => a.order - b.order)
}

export function getAllGroupsOrdered() {
  return Object.values(CATEGORY_GROUPS)
    .sort((a, b) => a.order - b.order)
}

export function getCategoryDisplay(category: PlaceCategory) {
  const info = getCategoryInfo(category)
  return `${info.icon} ${info.name}`
}

export function searchCategories(query: string): PlaceCategory[] {
  const searchTerm = query.toLowerCase()
  return Object.entries(PLACE_CATEGORIES)
    .filter(([_, info]) => 
      info.name.toLowerCase().includes(searchTerm) ||
      info.description.toLowerCase().includes(searchTerm) ||
      info.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm))
    )
    .map(([key, _]) => key as PlaceCategory)
}