import { Metadata } from 'next';

export const siteConfig = {
  name: 'Dog Atlas',
  description: 'Discover the best dog-friendly places worldwide. Find parks, cafés, trails, hotels, and services for you and your furry companion.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://dog-atlas.com',
  ogImage: '/images/og-image.jpg',
  keywords: [
    'dog friendly',
    'dog parks',
    'pet friendly cafes',
    'dog friendly restaurants',
    'dog friendly hotels',
    'dog beaches',
    'dog trails',
    'pet services',
    'dog grooming',
    'veterinary',
    'dog walking',
    'pet friendly travel',
    'dog atlas',
  ],
};

export function generateSEOMetadata({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
  noIndex = false,
}: {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  noIndex?: boolean;
}): Metadata {
  const metaTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  const metaDescription = description || siteConfig.description;
  const metaImage = image || siteConfig.ogImage;
  const metaUrl = url || siteConfig.url;
  const allKeywords = [...siteConfig.keywords, ...keywords].join(', ');

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: allKeywords,
    authors: [{ name: 'Dog Atlas Team' }],
    creator: 'Dog Atlas',
    publisher: 'Dog Atlas',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: metaUrl,
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: metaUrl,
      siteName: siteConfig.name,
      images: [
        {
          url: metaImage,
          width: 1200,
          height: 630,
          alt: metaTitle,
        },
      ],
      locale: 'en_US',
      type,
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [metaImage],
      creator: '@dogatlas',
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon.ico',
      apple: '/favicon.ico',
    },
    manifest: '/manifest.json',
  };
}

// Generate JSON-LD structured data for rich snippets
export function generateLocalBusinessSchema(place: {
  name: string;
  description?: string;
  address?: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  rating?: number;
  reviewCount?: number;
  categories: string[];
  image?: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: place.name,
    description: place.description,
    image: place.image,
    url: place.url,
    address: {
      '@type': 'PostalAddress',
      addressLocality: place.city,
      addressCountry: place.country,
      streetAddress: place.address,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: place.lat,
      longitude: place.lng,
    },
    aggregateRating: place.rating && place.reviewCount ? {
      '@type': 'AggregateRating',
      ratingValue: place.rating,
      reviewCount: place.reviewCount,
    } : undefined,
    amenityFeature: [
      {
        '@type': 'LocationFeatureSpecification',
        name: 'Dog Friendly',
        value: true,
      },
    ],
  };
}

export function generateCitySchema(city: {
  name: string;
  country: string;
  description: string;
  placeCount: number;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'City',
    name: city.name,
    description: city.description,
    containedInPlace: {
      '@type': 'Country',
      name: city.country,
    },
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    logo: `${siteConfig.url}/favicon.ico`,
    sameAs: [
      // Add your social media profiles here
      // 'https://twitter.com/dogatlas',
      // 'https://instagram.com/dogatlas',
    ],
  };
}
