export const PLACE_CATEGORIES = {
  // Consolidated categories
  parks: {
    id: 'parks',
    name: 'Parks',
    description: 'Dog parks, green areas, off-leash zones, nature spots',
    icon: '🏞️',
    color: '#10B981', // emerald-500
    group: 'recreation',
    order: 1,
    keywords: ['park', 'dog park', 'green area', 'off-leash', 'nature', 'outdoor']
  },
  cafes_restaurants: {
    id: 'cafes_restaurants',
    name: 'Cafés & Restaurants',
    description: 'Places where dogs are welcome indoors/outdoors',
    icon: '☕',
    color: '#D97706', // amber-600
    group: 'food_drink',
    order: 2,
    keywords: ['café', 'restaurant', 'dog-friendly', 'outdoor seating', 'pet-friendly']
  },
  accommodation: {
    id: 'accommodation',
    name: 'Accommodation',
    description: 'Dog-friendly hotels, Airbnbs, hostels',
    icon: '🏨',
    color: '#7C3AED', // violet-600
    group: 'accommodation',
    order: 3,
    keywords: ['hotel', 'airbnb', 'hostel', 'pet-friendly', 'accommodation']
  },
  shops_services: {
    id: 'shops_services',
    name: 'Shops & Services',
    description: 'Pet shops, vets, groomers, dog sitters, trainers',
    icon: '🛍️',
    color: '#EF4444', // red-500
    group: 'services',
    order: 4,
    keywords: ['pet shop', 'vet', 'groomer', 'trainer', 'services']
  },
  walks_trails: {
    id: 'walks_trails',
    name: 'Walks & Trails',
    description: 'Urban walks, hiking paths, beaches',
    icon: '🚶',
    color: '#8B5CF6', // violet-500
    group: 'recreation',
    order: 5,
    keywords: ['walk', 'trail', 'hiking', 'beach', 'urban', 'nature']
  },
  tips_local_info: {
    id: 'tips_local_info',
    name: 'Tips & Local Info',
    description: 'Rules, transport info, cultural notes, events',
    icon: '📌',
    color: '#3B82F6', // blue-500
    group: 'information',
    order: 6,
    keywords: ['tips', 'local info', 'rules', 'transport', 'events', 'culture']
  }
} as const

export const CATEGORY_GROUPS = {
  recreation: {
    id: 'recreation',
    name: 'Recreation',
    description: 'Parks, walks, and outdoor activities',
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
    description: 'Pet shops, vets, groomers, and other services',
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
  information: {
    id: 'information',
    name: 'Local Info',
    description: 'Tips, rules, and local information',
    icon: '📌',
    color: '#3B82F6',
    order: 5
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