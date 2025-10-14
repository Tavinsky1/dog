/**
 * Routing Utilities
 * 
 * URL builders and slug helpers for global navigation system.
 * Provides type-safe routing for country/city/place pages.
 */

/**
 * Build URL for country page
 */
export function countryUrl(countrySlug: string): string {
  return `/${countrySlug}`;
}

/**
 * Build URL for city page
 */
export function cityUrl(countrySlug: string, citySlug: string): string {
  return `/${countrySlug}/${citySlug}`;
}

/**
 * Build URL for place page
 */
export function placeUrl(
  countrySlug: string,
  citySlug: string,
  placeSlug: string
): string {
  return `/${countrySlug}/${citySlug}/p/${placeSlug}`;
}

/**
 * Build URL for category filtered city page
 */
export function categoryUrl(
  countrySlug: string,
  citySlug: string,
  category: string
): string {
  return `/${countrySlug}/${citySlug}?category=${category}`;
}

/**
 * Build URL for map view
 */
export function mapUrl(countrySlug?: string, citySlug?: string): string {
  if (citySlug && countrySlug) {
    return `/${countrySlug}/${citySlug}/map`;
  }
  if (countrySlug) {
    return `/${countrySlug}/map`;
  }
  return '/map';
}

/**
 * Parse URL to extract country/city/place slugs
 */
export function parseUrl(pathname: string): {
  countrySlug?: string;
  citySlug?: string;
  placeSlug?: string;
  isMap?: boolean;
} {
  const parts = pathname.split('/').filter(Boolean);

  if (parts.length === 0) {
    return {};
  }

  const result: ReturnType<typeof parseUrl> = {
    countrySlug: parts[0],
  };

  if (parts[1]) {
    if (parts[1] === 'map') {
      result.isMap = true;
    } else {
      result.citySlug = parts[1];
    }
  }

  if (parts[2] === 'p' && parts[3]) {
    result.placeSlug = parts[3];
  } else if (parts[2] === 'map') {
    result.isMap = true;
  }

  return result;
}

/**
 * Slugify text (for generating slugs from names)
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Build breadcrumb links
 */
export function buildBreadcrumbs(params: {
  country?: { name: string; slug: string };
  city?: { name: string; slug: string };
  place?: { name: string; slug: string };
}): Array<{ label: string; href: string }> {
  const breadcrumbs: Array<{ label: string; href: string }> = [
    { label: 'Home', href: '/' },
  ];

  if (params.country) {
    breadcrumbs.push({
      label: params.country.name,
      href: countryUrl(params.country.slug),
    });
  }

  if (params.city && params.country) {
    breadcrumbs.push({
      label: params.city.name,
      href: cityUrl(params.country.slug, params.city.slug),
    });
  }

  if (params.place && params.city && params.country) {
    breadcrumbs.push({
      label: params.place.name,
      href: placeUrl(params.country.slug, params.city.slug, params.place.slug),
    });
  }

  return breadcrumbs;
}

/**
 * Category display names
 */
export const CATEGORY_LABELS: Record<string, string> = {
  parks: 'Parks & Nature',
  cafes_restaurants: 'Cafés & Restaurants',
  trails: 'Walks & Trails',
  hotels: 'Accommodation',
  vets: 'Veterinarians',
  shops: 'Pet Shops',
  groomers: 'Groomers',
  trainers: 'Trainers',
  beaches: 'Beaches',
};

/**
 * Category icons (emoji)
 */
export const CATEGORY_ICONS: Record<string, string> = {
  parks: '🏞️',
  cafes_restaurants: '☕',
  trails: '🥾',
  hotels: '🏨',
  vets: '🏥',
  shops: '🛍️',
  groomers: '✂️',
  trainers: '🎓',
  beaches: '🏖️',
};

/**
 * Get category label
 */
export function getCategoryLabel(category: string): string {
  return CATEGORY_LABELS[category] || category;
}

/**
 * Get category icon
 */
export function getCategoryIcon(category: string): string {
  return CATEGORY_ICONS[category] || '📍';
}

/**
 * Get all categories
 */
export function getAllCategories(): string[] {
  return Object.keys(CATEGORY_LABELS);
}

/**
 * Validate country slug exists
 */
export function isValidCountrySlug(slug: string, validSlugs: string[]): boolean {
  return validSlugs.includes(slug);
}

/**
 * Validate city slug exists for country
 */
export function isValidCitySlug(
  countrySlug: string,
  citySlug: string,
  cities: Array<{ slug: string; country?: string }>
): boolean {
  return cities.some(
    c => c.slug === citySlug && (!c.country || c.country === countrySlug)
  );
}

/**
 * Generate canonical URL
 */
export function canonicalUrl(pathname: string, baseUrl?: string): string {
  const base = baseUrl || process.env.NEXT_PUBLIC_BASE_URL || 'https://dog-atlas.com';
  return `${base}${pathname}`;
}

/**
 * Build OpenGraph image URL
 */
export function ogImageUrl(params: {
  title: string;
  type?: 'country' | 'city' | 'place';
  image?: string;
}): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://dog-atlas.com';
  const searchParams = new URLSearchParams({
    title: params.title,
    type: params.type || 'city',
  });

  if (params.image) {
    searchParams.set('image', params.image);
  }

  return `${baseUrl}/api/og?${searchParams.toString()}`;
}

export default {
  countryUrl,
  cityUrl,
  placeUrl,
  categoryUrl,
  mapUrl,
  parseUrl,
  slugify,
  buildBreadcrumbs,
  getCategoryLabel,
  getCategoryIcon,
  getAllCategories,
  canonicalUrl,
  ogImageUrl,
};
