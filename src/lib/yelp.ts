/**
 * Yelp Fusion API Integration
 * 
 * Free tier: 500 API calls per day
 * Docs: https://docs.developer.yelp.com/reference/v3_business_search
 */

const YELP_API_KEY = process.env.YELP_API_KEY || '';
const YELP_API_URL = 'https://api.yelp.com/v3';

export interface YelpBusiness {
  id: string;
  name: string;
  image_url: string;
  url: string;
  review_count: number;
  rating: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  location: {
    address1: string;
    city: string;
    state: string;
    country: string;
    zip_code: string;
  };
  phone: string;
  display_phone: string;
  categories: Array<{
    alias: string;
    title: string;
  }>;
  price?: string;
  photos?: string[];
}

export interface YelpSearchParams {
  term?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  radius?: number; // meters, max 40000
  categories?: string;
  limit?: number; // max 50
  offset?: number;
  sort_by?: 'best_match' | 'rating' | 'review_count' | 'distance';
  attributes?: string; // e.g., 'dogs_allowed'
}

/**
 * Search for dog-friendly businesses on Yelp
 */
export async function searchYelpPlaces(params: YelpSearchParams): Promise<{
  businesses: YelpBusiness[];
  total: number;
}> {
  if (!YELP_API_KEY) {
    throw new Error('YELP_API_KEY is not configured');
  }

  // Build query parameters
  const queryParams = new URLSearchParams();
  
  if (params.term) queryParams.append('term', params.term);
  if (params.location) queryParams.append('location', params.location);
  if (params.latitude) queryParams.append('latitude', params.latitude.toString());
  if (params.longitude) queryParams.append('longitude', params.longitude.toString());
  if (params.radius) queryParams.append('radius', Math.min(params.radius, 40000).toString());
  if (params.categories) queryParams.append('categories', params.categories);
  if (params.limit) queryParams.append('limit', Math.min(params.limit, 50).toString());
  if (params.offset) queryParams.append('offset', params.offset.toString());
  if (params.sort_by) queryParams.append('sort_by', params.sort_by);
  
  // Add dog-friendly attribute
  if (params.attributes) {
    queryParams.append('attributes', params.attributes);
  } else {
    queryParams.append('attributes', 'dogs_allowed');
  }

  const url = `${YELP_API_URL}/businesses/search?${queryParams.toString()}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${YELP_API_KEY}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Yelp API error: ${JSON.stringify(error)}`);
    }

    const data = await response.json();
    
    return {
      businesses: data.businesses || [],
      total: data.total || 0,
    };
  } catch (error) {
    console.error('Yelp API search error:', error);
    throw error;
  }
}

/**
 * Get detailed information about a specific business
 */
export async function getYelpBusinessDetails(businessId: string): Promise<YelpBusiness> {
  if (!YELP_API_KEY) {
    throw new Error('YELP_API_KEY is not configured');
  }

  const url = `${YELP_API_URL}/businesses/${businessId}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${YELP_API_KEY}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Yelp API error: ${JSON.stringify(error)}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Yelp API details error:', error);
    throw error;
  }
}

/**
 * Convert Yelp business to Dog Atlas place format
 */
export function convertYelpToPlace(business: YelpBusiness, cityId: string) {
  // Determine place type based on Yelp categories
  let placeType: 'parks' | 'cafes_restaurants' | 'accommodation' | 'shops_services' | 'walks_trails' = 'cafes_restaurants';
  
  const categoryAliases = business.categories.map(c => c.alias.toLowerCase());
  
  if (categoryAliases.some(a => a.includes('park') || a.includes('dog_parks'))) {
    placeType = 'parks';
  } else if (categoryAliases.some(a => a.includes('hotel') || a.includes('vacation'))) {
    placeType = 'accommodation';
  } else if (categoryAliases.some(a => a.includes('pet') || a.includes('vet') || a.includes('groomers'))) {
    placeType = 'shops_services';
  } else if (categoryAliases.some(a => a.includes('hiking') || a.includes('beaches'))) {
    placeType = 'walks_trails';
  }

  return {
    name: business.name,
    type: placeType,
    cityId: cityId,
    country: business.location.country,
    lat: business.coordinates.latitude,
    lng: business.coordinates.longitude,
    shortDescription: `${business.categories.map(c => c.title).join(', ')} · ${business.review_count} reviews on Yelp`,
    fullDescription: null,
    imageUrl: business.image_url || null,
    gallery: business.photos ? business.photos : undefined,
    rating: business.rating || null,
    websiteUrl: business.url || null,
    phone: business.display_phone || null,
    priceRange: business.price || null,
    source: 'yelp',
    tags: [
      ...business.categories.map(c => c.title),
      'dog-friendly',
      'yelp-verified'
    ],
  };
}

/**
 * Search for dog-friendly places in a specific city
 */
export async function searchDogFriendlyPlaces(city: string, category?: string) {
  const searchParams: YelpSearchParams = {
    location: city,
    attributes: 'dogs_allowed',
    limit: 50,
    sort_by: 'rating',
  };

  // Add category-specific terms
  if (category === 'parks') {
    searchParams.term = 'dog park';
    searchParams.categories = 'dog_parks,parks';
  } else if (category === 'cafes_restaurants') {
    searchParams.term = 'dog friendly';
    searchParams.categories = 'restaurants,cafes,bars';
  } else if (category === 'accommodation') {
    searchParams.term = 'pet friendly hotel';
    searchParams.categories = 'hotels,bedbreakfast,vacation_rentals';
  } else if (category === 'shops_services') {
    searchParams.term = 'pet';
    searchParams.categories = 'petservices,pet_stores,veterinarians';
  } else if (category === 'walks_trails') {
    searchParams.term = 'dog hiking';
    searchParams.categories = 'hiking,beaches';
  }

  return searchYelpPlaces(searchParams);
}
