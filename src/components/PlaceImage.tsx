'use client';

import { CldImage } from 'next-cloudinary';
import { useState } from 'react';

interface PlaceImageProps {
  src: string | null | undefined;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
}

// Default placeholder for places without images
const DEFAULT_PLACEHOLDER = 'dog-atlas/placeholder';

/**
 * PlaceImage component that uses Cloudinary for optimized image delivery.
 * 
 * Image URL formats supported:
 * - Cloudinary public ID: "dog-atlas/places/berlin/some-place"
 * - Full Cloudinary URL: "https://res.cloudinary.com/..."
 * - Local path: "/images/places/some-image.jpg" (will be converted to Cloudinary)
 * - External URL: "https://example.com/image.jpg" (will use Cloudinary fetch)
 */
export default function PlaceImage({
  src,
  alt,
  width = 800,
  height = 600,
  className = '',
  fill = false,
  priority = false,
  sizes,
}: PlaceImageProps) {
  const [hasError, setHasError] = useState(false);
  
  // If no src or error, show placeholder
  if (!src || hasError) {
    return (
      <CldImage
        src={DEFAULT_PLACEHOLDER}
        alt={alt}
        width={width}
        height={height}
        className={className}
        crop="fill"
        gravity="auto"
        {...(fill && { fill: true })}
        {...(sizes && { sizes })}
      />
    );
  }

  // Determine the image source type and handle accordingly
  const getCloudinarySrc = (imageUrl: string): string => {
    // Already a Cloudinary public ID (no slashes at start, no http)
    if (!imageUrl.startsWith('/') && !imageUrl.startsWith('http')) {
      return imageUrl;
    }
    
    // Local path like /images/places/xxx.jpg - convert to Cloudinary public ID
    if (imageUrl.startsWith('/images/places/')) {
      // Extract filename without extension and use as public ID
      const filename = imageUrl.replace('/images/places/', '').replace(/\.(jpg|jpeg|png|webp)$/i, '');
      return `dog-atlas/places/${filename}`;
    }
    
    // External URL - use as-is (Cloudinary will fetch it)
    return imageUrl;
  };

  const cloudinarySrc = getCloudinarySrc(src);
  const isExternalUrl = src.startsWith('http') && !src.includes('cloudinary.com');

  // For external URLs, use regular img tag with Cloudinary fetch URL
  if (isExternalUrl) {
    const fetchUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/fetch/c_fill,w_${width},h_${height},q_auto,f_auto/${encodeURIComponent(src)}`;
    
    return (
      <img
        src={fetchUrl}
        alt={alt}
        className={className}
        onError={() => setHasError(true)}
        loading={priority ? 'eager' : 'lazy'}
      />
    );
  }

  return (
    <CldImage
      src={cloudinarySrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      crop="fill"
      gravity="auto"
      quality="auto"
      format="auto"
      onError={() => setHasError(true)}
      {...(fill && { fill: true })}
      {...(priority && { priority: true })}
      {...(sizes && { sizes })}
    />
  );
}
